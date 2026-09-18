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
      disbursedAt: new Date().toISOString(),
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

// 7. Saarthi AI Chat & Voice Assistant (Gemini 3.8 Flash or Resilient Engine)
app.post('/api/agent/chat', async (req, res) => {
  const { message, language = 'hi' } = req.body;

  const lowerMsg = (message || '').toLowerCase();
  logTelemetry('VOICE_INTENT_INGEST', `Received intent: "${message}" (${language})`, 45);

  // If DeepSeek API is configured, use deepseek-chat
  if (aiClient) {
    try {
      const prompt = `You are "Paytm Saarthi", an autonomous AI financial copilot inside the Paytm for Business app.
The user is Ramesh Sharma, owner of Ramesh Kirana Store in Jaipur.
Context:
- He has no CIBIL score (thin-file customer).
- He has 4,520 Paytm QR transactions over the last 6 months with ₹86,400 avg monthly sales.
- He is pre-approved for an instant business loan of ₹50,000 at 12% APR (6 months, EMI ₹8,830/mo).
- Language requested: ${language === 'hi' ? 'Hindi / Hinglish (warm, respectful, colloquial Bharat tone)' : 'English'}.

User Message: "${message}"

Respond concisely (under 3 sentences). If he is asking for a loan, confirm his eligibility based on his QR transactions and offer ₹50,000 instantly.`;

      const response = await aiClient.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: prompt }]
      });

      const replyText = response.choices[0].message.content || 'Namaste Ramesh ji! Aapke QR transactions ke aadhar par aap ₹50,000 ke loan ke liye eligible hain.';
      return res.json({
        success: true,
        reply: replyText,
        detectedIntent: lowerMsg.includes('loan') ? 'LOAN_REQUEST' : 'GENERAL_QUERY',
        source: 'deepseek-chat'
      });
    } catch (err) {
      console.error('DeepSeek call error:', err.message);
      // Fallback below
    }
  }

  // Resilient Built-in Conversational Engine (Zero latency, perfect for pitch)
  let reply = '';
  let actionRequired = null;

  if (lowerMsg.includes('loan') || lowerMsg.includes('paise') || lowerMsg.includes('50,000') || lowerMsg.includes('chahiye')) {
    if (language === 'hi') {
      reply = 'Namaste Ramesh ji! Ramesh Kirana Store ke pichhle 6 mahine ke 4,520 QR transactions ke aadhar par aap ₹50,000 ke instant business loan ke liye eligible hain. Kya main aapka loan offer taiyar karun?';
    } else {
      reply = 'Hello Ramesh ji! Based on 4,520 QR transactions of Ramesh Kirana Store, you are pre-approved for an instant business loan of ₹50,000. Would you like me to prepare your offer?';
    }
    actionRequired = 'SHOW_OFFER';
  } else if (lowerMsg.includes('interest') || lowerMsg.includes('byaj') || lowerMsg.includes('emi') || lowerMsg.includes('dar')) {
    if (language === 'hi') {
      reply = 'Aapko 12% annual interest rate milega. 6 mahine ke liye aapki EMI sirf ₹8,830 prati mahina (ya ₹294 prati din) hogi. Koi hidden processing fees nahi hai.';
    } else {
      reply = 'The annual interest rate is 12%. For a 6-month tenure, your EMI will be ₹8,830/month (or ₹294/day deduction). Zero processing fees for Paytm merchants.';
    }
    actionRequired = 'EXPLAIN_TERMS';
  } else if (lowerMsg.includes('consent') || lowerMsg.includes('haan') || lowerMsg.includes('yes') || lowerMsg.includes('approve') || lowerMsg.includes('theek')) {
    if (language === 'hi') {
      reply = 'Dhanyawad Ramesh ji! Account Aggregator ke zariye SBI bank statement verify ho gaya hai. Aapka ₹50,000 ka loan approve ho chuka hai.';
    } else {
      reply = 'Thank you Ramesh ji! Your bank statement has been verified via Account Aggregator. Your ₹50,000 loan is approved and ready for disbursal.';
    }
    actionRequired = 'PROCEED_DISBURSAL';
  } else {
    if (language === 'hi') {
      reply = 'Namaste Ramesh ji! Main aapka Paytm Saarthi hoon. Aap mujhse business loan, QR settlement, ya dukaan ke cashflow ke baare mein baat kar sakte hain.';
    } else {
      reply = 'Hello Ramesh ji! I am Paytm Saarthi, your AI financial copilot. Ask me about business loans, QR cashflow analytics, or daily settlements.';
    }
    actionRequired = 'GENERAL_GREETING';
  }

  res.json({
    success: true,
    reply,
    actionRequired,
    source: 'saarthi-deterministic-engine'
  });
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

// Start the Express server
app.post('/api/disburse', async (req, res) => {
  const { merchantId, amount } = req.body;
  
  // N8N Webhook Trigger
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      console.log(`[n8n] Triggering Webhook for ${merchantId}`);
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId,
          amount,
          status: 'SUCCESS',
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error('[n8n] Webhook trigger failed', e.message);
    }
  }

  res.json({
    success: true,
    message: 'Disbursed successfully',
    n8n_triggered: !!webhookUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Paytm Saarthi Full-Stack Backend running at http://localhost:${PORT}`);
});
