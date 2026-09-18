import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { initCognee, rememberMerchantHistory, recallMerchantMemory } from './cogneeService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DeepSeek Client (via OpenAI SDK)
let aiClient = null;
if (process.env.DEEPSEEK_API_KEY) {
  try {
    aiClient = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY
    });
    console.log('✅ DeepSeek API Client initialized');
  } catch (err) {
    console.warn('⚠️ Could not initialize DeepSeek client:', err.message);
  }
} else {
  console.log('ℹ️ Running in resilient demo mode (Set DEEPSEEK_API_KEY in .env)');
}

// Initialize Cognee memory graph SDK
initCognee();

// -------------------------------------------------------------
// In-Memory Database: Ramesh Kirana Store (Jaipur)
// -------------------------------------------------------------
let merchantDB = {
  merchantId: 'MERCH_JAIPUR_0821',
  name: 'Ramesh Sharma',
  businessName: 'Ramesh Kirana Store',
  category: 'Grocery & Daily Essentials',
  address: 'Shop 14, Main Market, Tonk Road, Jaipur, Rajasthan',
  upiId: 'ramesh.kirana@paytm',
  walletBalance: 3840,
  joinedDate: '2023-04-12',
  cibilScore: null,
  cibilStatus: 'NO_SCORE / THIN_FILE (Zero formal credit history)',
  bankAccount: {
    bankName: 'State Bank of India',
    accountMasked: '•••• •••• 4821',
    ifsc: 'SBIN0004120',
    verified: true
  },
  qrMetrics: {
    totalTransactions180d: 4520,
    avgMonthlyGmv: 86400,
    growthMoM: 14.2,
    uniquePayerRatio: 78.4,
    dailySettlements: 178,
    bouncedSettlements: 0,
    peakHours: '08:00 - 11:00 AM & 06:00 - 09:30 PM',
    avgTicketSize: 115
  },
  activeLoan: null,
  pastLoans: []
};

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
app.get('/api/merchant', (req, res) => {
  res.json({
    success: true,
    data: merchantDB,
    telemetry: telemetryLogs.slice(0, 10)
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
  const { amount = 50000, tenureMonths = 6 } = req.body;

  const txnId = `PTM-DISB-${Date.now().toString().slice(-8)}`;
  merchantDB.walletBalance += amount;
  merchantDB.activeLoan = {
    loanId: `LN-${Date.now().toString().slice(-6)}`,
    principal: amount,
    tenureMonths,
    monthlyEmi: 8830,
    disbursedAt: new Date().toISOString(),
    status: 'ACTIVE'
  };

  // Trigger n8n Webhook asynchronously (Fire and Forget)
  const webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://pratham0105.app.n8n.cloud/webhook/disburse';
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantId: 'merchant_1',
      name: 'Ramesh Sharma',
      loanAmount: amount,
      txnId: txnId,
      disbursedAt: merchantDB.activeLoan.disbursedAt,
      event: 'DISBURSAL_SUCCESS'
    })
  }).catch(err => console.error('n8n Webhook failed:', err));

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

  // Upgraded future limit edge
  knowledgeGraph.insights.push(
    `Ramesh successfully took ₹${amount.toLocaleString('en-IN')} loan. Once 2 EMIs are paid on time, eligibility dynamically unlocks to ₹1,00,000.`
  );

  logTelemetry('NBFC_API_ALLOCATION', `Disbursal request cleared by Aditya Birla Capital API in 110ms.`);
  logTelemetry('DISBURSAL_COMPLETE', `₹${amount.toLocaleString('en-IN')} credited to Paytm Business Account. Ref: ${txnId}`, 95);

  res.json({
    success: true,
    data: {
      txnId,
      amount,
      updatedBalance: merchantDB.walletBalance,
      creditedTo: 'Paytm Merchant Current Account (SBI 4821)',
      soundboxAnnouncement: `Paytm par ${amount === 50000 ? 'pachaas hazaar' : amount} rupaye prapt hue.`,
      disbursedAt: merchantDB.activeLoan.disbursedAt,
      activeLoan: merchantDB.activeLoan
    }
  });
});

// 6. Reset Demo State
app.post('/api/reset', (req, res) => {
  merchantDB.walletBalance = 3840;
  merchantDB.activeLoan = null;
  knowledgeGraph.nodes = knowledgeGraph.nodes.filter(n => n.type !== 'ActiveLoan');
  knowledgeGraph.edges = knowledgeGraph.edges.filter(e => e.relation !== 'BORROWED');
  logTelemetry('DEMO_RESET', 'Merchant state and active loans reset to initial baseline.');
  res.json({ success: true, message: 'Demo state reset successfully' });
});

// 7. Saarthi AI Chat & Voice Assistant (DeepSeek or Resilient Engine)
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

  // DeepSeek — full context-aware AI call
  if (aiClient) {
    try {
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
2. Language: ${language === 'hi' ? 'Reply in Hinglish/Hindi. Use "Ramesh ji" as address. Keep it colloquial and respectful.' : 'Reply in clear, simple English. Address as "Ramesh ji".'}
3. Keep responses SHORT (2-3 sentences max) and ACTIONABLE.
4. If a field is EMPTY or has an ERROR in the form context, proactively offer to help fill it.
5. If user asks about eligibility, ALWAYS confirm based on the 4,520 QR transactions.
6. If user asks about interest/EMI, give exact numbers.
7. NEVER say you cannot help. ALWAYS find a way to assist.
8. For mismatch warnings (like address), reassure — explain that Paytm QR location data overrides it.`;

      const response = await aiClient.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      const replyText = response.choices[0].message.content?.trim() ||
        'Namaste Ramesh ji! Aapke QR transactions ke aadhar par aap ₹50,000 ke loan ke liye eligible hain.';

      logTelemetry('AI_RESPONSE', `DeepSeek replied: "${replyText.substring(0, 60)}..."`, 120);

      return res.json({
        success: true,
        reply: replyText,
        detectedIntent: lowerMsg.includes('loan') ? 'LOAN_REQUEST' : 'GENERAL_QUERY',
        source: 'deepseek-chat'
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('DeepSeek call error:', errMsg);
      // Fall through to deterministic engine
    }
  }

  // ── Resilient Built-in Engine (Zero latency, perfect for demo) ──
  let reply = '';
  let actionRequired = null;

  if (lowerMsg.includes('loan') || lowerMsg.includes('paise') || lowerMsg.includes('50,000') || lowerMsg.includes('chahiye') || lowerMsg.includes('credit')) {
    reply = language === 'hi'
      ? 'Namaste Ramesh ji! Ramesh Kirana Store ke 4,520 QR transactions ke aadhar par aap ₹50,000 ke instant business loan ke liye eligible hain — ZERO processing fees ke saath. Kya main loan offer taiyar karun?'
      : 'Namaste Ramesh ji! Based on 4,520 verified QR transactions of Ramesh Kirana Store, you are pre-approved for ₹50,000 at 12% APR with zero processing fee. Shall I prepare your offer?';
    actionRequired = 'SHOW_OFFER';
  } else if (lowerMsg.includes('interest') || lowerMsg.includes('byaj') || lowerMsg.includes('emi') || lowerMsg.includes('kitna')) {
    reply = language === 'hi'
      ? 'Aapko sirf 12% annual interest rate milega. 6 mahine ke liye EMI ₹8,830/maah (ya ₹294/din auto-deduct). Koi hidden charges nahi hai Ramesh ji!'
      : 'Your rate is 12% APR. For 6 months, EMI is ₹8,830/month or ₹294/day auto-deducted from settlements. Zero hidden charges!';
    actionRequired = 'EXPLAIN_TERMS';
  } else if (lowerMsg.includes('address') || lowerMsg.includes('mismatch') || lowerMsg.includes('galat')) {
    reply = language === 'hi'
      ? 'Aapke Aadhaar aur shop address mein thoda farq hai, par ghabrana nahi! Aapke Paytm QR location data se address verify ho gaya hai. Main ise approve kar raha hoon.'
      : 'There is a minor mismatch between your Aadhaar and shop address. But your Paytm QR geo-location data confirms your business location — I have approved it!';
    actionRequired = 'RESOLVE_MISMATCH';
  } else if (lowerMsg.includes('cibil') || lowerMsg.includes('score') || lowerMsg.includes('credit history')) {
    reply = language === 'hi'
      ? 'Ramesh ji, aapka koi CIBIL score nahi hai — par yeh koi dikkat nahi! Hamara Alternative Underwriting Engine aapke 4,520 QR transactions dekh kar aapko 825/900 score deta hai. Aap TIER-1 eligible hain!'
      : 'Ramesh ji, you have no CIBIL score — but that is not a problem! Our Alternative Underwriting Engine scored you 825/900 based on your QR transactions. You qualify for TIER-1 eligibility!';
    actionRequired = 'EXPLAIN_ALTERNATIVE_SCORING';
  } else if (lowerMsg.includes('haan') || lowerMsg.includes('yes') || lowerMsg.includes('approve') || lowerMsg.includes('theek') || lowerMsg.includes('ok')) {
    reply = language === 'hi'
      ? 'Dhanyawad Ramesh ji! Account Aggregator ke zariye SBI bank statement verify ho gaya hai. Aapka ₹50,000 ka loan approve — abhi disburse ho raha hai!'
      : 'Thank you Ramesh ji! Your SBI bank statement is verified via RBI Account Aggregator. ₹50,000 loan approved — disbursing now!';
    actionRequired = 'PROCEED_DISBURSAL';
  } else if (lowerMsg.includes('help') || lowerMsg.includes('dikkat') || lowerMsg.includes('stuck') || lowerMsg.includes('samajh')) {
    reply = language === 'hi'
      ? 'Bilkul Ramesh ji! Aap mujhe batao kya problem hai — main form ke fields automatically fill kar sakta hoon aapke Paytm account se. Koi cheez unclear ho toh seedha poochho!'
      : 'Of course Ramesh ji! Tell me what you need help with. I can auto-fill any field from your Paytm account data. Ask me anything about the form or the loan!';
    actionRequired = 'OFFER_HELP';
  } else {
    reply = language === 'hi'
      ? 'Namaste Ramesh ji! Main aapka Paytm Saarthi hoon — loan, QR cashflow, EMI, ya form ke baare mein kuch bhi poochho. Main yahan hoon!'
      : 'Namaste Ramesh ji! I am Paytm Saarthi, your AI financial copilot. Ask me about your loan offer, QR analytics, EMI details, or any form field!';
    actionRequired = 'GENERAL_GREETING';
  }

  res.json({ success: true, reply, actionRequired, source: 'saarthi-resilient-engine' });
});

// ==========================================
// NEW: COGNEE SDK CLOUD INTEGRATION ENDPOINTS
// ==========================================

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

app.post('/api/insurance/issue', async (req, res) => {
  const { 
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
  
  const policy_id = `PTM-INS-${category.toUpperCase()}-${Date.now().toString().slice(-6)}`;
  const mandate_id = `UPI-MANDATE-${Date.now().toString().slice(-8)}`;
  
  logTelemetry('INSURANCE_QUOTE', `Generated ${category} insurance quote. Premium: ₹${premium}/${billingCycle}.`, 85);
  logTelemetry('INSURANCE_ISSUED', `Policy ${policy_id} issued by ${partner} for coverage ${coverLabel}.`, 110);
  
  // N8N Webhook Trigger for Insurance Automation
  const webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://pratham0105.app.n8n.cloud/webhook/disburse';
  try {
    console.log(`[n8n] Triggering Insurance Webhook for ${customer_id} (Policy: ${policy_id})`);
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      })
    }).catch(err => console.error('n8n webhook failed:', err));
  } catch (e) {
    console.error('[n8n] Webhook trigger failed', e.message);
  }

  res.json({
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
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Paytm Saarthi Full-Stack Backend running at http://localhost:${PORT}`);
});
