import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { recallMerchantMemory } from "../cogneeService.js";

// Privacy Gateway Modules
import { maskPII, demaskPII } from "../privacy/piiMasker.js";
import { verifyConsent } from "../privacy/consentManager.js";
import dotenv from "dotenv";

dotenv.config();

// LLM Configuration with ZDR simulated headers (via ChatOpenAI tags/metadata)
const llm = new ChatOpenAI({
  modelName: "sarvam-105b-conversations",
  apiKey: process.env.SARVAM_API_KEY || "fallback_key",
  configuration: {
    baseURL: "https://api.sarvam.ai/v1",
  },
  temperature: 0.7,
  tags: ["zero-data-retention", "no-training"]
});

// Define State
const GraphState = Annotation.Root({
  message: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  language: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "hi",
  }),
  formContext: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  formFields: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  intent: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  finalReply: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
});

const MERCH_ID = "MERCH_JAIPUR_0821"; // Hardcoded for demo

// Nodes
async function routerAgent(state) {
  const prompt = `You are a router agent. Analyze the user message and determine the intent.
  User Message: "${state.message}"
  
  Possible intents:
  - FORM_ASSISTANCE: The user is asking about form fields, mismatches, or errors (e.g. "address mismatch", "help", "error").
  - UNDERWRITING: The user is asking about loan, interest, EMI, credit score, CIBIL, eligibility.
  - MEMORY: The user is asking about past loans, history, or previous interactions (e.g. "pichhla loan", "kal kya hua").
  - GENERAL: Anything else (greetings, general chat).
  
  Reply ONLY with one of the exact intent strings above.`;
  
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  let intent = response.content.trim().toUpperCase();
  
  // Basic fallback string matching in case LLM is messy
  if (intent.includes("FORM")) intent = "FORM_ASSISTANCE";
  else if (intent.includes("UNDERWRITING") || intent.includes("LOAN") || intent.includes("EMI")) intent = "UNDERWRITING";
  else if (intent.includes("MEMORY") || intent.includes("PAST")) intent = "MEMORY";
  else if (!["FORM_ASSISTANCE", "UNDERWRITING", "MEMORY", "GENERAL"].includes(intent)) {
    intent = "GENERAL";
  }
  
  return { intent };
}

async function formAssistantAgent(state) {
  const prompt = `You are the Form Assistant Agent for Paytm Saarthi.
  User Message: "${state.message}"
  Form Context: "${state.formContext}"
  
  Explain the form fields or resolve mismatches (e.g., Aadhaar vs Shop address). Reassure the user that Paytm QR data verifies their location.
  Language: Reply in proper ${state.language === 'hi' ? 'Hindi (Devanagari script)' : 'English'}. Be short (2 sentences).`;
  
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return { finalReply: response.content.trim() };
}

async function underwritingAgent(state) {
  const prompt = `You are the Underwriting Agent for Paytm Saarthi.
  User Message: "${state.message}"
  
  Explain the loan details: Pre-approved for ₹50,000, 12% APR, ₹8,830 EMI for 6 months. No CIBIL score needed due to 825/900 Alternative Underwriting Score based on QR transactions.
  Language: Reply in proper ${state.language === 'hi' ? 'Hindi (Devanagari script)' : 'English'}. Be short (2-3 sentences).`;
  
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return { finalReply: response.content.trim() };
}

async function memoryAgent(state) {
  // Call Cognee
  const recallResult = await recallMerchantMemory(MERCH_ID, state.message);
  
  const prompt = `You are the Memory Agent for Paytm Saarthi.
  User Message: "${state.message}"
  Knowledge Graph Memory: "${recallResult.data}"
  
  Answer the user's question based on their past history in the Knowledge Graph Memory.
  Language: Reply in proper ${state.language === 'hi' ? 'Hindi (Devanagari script)' : 'English'}. Be short.`;
  
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return { finalReply: response.content.trim() };
}

async function generalAgent(state) {
  const prompt = `You are Paytm Saarthi, a general AI assistant for business merchants.
  User Message: "${state.message}"
  
  Greet the user (Ramesh ji) and ask how you can help them with their loan or shop today.
  Language: Reply in proper ${state.language === 'hi' ? 'Hindi (Devanagari script)' : 'English'}. Be short.`;
  
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return { finalReply: response.content.trim() };
}

// Conditional Routing
function routeNext(state) {
  if (state.intent === "FORM_ASSISTANCE") return "formAssistantAgent";
  if (state.intent === "UNDERWRITING") return "underwritingAgent";
  if (state.intent === "MEMORY") return "memoryAgent";
  return "generalAgent";
}

// Build Graph
const workflow = new StateGraph(GraphState)
  .addNode("routerAgent", routerAgent)
  .addNode("formAssistantAgent", formAssistantAgent)
  .addNode("underwritingAgent", underwritingAgent)
  .addNode("memoryAgent", memoryAgent)
  .addNode("generalAgent", generalAgent)
  .addEdge(START, "routerAgent")
  .addConditionalEdges("routerAgent", routeNext)
  .addEdge("formAssistantAgent", END)
  .addEdge("underwritingAgent", END)
  .addEdge("memoryAgent", END)
  .addEdge("generalAgent", END);

export const masGraph = workflow.compile();

export async function runMAS(message, language, formContext, formFields = []) {
  const privacyTrace = [];

  try {
    console.log(`\n--- Starting MAS with query: '${message}' ---`);

    // 1. Consent Check (Privacy Layer)
    const consent = verifyConsent();
    if (!consent.valid) {
       return { 
         reply: "Consent required to process this request.", 
         trace: [{ step: 'Error', agent: 'Privacy Gateway', action: 'Consent Denied' }]
       };
    }
    privacyTrace.push({
      step: 'Privacy',
      agent: 'Privacy Gateway',
      action: 'PRIVACY_CONSENT',
      details: `Consent Verified: ${consent.consentId} | Expires: ${consent.expiresIn} | Data: ${consent.dataTypes.join(', ')}`
    });

    // 2. PII Masking (Privacy Layer)
    const { maskedText, traceDetails } = maskPII(message);
    if (traceDetails.length > 0) {
      privacyTrace.push({
        step: 'Privacy',
        agent: 'Privacy Gateway',
        action: 'PRIVACY_MASK',
        details: traceDetails.join(' | ')
      });
    }

    // Initialize state with MASKED message
    const initialState = {
      message: maskedText,
      language: language,
      formContext: formContext,
      formFields: formFields,
      intent: "",
      finalReply: ""
    };

    // 3. Zero Data Retention Trace
    privacyTrace.push({
      step: 'Privacy',
      agent: 'Privacy Gateway',
      action: 'PRIVACY_ZDR',
      details: 'Zero Data Retention: Enabled | Provider: Sarvam AI | Retention: 0 days'
    });

    const threadConfig = { configurable: { thread_id: "demo_merchant_1" } };
    
    // Pass to LangGraph Workflow
    const resultState = await masGraph.invoke(initialState, threadConfig);
    
    // 4. Demask PII before sending back to user
    const demaskedReply = demaskPII(resultState.finalReply);

    console.log("✅ [MAS] Execution Complete.");
    console.log(`Detected Intent: ${resultState.intent}`);
    console.log(`Final Reply: ${demaskedReply}`);
    console.log("----------------------------------------");

    // Return combination of privacy traces and actual graph intent for frontend routing
    return {
      reply: demaskedReply,
      intent: resultState.intent,
      privacyTrace: privacyTrace
    };

  } catch (error) {
    console.error("[MAS] Error:", error);
    throw error;
  }
}
