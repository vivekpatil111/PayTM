import { Merchant, UnderwritingData, KnowledgeGraphData, TelemetryLog } from '../types';

export const api = {
  // Fetch merchant profile and recent telemetry
  async getMerchant(merchantId = 'MERCH_JAIPUR_0821'): Promise<{ data: Merchant; telemetry: TelemetryLog[]; availablePersonas?: any[] }> {
    try {
      const res = await fetch(`/api/merchant?id=${merchantId}`);
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return { data: json.data, telemetry: json.telemetry, availablePersonas: json.availablePersonas };
    } catch (e) {
      console.warn('Backend fetch failed, using pre-calibrated baseline data:', e);
      return {
        data: {
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
          activeLoan: null
        },
        telemetry: [
          {
            timestamp: new Date().toLocaleTimeString(),
            stage: 'DATA_STREAM',
            message: 'Loaded 4,520 QR transactions for Ramesh Kirana Store. Alternative score computed.',
            latencyMs: 72
          }
        ]
      };
    }
  },

  // Fetch alternative underwriting evaluation
  async getUnderwriting(merchantId = 'MERCH_JAIPUR_0821'): Promise<UnderwritingData> {
    try {
      const res = await fetch(`/api/underwrite/evaluate?id=${merchantId}`);
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      return {
        compositeScore: 825,
        rating: 'EXCELLENT_TIER_1',
        cibilStatus: 'NO_SCORE / THIN_FILE (Zero formal credit history)',
        pillarBreakdown: [
          { name: 'Daily QR Cashflow Velocity', score: 95, weight: '35%', desc: '₹86,400 monthly GMV consistency' },
          { name: 'Payer Diversity Ratio', score: 78, weight: '25%', desc: '78.4% unique customers (Fraud-free)' },
          { name: 'Settlement Regularity', score: 98, weight: '25%', desc: '178 settlements without bounce' },
          { name: 'MoM Sales Momentum', score: 85, weight: '15%', desc: '+14.2% MoM QR volume growth' }
        ],
        preApprovedOffer: {
          amount: 50000,
          maxLimit: 100000,
          interestRateApr: 12.0,
          tenureMonths: 6,
          monthlyEmi: 8830,
          dailyDeduction: 294.33,
          processingFee: 0,
          partnerNbfc: 'Aditya Birla Finance / SMFG India Credit'
        }
      };
    }
  },

  // Fetch Cognee-style Knowledge Graph
  async getKnowledgeGraph(): Promise<KnowledgeGraphData> {
    try {
      const res = await fetch('/api/memory/graph');
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      return {
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
    }
  },

  // Submit AA Consent
  async submitConsent(granted: boolean = true) {
    try {
      const res = await fetch('/api/aa/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentGranted: granted })
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        consentId: 'AA-PAYTM-SBIN-2026-08192',
        fipName: 'State Bank of India'
      };
    }
  },

  // Disburse Loan
  async disburseLoan(amount: number = 50000, tenureMonths: number = 6) {
    try {
      const res = await fetch('/api/disburse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId: 'MERCH_JAIPUR_0821', amount, tenureMonths })
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        data: {
          txnId: `PTM-DISB-${Date.now().toString().slice(-8)}`,
          amount,
          updatedBalance: 53840,
          creditedTo: 'Paytm Merchant Current Account (SBI 4821)',
          soundboxAnnouncement: 'Paytm par pachaas hazaar rupaye prapt hue.'
        }
      };
    }
  },

  // AI Agent Conversation
  async sendChatMessage(message: string, language: string = 'hi') {
    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language })
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        reply: language === 'hi'
          ? 'Namaste Ramesh ji! Ramesh Kirana Store ke 4,520 QR transactions ke aadhar par aap ₹50,000 ke loan ke liye eligible hain.'
          : 'Hello Ramesh ji! Based on 4,520 QR transactions, you are pre-approved for an instant business loan of ₹50,000.'
      };
    }
  },

  // Reset Demo
  async resetDemo() {
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {
      console.log('Reset demo local');
    }
  }
};
