export interface QrMetrics {
  totalTransactions180d: number;
  avgMonthlyGmv: number;
  growthMoM: number;
  uniquePayerRatio: number;
  dailySettlements: number;
  bouncedSettlements: number;
  peakHours: string;
  avgTicketSize: number;
}

export interface BankAccount {
  bankName: string;
  accountMasked: string;
  ifsc: string;
  verified: boolean;
}

export interface ActiveLoan {
  loanId: string;
  principal: number;
  tenureMonths: number;
  monthlyEmi: number;
  disbursedAt: string;
  status: string;
}

export interface Merchant {
  merchantId: string;
  name: string;
  businessName: string;
  category: string;
  address: string;
  upiId: string;
  walletBalance: number;
  joinedDate: string;
  cibilScore: number | null;
  cibilStatus: string;
  bankAccount: BankAccount;
  qrMetrics: QrMetrics;
  activeLoan: ActiveLoan | null;
}

export interface TelemetryLog {
  timestamp: string;
  stage: string;
  message: string;
  latencyMs: number;
}

export interface UnderwritingPillar {
  name: string;
  score: number;
  weight: string;
  desc: string;
}

export interface PreApprovedOffer {
  amount: number;
  maxLimit: number;
  interestRateApr: number;
  tenureMonths: number;
  monthlyEmi: number;
  dailyDeduction: number;
  processingFee: number;
  partnerNbfc: string;
}

export interface UnderwritingData {
  compositeScore: number;
  rating: string;
  cibilStatus: string;
  pillarBreakdown: UnderwritingPillar[];
  preApprovedOffer: PreApprovedOffer;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  status: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  insights: string[];
}

export type PresentationMode = 'split' | 'mobile' | 'web';
export type AppLanguage = 'hi' | 'en';

export type SaarthiStep = 
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'SCANNING_LEDGER'
  | 'AA_CONSENT'
  | 'OFFER_VIEW'
  | 'DISBURSING'
  | 'SUCCESS';
