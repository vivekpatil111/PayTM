import os
from langchain_openai import ChatOpenAI
from state import AgentState

# Initialize LLM
llm = ChatOpenAI(
    model="sarvam-105b-conversations",
    api_key=os.getenv("SARVAM_API_KEY", "fallback_key"),
    base_url="https://api.sarvam.ai/v1",
    temperature=0.7
)

def router_agent(state: AgentState) -> dict:
    print(f"🚀 [MAS] Router Agent analyzing message: '{state.get('message')}'")
    prompt = f"""You are a router agent. Analyze the user message and determine the intent.
    User Message: "{state.get('message')}"
    
    Possible intents:
    - FORM_ASSISTANCE: The user is asking about form fields, mismatches, or errors.
    - UNDERWRITING: The user is asking about loan, interest, EMI, credit score, eligibility.
    - MEMORY: The user is asking about past loans, history, or previous interactions.
    - GENERAL: Anything else (greetings, general chat).
    
    Reply ONLY with one of the exact intent strings above."""
    
    response = llm.invoke(prompt)
    intent = response.content.strip().upper()
    
    # Fallback string matching
    if "FORM" in intent: intent = "FORM_ASSISTANCE"
    elif any(kw in intent for kw in ["UNDERWRITING", "LOAN", "EMI"]): intent = "UNDERWRITING"
    elif any(kw in intent for kw in ["MEMORY", "PAST"]): intent = "MEMORY"
    elif intent not in ["FORM_ASSISTANCE", "UNDERWRITING", "MEMORY", "GENERAL"]:
        intent = "GENERAL"
        
    return {"intent": intent}

def form_assistant_agent(state: AgentState) -> dict:
    lang_str = "Hindi (Devanagari script)" if state.get("language") == "hi" else "English"
    prompt = f"""You are the Form Assistant Agent for Paytm Saarthi.
    User Message: "{state.get('message')}"
    Form Context: "{state.get('formContext', '')}"
    
    Explain the form fields or resolve mismatches (e.g., Aadhaar vs Shop address). 
    Reassure the user that Paytm QR data verifies their location.
    Language: Reply in proper {lang_str}. Be short (2 sentences)."""
    
    response = llm.invoke(prompt)
    return {"finalReply": response.content.strip()}

def underwriting_agent(state: AgentState) -> dict:
    lang_str = "Hindi (Devanagari script)" if state.get("language") == "hi" else "English"
    prompt = f"""You are the Underwriting Agent for Paytm Saarthi.
    User Message: "{state.get('message')}"
    
    Explain the loan details: Pre-approved for ₹50,000, 12% APR, ₹8,830 EMI for 6 months. 
    No CIBIL score needed due to 825/900 Alternative Underwriting Score based on QR transactions.
    Language: Reply in proper {lang_str}. Be short (2-3 sentences)."""
    
    response = llm.invoke(prompt)
    return {"finalReply": response.content.strip()}

def memory_agent(state: AgentState) -> dict:
    # Mocking Cognee Knowledge Graph recall for this standalone version
    mock_memory = "Ramesh took a loan of 50,000 yesterday and has an active wallet balance."
    lang_str = "Hindi (Devanagari script)" if state.get("language") == "hi" else "English"
    prompt = f"""You are the Memory Agent for Paytm Saarthi.
    User Message: "{state.get('message')}"
    Knowledge Graph Memory: "{mock_memory}"
    
    Answer the user's question based on their past history in the Knowledge Graph Memory.
    Language: Reply in proper {lang_str}. Be short."""
    
    response = llm.invoke(prompt)
    return {"finalReply": response.content.strip()}

def general_agent(state: AgentState) -> dict:
    lang_str = "Hindi (Devanagari script)" if state.get("language") == "hi" else "English"
    prompt = f"""You are Paytm Saarthi, a general AI assistant for business merchants.
    User Message: "{state.get('message')}"
    
    Greet the user (Ramesh ji) and ask how you can help them with their loan or shop today.
    Language: Reply in proper {lang_str}. Be short."""
    
    response = llm.invoke(prompt)
    return {"finalReply": response.content.strip()}
