import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { createRequire } from 'module';
import { initCognee, rememberMerchantHistory, recallMerchantMemory } from './cogneeService.js';

dotenv.config();

// ── Load mock merchant personas from shared JSON ──────────────────────────────
const require = createRequire(import.meta.url);
const MOCK_MERCHANTS = require('../frontend/src/lib/mockMerchants.json');
// Index by merchantId for O(1) lookup
const MERCHANT_MAP = Object.fromEntries(MOCK_MERCHANTS.map(m => [m.merchantId, m]));

// ── n8n Webhook with Exponential-Backoff Retry ────────────────────────────────
async function sendWebhookWithRetry(url, payload, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        console.log(`✅ [n8n] Webhook delivered on attempt ${attempt + 1}`);
        return { success: true, attempt: attempt + 1 };
      }
      console.warn(`⚠️ [n8n] Webhook attempt ${attempt + 1} returned HTTP ${res.status}`);
    } catch (err) {
      console.warn(`⚠️ [n8n] Webhook attempt ${attempt + 1} failed: ${err.message}`);
    }
    if (attempt < retries - 1) {
      await new Promise(r => setTimeout(r, 500 * (attempt + 1))); // 500ms, 1000ms, 1500ms
    }
  }
  console.error('❌ [n8n] All webhook retry attempts exhausted.');
  return { success: false };
}

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize Sarvam AI Client (via OpenAI SDK)
let aiClient = null;
if (process.env.SARVAM_API_KEY) {
  try {
    aiClient = new OpenAI({
      baseURL: 'https://api.sarvam.ai/v1',
      apiKey: process.env.SARVAM_API_KEY
    });
    console.log('✅ Sarvam AI Client initialized');
  } catch (err) {
    console.warn('⚠️ Could not initialize Sarvam AI client:', err.message);
  }
} else {
  console.log('ℹ️ Running in resilient demo mode (Set SARVAM_API_KEY in .env)');
}

// Initialize Cognee memory graph SDK
// initCognee();

// -------------------------------------------------------------
// In-Memory Database — seeded from mockMerchants.json
// Runtime state (wallet balance, active loans) is overlaid here
// so individual demo runs stay isolated.
// -------------------------------------------------------------
const runtimeState = {}; // keyed by merchantId: { walletBalance, activeLoan }

function getMerchant(merchantId = 'MERCH_JAIPUR_0821') {
  const base = MERCHANT_MAP[merchantId] || MERCHANT_MAP['MERCH_JAIPUR_0821'];
  const state = runtimeState[base.merchantId] || {};
  return {
    ...base,
    walletBalance: state.walletBalance ?? base.walletBalance,
    activeLoan: state.activeLoan ?? base.activeLoan ?? null
  };
}

// Keep backward-compat alias used by old code paths
const merchantDB = getMerchant();

// -------------------------------------------------------------
// Cognee-Style Semantic Knowledge Graph Store
// -------------------------------------------------------------
let knowledgeGraph = {
  nodes: [
    { id: 'merchant_1', label: 'Ramesh Sharma', type: 'Merchant', status: 'ACTIVE' },
    { id: 'business_1', label: 'Ramesh Kirana Store', type: 'BusinessEntity', status: 'VERIFIED' },
    { id: 'qr_ledger_1', label: 'QR Sales Ledger (4,520 Txns)', type: 'FinancialDataSource', status: 'AUDITED' },
    { id: 'cibil_record', label: 'CIBIL Bureau Check', type: 'CreditBureau', status: 'THIN_FILE_NO_HIT' },
    { id: 'underwrite_engine', label: 'Alternative Underwriting (Score: 825)', type: 'IntelligenceEngine', status: 'ELIGIBLE' },
    { id: 'aa_sbi_consent', label: 'RBI Account Aggregator (SBI)', type: 'ConsentFramework', status: 'READY' },
    { id: 'partner_nbfc', label: 'Aditya Birla / SMFG Lending Rails', type: 'NBFC_Partner', status: 'ALLOCATED' }
  ],
  edges: [
    { source: 'merchant_1', target: 'business_1', relation: 'OWNS' },
    { source: 'business_1', target: 'qr_ledger_1', relation: 'STREAM_DATA' },
    { source: 'merchant_1', target: 'cibil_record', relation: 'BUREAU_LOOKUP' },
    { source: 'qr_ledger_1', target: 'underwrite_engine', relation: 'FEEDS_ALTERNATIVE_METRICS' },
    { source: 'underwrite_engine', target: 'aa_sbi_consent', relation: 'TRIGGERS_AA_VERIFICATION' },
    { source: 'underwrite_engine', target: 'partner_nbfc', relation: 'ROUTES_UNDERWRITTEN_OFFER' }
  ],
  insights: [
    'Ramesh has 0 CIBIL score, but ranks in top 15% merchant stability in Jaipur.',
    '78.4% unique customer diversity proves organic footfall without circular transactions.',
    'Daily auto-settlement record of 178 days without failure demonstrates steady liquidity.'
  ]
};

// -------------------------------------------------------------
// Live Agent Telemetry Logs (for Web Command Center)
// -------------------------------------------------------------
let telemetryLogs = [
  {
    timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
    stage: 'SYSTEM_BOOT',
    message: 'Saarthi Autonomous Execution Engine initialized for Paytm Merchant Network.',
    latencyMs: 12
  },
  {
    timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
    stage: 'DATA_STREAM',
    message: 'Ingested 4,520 QR transactions for Ramesh Kirana Store. Cashflow index computed.',
    latencyMs: 84
  }
];

function logTelemetry(stage, message, latencyMs = Math.floor(Math.random() * 80) + 40) {
  const entry = {
    timestamp: new Date().toLocaleTimeString(),
    stage,
    message,
    latencyMs
  };
  telemetryLogs.unshift(entry);
  if (telemetryLogs.length > 50) telemetryLogs.pop();
  return entry;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Get Merchant Overview & Telemetry
// Supports ?id=MERCH_JAIPUR_0821 for multi-persona demo
app.get('/api/merchant', (req, res) => {
  const merchantId = req.query.id || 'MERCH_JAIPUR_0821';
  const merchant = getMerchant(merchantId);
  if (!merchant) {
    return res.status(404).json({ success: false, message: 'Merchant not found' });
  }
  res.json({
    success: true,
    data: merchant,
    telemetry: telemetryLogs.slice(0, 10),
    // Expose full persona list so UI can render selector
    availablePersonas: MOCK_MERCHANTS.map(m => ({
      merchantId: m.merchantId,
      name: m.name,
      businessName: m.businessName,
      city: m._meta.city,
      tier: m._meta.tier,
      altScore: m._meta.altScore
    }))
  });
});

// 2. Cognee Knowledge Graph
app.get('/api/memory/graph', (req, res) => {
  res.json({
    success: true,
    data: knowledgeGraph
  });
});

// 3. Alternative Underwriting Engine API
app.get('/api/underwrite/evaluate', (req, res) => {
  const m = merchantDB.qrMetrics;
  
  // Scoring algorithm based on 4 alternative pillars
  const cashflowConsistency = Math.min(100, Math.round((m.avgMonthlyGmv / 1000) * 1.1));
  const payerDiversity = Math.round(m.uniquePayerRatio);
  const settlementReliability = m.bouncedSettlements === 0 ? 98 : 60;
  const growthMomentum = Math.round(Math.min(100, 70 + m.growthMoM * 2));

  // Weighted composite score (out of 900)
  const weightedPercentage = (
    cashflowConsistency * 0.35 +
    payerDiversity * 0.25 +
    settlementReliability * 0.25 +
    growthMomentum * 0.15
  );
  const compositeScore = Math.round(300 + (weightedPercentage / 100) * 600); // 300 - 900 scale

  const eligibleAmount = compositeScore > 750 ? 50000 : 25000;
  const maxLimit = compositeScore > 800 ? 100000 : 50000;

  logTelemetry('UNDERWRITING_EVAL', `Calculated alternative score ${compositeScore}/900 based on ${m.totalTransactions180d} QR transactions.`);

  res.json({
    success: true,
    data: {
      compositeScore,
      rating: compositeScore >= 800 ? 'EXCELLENT_TIER_1' : 'GOOD_TIER_2',
      cibilStatus: merchantDB.cibilStatus,
      pillarBreakdown: [
        { name: 'Daily QR Cashflow Velocity', score: cashflowConsistency, weight: '35%', desc: '₹86,400 monthly GMV consistency' },
        { name: 'Payer Diversity Ratio', score: payerDiversity, weight: '25%', desc: '78.4% unique customers (Fraud-free)' },
        { name: 'Settlement Regularity', score: settlementReliability, weight: '25%', desc: '178 settlements without bounce' },
        { name: 'MoM Sales Momentum', score: growthMomentum, weight: '15%', desc: '+14.2% MoM QR volume growth' }
      ],
      preApprovedOffer: {
        amount: eligibleAmount,
        maxLimit: maxLimit,
        interestRateApr: 12.0,
        tenureMonths: 6,
        monthlyEmi: 8830,
        dailyDeduction: 294.33,
        processingFee: 0,
        partnerNbfc: 'Aditya Birla Finance / SMFG India Credit'
      }
    }
  });
});

// 4. Account Aggregator Consent Execution
app.post('/api/aa/consent', (req, res) => {
  const { consentGranted } = req.body;
  if (!consentGranted) {
    return res.status(400).json({ success: false, message: 'Consent declined by user.' });
  }

  logTelemetry('AA_CONSENT_ACQUIRED', 'RBI Account Aggregator digital token signed for SBI A/C ending 4821.', 140);
  logTelemetry('AA_STATEMENT_FETCH', 'Fetched 3-month verified cashflow summary via Account Aggregator rails.', 220);

  // Update knowledge graph
  const consentNode = knowledgeGraph.nodes.find(n => n.id === 'aa_sbi_consent');
  if (consentNode) consentNode.status = 'CONSENT_VERIFIED_AUTHENTICATED';

  res.json({
    success: true,
    consentId: 'AA-PAYTM-SBIN-2026-08192',
    timestamp: new Date().toISOString(),
    fipName: 'State Bank of India',
    statementSummary: {
      averageMonthlyCredits: 91200,
      zeroChequeBounces: true,
      minAverageDailyBalance: 12450,
      verified: true
    }
  });
});

// 5. Autonomous Disbursal Engine
app.post('/api/disburse', (req, res) => {
  const { merchantId = 'MERCH_JAIPUR_0821', amount = 50000, tenureMonths = 6 } = req.body;
  const merchant = getMerchant(merchantId);

  const txnId = `PTM-DISB-${Date.now().toString().slice(-8)}`;
  const activeLoan = {
    loanId: `LN-${Date.now().toString().slice(-6)}`,
    principal: amount,
    tenureMonths,
    monthlyEmi: 8830,
    disbursedAt: new Date().toISOString(),
    status: 'ACTIVE'
  };

  // Update runtime state (non-destructive overlay on mock JSON)
  runtimeState[merchant.merchantId] = {
    walletBalance: (runtimeState[merchant.merchantId]?.walletBalance ?? merchant.walletBalance) + amount,
    activeLoan
  };

  // Trigger n8n Webhook with retry (non-blocking)
  const webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://pratham0105.app.n8n.cloud/webhook/disburse';
  sendWebhookWithRetry(webhookUrl, {
    merchantId: merchant.merchantId,
    name: merchant.name,
    loanAmount: amount,
    txnId,
    disbursedAt: activeLoan.disbursedAt,
    event: 'DISBURSAL_SUCCESS'
  }).catch(err => console.error('[n8n] Retry wrapper error:', err));

  // Add node and edge to Cognee Knowledge Graph
  const loanNodeId = `loan_${Date.now()}`;
  knowledgeGraph.nodes.push({
    id: loanNodeId,
    label: `Loan ₹${amount.toLocaleString('en-IN')}`,
    type: 'ActiveLoan',
    status: 'DISBURSED_ACTIVE'
  });
  knowledgeGraph.edges.push({
    source: 'merchant_1',
    target: loanNodeId,
    relation: 'BORROWED'
  });

  knowledgeGraph.insights.push(
    `${merchant.name} successfully took ₹${amount.toLocaleString('en-IN')} loan. Once 2 EMIs are paid on time, eligibility dynamically unlocks to ₹1,00,000.`
  );

  logTelemetry('NBFC_API_ALLOCATION', `Disbursal request cleared by Aditya Birla Capital API in 110ms.`);
  logTelemetry('DISBURSAL_COMPLETE', `₹${amount.toLocaleString('en-IN')} credited to Paytm Business Account. Ref: ${txnId}`, 95);

  const updatedMerchant = getMerchant(merchant.merchantId);
  res.json({
    success: true,
    data: {
      txnId,
      amount,
      updatedBalance: updatedMerchant.walletBalance,
      creditedTo: `Paytm Merchant Current Account (${merchant.bankAccount.accountMasked})`,
      soundboxAnnouncement: `Paytm par ${amount === 50000 ? 'pachaas hazaar' : amount} rupaye prapt hue.`,
      disbursedAt: activeLoan.disbursedAt,
      activeLoan
    }
  });
});

// 6. Reset Demo State — clears runtime overlays for all or a specific merchant
app.post('/api/reset', (req, res) => {
  const { merchantId } = req.body || {};
  if (merchantId && runtimeState[merchantId]) {
    delete runtimeState[merchantId];
  } else {
    // Reset all
    Object.keys(runtimeState).forEach(k => delete runtimeState[k]);
  }
  knowledgeGraph.nodes = knowledgeGraph.nodes.filter(n => n.type !== 'ActiveLoan');
  knowledgeGraph.edges = knowledgeGraph.edges.filter(e => e.relation !== 'BORROWED');
  logTelemetry('DEMO_RESET', 'Merchant state and active loans reset to initial baseline.');
  res.json({ success: true, message: 'Demo state reset successfully' });
});

// 7. Saarthi AI Chat & Voice Assistant (Sarvam AI or Resilient Engine)
app.post('/api/agent/chat', async (req, res) => {
  const { message, language = 'hi', currentPage = 'Unknown', formFields = [] } = req.body;

  const lowerMsg = (message || '').toLowerCase();
  logTelemetry('VOICE_INTENT_INGEST', `Received intent: "${message}" (${language})`, 45);

  // Build form context string from fields passed by frontend
  const formContext = formFields.length > 0
    ? `\nCurrently visible form fields on page "${currentPage}":\n` +
      formFields.map((f) =>
        `  - ${f.label}: "${f.value || 'EMPTY'}" [Status: ${f.state}${f.source ? `, Source: ${f.source}` : ''}]`
      ).join('\n')
    : '';

  // Sarvam AI — full context-aware AI call
  if (aiClient) {
    try {
const langMap = { hi: 'Hindi (in Devanagari script)', mr: 'Marathi', bn: 'Bengali', ta: 'Tamil', te: 'Telugu', en: 'English' };
const targetLang = langMap[language] || 'English';

      const systemPrompt = `You are "Paytm Saarthi", a warm, intelligent, multilingual AI financial copilot embedded inside the Paytm for Business loan application form.

## MERCHANT PROFILE (Pre-fetched from Paytm's secure backend)
- Name: Ramesh Sharma
- Business: Ramesh Kirana Store, Shop 14, Tonk Road, Jaipur, Rajasthan
- Category: Grocery & Daily Essentials
- Paytm UPI: ramesh.kirana@paytm | Joined: April 2023
- Bank: SBI Account ending ••••4821 (IFSC: SBIN0004120) — Verified ✓
- CIBIL Score: NONE (Thin-file / No formal credit history)
- QR Transaction History (Last 6 months): 4,520 transactions
- Avg Monthly GMV: ₹86,400 | MoM Growth: +14.2%
- Unique Payer Ratio: 78.4% (fraud-free organic footfall)
- Daily Settlements: 178 consecutive days — ZERO bounces
- Paytm Wallet Balance: ₹3,840

## PRE-APPROVED LOAN OFFER (Alternative Underwriting Score: 825/900)
- Loan Amount: ₹50,000 (Max eligible: ₹1,00,000)
- Interest Rate: 12% APR (Flat)
- Tenure: 6 months | Monthly EMI: ₹8,830 | Daily deduction: ₹294
- Processing Fee: ZERO (Paytm merchant benefit)
- NBFC Partner: Aditya Birla Finance / SMFG India Credit
- Disbursement: Instant → Paytm Business Wallet → SBI A/C

## CURRENT FORM CONTEXT
- Form Page: ${currentPage}
${formContext}

## YOUR BEHAVIOR RULES
1. Be warm, empathetic, and conversational — like a trusted financial advisor from Bharat.
2. Language: Reply in ${targetLang}. Use "Ramesh ji" as address. Keep it colloquial and respectful.
3. Keep responses SHORT (2-3 sentences max) and ACTIONABLE.
4. If a field is EMPTY or has an ERROR in the form context, proactively offer to help fill it.
5. If user asks about eligibility, ALWAYS confirm based on the 4,520 QR transactions.
6. If user asks about interest/EMI, give exact numbers.
7. NEVER say you cannot help. ALWAYS find a way to assist.
8. For mismatch warnings (like address), reassure — explain that Paytm QR location data overrides it.`;

      const response = await aiClient.chat.completions.create({
        model: 'sarvam-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      const replyText = response.choices[0].message.content?.trim() ||
        'Namaste Ramesh ji! Aapke QR transactions ke aadhar par aap ₹50,000 ke loan ke liye eligible hain.';

      logTelemetry('AI_RESPONSE', `Sarvam AI replied: "${replyText.substring(0, 60)}..."`, 120);

      return res.json({
        success: true,
        reply: replyText,
        detectedIntent: lowerMsg.includes('loan') ? 'LOAN_REQUEST' : 'GENERAL_QUERY',
        source: 'sarvam-ai'
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('Sarvam AI call error:', errMsg);
      // Fall through to deterministic engine
    }
  }

  // ── Resilient Built-in Engine (Zero latency, perfect for demo) ──
  let reply = '';
  let actionRequired = null;

  if (lowerMsg.includes('loan') || lowerMsg.includes('paise') || lowerMsg.includes('50,000') || lowerMsg.includes('chahiye') || lowerMsg.includes('credit') || lowerMsg.includes('लोन')) {
    reply = language === 'hi'
      ? 'नमस्ते रमेश जी! रमेश किराना स्टोर के 4,520 QR लेनदेन के आधार पर आप ₹50,000 के इंस्टेंट बिजनेस लोन के लिए पात्र हैं — शून्य (ZERO) प्रोसेसिंग फीस के साथ। क्या मैं लोन ऑफर तैयार करूँ?'
      : 'Namaste Ramesh ji! Based on 4,520 verified QR transactions of Ramesh Kirana Store, you are pre-approved for ₹50,000 at 12% APR with zero processing fee. Shall I prepare your offer?';
    actionRequired = 'SHOW_OFFER';
  } else if (lowerMsg.includes('interest') || lowerMsg.includes('byaj') || lowerMsg.includes('emi') || lowerMsg.includes('kitna') || lowerMsg.includes('ब्याज')) {
    reply = language === 'hi'
      ? 'आपको सिर्फ 12% वार्षिक ब्याज दर (annual interest rate) मिलेगी। 6 महीने के लिए ईएमआई ₹8,830/माह (या ₹294/दिन ऑटो-डिडक्ट) होगी। इसमें कोई छिपे हुए शुल्क (hidden charges) नहीं हैं रमेश जी!'
      : 'Your rate is 12% APR. For 6 months, EMI is ₹8,830/month or ₹294/day auto-deducted from settlements. Zero hidden charges!';
    actionRequired = 'EXPLAIN_TERMS';
  } else if (lowerMsg.includes('address') || lowerMsg.includes('mismatch') || lowerMsg.includes('galat') || lowerMsg.includes('पता') || lowerMsg.includes('गलत')) {
    reply = language === 'hi'
      ? 'आपके आधार और दुकान के पते में थोड़ा अंतर है, लेकिन घबराने की कोई बात नहीं है! आपके पेटीएम QR लोकेशन डेटा से पता सत्यापित (verify) हो गया है। मैं इसे स्वीकृत (approve) कर रहा हूँ।'
      : 'There is a minor mismatch between your Aadhaar and shop address. But your Paytm QR geo-location data confirms your business location — I have approved it!';
    actionRequired = 'RESOLVE_MISMATCH';
  } else if (lowerMsg.includes('cibil') || lowerMsg.includes('score') || lowerMsg.includes('credit history') || lowerMsg.includes('सिबिल')) {
    reply = language === 'hi'
      ? 'रमेश जी, आपका कोई सिबिल (CIBIL) स्कोर नहीं है — लेकिन यह कोई समस्या नहीं है! हमारा वैकल्पिक अंडरराइटिंग इंजन आपके 4,520 QR लेनदेन को देखकर आपको 825/900 का स्कोर देता है। आप TIER-1 के लिए पात्र हैं!'
      : 'Ramesh ji, you have no CIBIL score — but that is not a problem! Our Alternative Underwriting Engine scored you 825/900 based on your QR transactions. You qualify for TIER-1 eligibility!';
    actionRequired = 'EXPLAIN_ALTERNATIVE_SCORING';
  } else if (lowerMsg.includes('haan') || lowerMsg.includes('yes') || lowerMsg.includes('approve') || lowerMsg.includes('theek') || lowerMsg.includes('ok') || lowerMsg.includes('हाँ') || lowerMsg.includes('ठीक')) {
    reply = language === 'hi'
      ? 'धन्यवाद रमेश जी! अकाउंट एग्रीगेटर के माध्यम से SBI बैंक स्टेटमेंट सत्यापित हो गया है। आपका ₹50,000 का लोन स्वीकृत हो गया है — अभी ट्रांसफर (disburse) हो रहा है!'
      : 'Thank you Ramesh ji! Your SBI bank statement is verified via RBI Account Aggregator. ₹50,000 loan approved — disbursing now!';
    actionRequired = 'PROCEED_DISBURSAL';
  } else if (lowerMsg.includes('help') || lowerMsg.includes('dikkat') || lowerMsg.includes('stuck') || lowerMsg.includes('samajh') || lowerMsg.includes('मदद') || lowerMsg.includes('समझ')) {
    reply = language === 'hi'
      ? 'बिल्कुल रमेश जी! आप मुझे बताएँ क्या समस्या है — मैं आपके पेटीएम खाते से फॉर्म के फ़ील्ड स्वचालित रूप से (automatically) भर सकता हूँ। अगर कुछ अस्पष्ट (unclear) हो तो बेझिझक पूछें!'
      : 'Of course Ramesh ji! Tell me what you need help with. I can auto-fill any field from your Paytm account data. Ask me anything about the form or the loan!';
    actionRequired = 'OFFER_HELP';
  } else {
    reply = language === 'hi'
      ? 'नमस्ते रमेश जी! मैं आपका पेटीएम सारथी हूँ — लोन, QR कैशफ्लो, EMI, या फॉर्म के बारे में कुछ भी पूछें। मैं आपकी सहायता के लिए यहाँ हूँ!'
      : 'Namaste Ramesh ji! I am Paytm Saarthi, your AI financial copilot. Ask me about your loan offer, QR analytics, EMI details, or any form field!';
    actionRequired = 'GENERAL_GREETING';
  }

  res.json({ success: true, reply, actionRequired, source: 'saarthi-resilient-engine' });
});

// ==========================================
// NEW: COGNEE SDK CLOUD INTEGRATION ENDPOINTS
// ==========================================
/*
app.post('/api/cognee/remember', async (req, res) => {
  const { merchantId, text } = req.body;
  if (!merchantId || !text) {
    return res.status(400).json({ error: 'merchantId and text are required' });
  }

  const result = await rememberMerchantHistory(merchantId, text);
  if (result.success) {
    res.json({ message: 'Memory successfully saved to Cognee Knowledge Graph', status: 'success' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

app.post('/api/cognee/recall', async (req, res) => {
  const { merchantId, query } = req.body;
  if (!merchantId || !query) {
    return res.status(400).json({ error: 'merchantId and query are required' });
  }

  const result = await recallMerchantMemory(merchantId, query);
  if (result.success) {
    res.json({ data: result.data, status: 'success' });
  } else {
    res.status(500).json({ error: result.error });
  }
});
*/

// Mock Paytm Insurance API Endpoints
const PUNE_HOSPITALS = [
  { name: 'Aadhar Hospital Multispeciality & ICU', address: 'Old, Pune, Maharashtra', pincode: '412101', type: 'Multispeciality' },
  { name: 'Aarogyam Multispeciality Hospital', address: 'Chakan Talegaon Road, Opp Marathi Shala, Pune', pincode: '410501', type: 'Multispeciality' },
  { name: 'Aarya Hospital', address: 'Moshi - Jadhavwadi Pcmc, Pune', pincode: '411026', type: 'General Hospital' },
  { name: 'Aayush Hospital', address: '1442, Naigoan Chowk, Kunjirawadi, Pune', pincode: '412201', type: 'Super Speciality' },
  { name: 'Accord Hospital', address: 'Santnagar, Plot No: 1/1, Sector No: 4, Moshi, Pune', pincode: '412105', type: 'Foundation Hospital' },
  { name: 'Aditya Birla Health Services Limited', address: 'Survey No. 31, Chinchwad, Pune', pincode: '411033', type: 'Tertiary Care & Trauma' },
  { name: 'Agarwal Maternity Hospital', address: 'Sangharsh Chowk, Kharadi Road, Pune', pincode: '411014', type: 'Maternity' },
  { name: 'Aims Hospital & Research Centre', address: 'Parihaar Clinic, Aundh, Pune', pincode: '411007', type: 'Research' },
  { name: 'Akash Eye Clinic & Laser Centre', address: '1St Floor, City Space Building, Viman Nagar, Pune', pincode: '411014', type: 'Eye Clinic' }
];

app.get('/api/insurance/plans', (req, res) => {
  const { category = 'health', pincode = '411014' } = req.query;
  res.json({
    category,
    pincode,
    city: 'Pune, Maharashtra',
    cashless_hospitals_count: 458,
    india_hospitals_count: 10928,
    recommended_tier: '₹10 Lakh',
    tiers: [
      { amount: 500000, label: '₹5 Lakh', monthly: 689, yearly: 8268 },
      { amount: 1000000, label: '₹10 Lakh', monthly: 804, yearly: 9648, isRecommended: true },
      { amount: 2000000, label: '₹20 Lakh', monthly: 976, yearly: 11712 },
      { amount: 5000000, label: '₹50 Lakh', monthly: 1321, yearly: 15852 },
      { amount: 10000000, label: '₹1 Crore', monthly: 1436, yearly: 17232 }
    ],
    insurer: {
      name: 'ICICI Lombard',
      subtitle: 'Nibhaye Vaade',
      claim_settlement_rate: '96.26%',
      claims_settled: '16 Lakh+',
      lives_insured: '2.17 Cr+'
    }
  });
});

app.get('/api/insurance/hospitals', (req, res) => {
  const { pincode = '411014' } = req.query;
  res.json({
    city: 'Pune',
    pincode,
    total_count: 458,
    hospitals: PUNE_HOSPITALS
  });
});

app.get('/api/insurance/car/plans', (req, res) => {
  const { vehicle_number = 'MH 14 CC 7734' } = req.query;
  res.json({
    vehicle: {
      number: vehicle_number,
      make_model: 'Maruti Zen Estilo',
      variant: '1.0 VXI ABS',
      fuel: 'Petrol',
      year: 2010,
      rto: 'Pune, Maharashtra'
    },
    comprehensive: [
      { id: 'tata_aig', partner: 'Tata AIG', idv: '₹1.26 Lakhs', claim_settlement: '98%', price: 3224, popular: true },
      { id: 'icici_drive', partner: 'ICICI Lombard (Pay As You Drive)', idv: '₹1.02 Lakhs', claim_settlement: '93%', price: 5081 },
      { id: 'zurich_kotak', partner: 'Zurich Kotak General', idv: '₹1.15 Lakhs', claim_settlement: '98%', price: 5839 }
    ],
    third_party: [
      { id: 'digit_tp', partner: 'Go Digit', price: 2094, perk: 'Free Road Side Assistance' },
      { id: 'tata_tp', partner: 'Tata AIG', price: 2094, popular: true },
      { id: 'sbi_tp', partner: 'SBI General', price: 2094, perk: 'With Towing Assistance' }
    ],
    addons: [
      { id: 'pa_cover', name: '15 Lakh Personal Accident Cover', price: 354, mandatory: true },
      { id: 'rsa', name: '24x7 Roadside Assistance', price: 199, mandatory: false }
    ],
    total_estimated: 4158
  });
});

const processedInsuranceRequests = new Map();

app.post('/api/insurance/issue', async (req, res) => {
  const { 
    request_id,
    quote_id,
    customer_id = 'MERCH_PUNE_411014', 
    category = 'health', 
    coverage = 1000000, 
    coverLabel = '₹10 Lakh',
    premium = 804, 
    billingCycle = 'monthly',
    partner = 'ICICI Lombard', 
    answers = {},
    kyc = {}
  } = req.body;
  
  if (!request_id || !quote_id) {
    return res.status(400).json({ success: false, message: 'Missing request_id or quote_id. Cannot process.' });
  }

  // 1. Idempotency Check
  if (processedInsuranceRequests.has(request_id)) {
    console.log(`[IDEMPOTENCY] Duplicate request caught: ${request_id}. Returning cached response.`);
    return res.json(processedInsuranceRequests.get(request_id));
  }

  // 2. Authoritative Backend Recalculation
  let expectedPremium = 0;
  let expectedPartner = '';
  
  if (category === 'health') {
    const isFamily = answers.members && answers.members !== 'Only me';
    const expectedCoverage = isFamily ? 1000000 : 500000;
    
    if (coverage !== expectedCoverage) {
       return res.status(400).json({ success: false, message: 'Coverage mismatch. Expected ' + expectedCoverage });
    }
    
    const baseMonthly = coverage === 1000000 ? 804 : 689;
    const baseYearly = coverage === 1000000 ? 9648 : 8268;

    let multiplier = 1.0;
    if (answers.age === '46-55 years') multiplier = 1.25;
    if (answers.age === '56-65 years') multiplier = 1.5;
    if (answers.health_issues && answers.health_issues !== 'None (100% Fit)') multiplier *= 1.15;

    expectedPremium = Math.round((billingCycle === 'monthly' ? baseMonthly : baseYearly) * multiplier);
    
    const ansAge = answers.age || '';
    const ansHealth = answers.health_issues || '';
    const ansMembers = answers.members || '';
    
    if (ansHealth.includes('Diabetes')) expectedPartner = 'Star Health';
    else if (ansHealth.includes('Hypertension')) expectedPartner = 'Care Health';
    else if (ansHealth !== 'None (100% Fit)' && ansHealth !== '') expectedPartner = 'Niva Bupa';
    else if (ansAge === '56-65 years') expectedPartner = 'National Insurance';
    else if (ansAge === '46-55 years') expectedPartner = 'HDFC ERGO';
    else if (ansMembers.includes('2 children')) expectedPartner = 'Aditya Birla';
    else if (ansMembers.includes('1 child')) expectedPartner = 'SBI General';
    else if (expectedPremium > 9000) expectedPartner = 'Bajaj Allianz';
    else if (expectedPremium < 7000) expectedPartner = 'Acko';
    else expectedPartner = 'ICICI Lombard';
  } else if (category === 'car') {
    const isThirdParty = answers.plan_type && answers.plan_type.includes('Third Party');
    const isPayDrive = answers.plan_type && answers.plan_type.includes('Pay As You Drive');
    const hasPACover = !answers.pa_cover || answers.pa_cover.includes('+₹354');

    let basePrice = 3224; 
    expectedPartner = 'Tata AIG';
    
    if (isThirdParty) {
      basePrice = 2094;
      expectedPartner = 'Go Digit';
    } else if (isPayDrive) {
      basePrice = 5081;
      expectedPartner = 'ICICI Lombard';
    }

    const paCoverPrice = hasPACover ? 354 : 0;
    const subtotal = basePrice + paCoverPrice;
    const gst = Math.round(subtotal * 0.18);
    expectedPremium = subtotal + gst;
  } else {
    expectedPremium = premium; // Pass-through for unimplemented categories for now
    expectedPartner = partner;
  }

  // 3. Validation
  if (premium !== expectedPremium) {
    return res.status(400).json({ success: false, message: `Premium verification failed. Expected ₹${expectedPremium}, received ₹${premium}` });
  }
  
  if (partner !== expectedPartner) {
    return res.status(400).json({ success: false, message: `Partner verification failed. Expected ${expectedPartner}, received ${partner}` });
  }
  
  const policy_id = `PTM-INS-${category.toUpperCase()}-${Date.now().toString().slice(-6)}`;
  const mandate_id = `UPI-MANDATE-${Date.now().toString().slice(-8)}`;
  
  logTelemetry('INSURANCE_QUOTE', `Generated ${category} insurance quote. Premium: ₹${premium}/${billingCycle}.`, 85);
  logTelemetry('INSURANCE_ISSUED', `Policy ${policy_id} issued by ${partner} for coverage ${coverLabel}.`, 110);
  
  // N8N Webhook Trigger for Insurance Automation — with retry
  const webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://pratham0105.app.n8n.cloud/webhook/disburse';
  console.log(`[n8n] Triggering Insurance Webhook for ${customer_id} (Policy: ${policy_id})`);
  sendWebhookWithRetry(webhookUrl, {
    event: 'INSURANCE_POLICY_ISSUED',
    merchantId: customer_id,
    category,
    policy_id,
    mandate_id,
    cover_amount: coverLabel,
    premium_amount: premium,
    billing_cycle: billingCycle,
    partner,
    customer_name: kyc.fullName || 'Ramesh Kumar',
    customer_phone: kyc.mobileNumber || '9322019398',
    pincode: kyc.pincode || '411014',
    city: 'Pune, Maharashtra',
    hospitals_in_city: 458,
    status: 'POLICY_ACTIVE',
    timestamp: new Date().toISOString()
  }).catch(err => console.error('[n8n] Insurance webhook retry wrapper error:', err));

  const finalResponse = {
    success: true,
    policy_id,
    mandate_id,
    partner,
    cover: coverLabel,
    premium,
    billingCycle,
    pdf_url: `https://paytm.com/insurance/download/policy/${policy_id}.pdf`,
    whatsapp_sent: true,
    phone: kyc.mobileNumber || '9322019398',
    message: 'Insurance Policy Issued & UPI Mandate Activated Successfully',
    n8n_triggered: true
  };
  
  // Cache response for idempotency
  processedInsuranceRequests.set(request_id, finalResponse);

  res.json(finalResponse);
});

app.listen(PORT, () => {
  console.log(`🚀 Paytm Saarthi Full-Stack Backend running at http://localhost:${PORT}`);
});
