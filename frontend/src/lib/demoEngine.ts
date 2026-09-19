export type ScenarioType = 'ramesh' | 'sunita';

export interface TraceEvent {
  id: string;
  timeOffset: number; // seconds from start
  icon: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'progress' | 'header' | 'agent_trace';
  progress?: number; // 0-100 for progress bars
  detail?: string;
  traceIntent?: string;
}

const RAMESH_EVENTS: TraceEvent[] = [
  { id: '1', timeOffset: 0, icon: '🎙️', message: 'Voice captured: "Mujhe 50,000 ka loan chahiye"', type: 'header' },
  { id: '2', timeOffset: 1, icon: '🧠', message: 'Intent detected: LOAN_REQUEST', type: 'info', detail: 'Amount: ₹50,000 | Lang: Hindi' },
  { id: 'cognee1', timeOffset: 2, icon: '🕸️', message: 'Querying Cognee Memory Graph (SDK)...', type: 'header' },
  { id: 'cognee2', timeOffset: 3, icon: '✅', message: 'Memory Match: "Merchant repaid ₹20,000 loan successfully 6 months ago. Trust score upgraded."', type: 'success' },
  
  { id: '3', timeOffset: 2, icon: '🔍', message: 'Fetching Paytm transaction data for MERCH_JAIPUR_0821...', type: 'header' },
  { id: '4', timeOffset: 3, icon: '✅', message: 'Retrieved 4,520 QR transactions (last 180 days)', type: 'success' },
  { id: '5', timeOffset: 3, icon: '✅', message: 'Retrieved 178 daily settlements', type: 'success' },
  { id: '6', timeOffset: 4, icon: '✅', message: 'Retrieved GMV trend: +14.2% MoM', type: 'success' },
  
  { id: '7', timeOffset: 5, icon: '🧮', message: 'Calculating alternative credit score...', type: 'header' },
  { id: '8', timeOffset: 6, icon: '📈', message: 'Factor 1: QR Transaction Volume → Score: 850/900', type: 'progress', progress: 94 },
  { id: '9', timeOffset: 7, icon: '📈', message: 'Factor 2: GMV Growth Trend → Score: 820/900', type: 'progress', progress: 91 },
  { id: '10', timeOffset: 8, icon: '📈', message: 'Factor 3: Payer Diversity (78%) → Score: 810/900', type: 'progress', progress: 90 },
  { id: '11', timeOffset: 9, icon: '📈', message: 'Factor 4: Settlement Regularity → Score: 880/900', type: 'progress', progress: 98 },
  
  { id: '12', timeOffset: 10, icon: '🎯', message: 'Weighted Saarthi Score: 825/900', type: 'success' },
  { id: '13', timeOffset: 10, icon: '✅', message: 'Eligibility: APPROVED (Tier-1: up to ₹1,00,000)', type: 'success' },
  { id: '14', timeOffset: 10, icon: '💡', message: 'Reasoning: Strong cash flow, zero bounces, organic customer base', type: 'info' },

  { id: '15', timeOffset: 11, icon: '🔐', message: 'Requesting Account Aggregator consent...', type: 'header' },
  { id: '16', timeOffset: 13, icon: '✅', message: 'User consent granted (1-tap)', type: 'success' },
  { id: '17', timeOffset: 14, icon: '🏦', message: 'Fetching SBI bank statement via AA framework...', type: 'info' },
  { id: '18', timeOffset: 15, icon: '✅', message: 'Bank data verified (no bounce in last 6 months)', type: 'success' },
  { id: '19', timeOffset: 16, icon: '✅', message: 'KYC verified (Aadhaar eKYC)', type: 'success' },

  { id: '20', timeOffset: 17, icon: '💰', message: 'Generating personalized offer...', type: 'header' },
  { id: '21', timeOffset: 18, icon: '📊', message: 'Risk-adjusted interest rate: 12% APR | Optimal tenure: 6 months (EMI: ₹8,830)', type: 'info' },
  { id: '22', timeOffset: 19, icon: '🏢', message: 'Matching NBFC partner: SMFG India Credit', type: 'info' },
  { id: '23', timeOffset: 19, icon: '✅', message: 'Offer ready: ₹50,000 @ 12% for 6 months', type: 'success' },

  { id: '24', timeOffset: 20, icon: '🚀', message: 'Initiating disbursal...', type: 'header' },
  { id: '25', timeOffset: 21, icon: '🔗', message: 'Partner API: Aditya Birla Capital → CALLED', type: 'info' },
  { id: '26', timeOffset: 22, icon: '✅', message: 'Loan sanctioned by NBFC', type: 'success' },
  { id: '27', timeOffset: 23, icon: '💸', message: 'Transferring ₹50,000 to Paytm Merchant Wallet...', type: 'info' },
  { id: '28', timeOffset: 25, icon: '✅', message: 'SETTLED SUCCESS', type: 'success' },
  { id: '29', timeOffset: 25, icon: '🎉', message: 'Soundbox: "Paytm par pachaas hazaar rupaye prapt hue!"', type: 'header' }
];

const SUNITA_EVENTS: TraceEvent[] = [
  { id: 's1', timeOffset: 0, icon: '🎙️', message: 'Voice captured: "Mujhe silai machine ke liye 20,000 chahiye"', type: 'header' },
  { id: 's2', timeOffset: 1, icon: '🧠', message: 'Intent detected: LOAN_REQUEST', type: 'info', detail: 'Amount: ₹20,000 | Lang: Hindi' },
  { id: 'scognee1', timeOffset: 2, icon: '🕸️', message: 'Querying Cognee Memory Graph (SDK)...', type: 'header' },
  { id: 'scognee2', timeOffset: 3, icon: '✅', message: 'Memory Match: "First-time borrower. No previous credit history in graph."', type: 'info' },
  
  { id: 's3', timeOffset: 2, icon: '🔍', message: 'Fetching Paytm transaction data for MERCH_PUNE_0411...', type: 'header' },
  { id: 's4', timeOffset: 3, icon: '✅', message: 'Retrieved 840 QR transactions (last 180 days)', type: 'success' },
  { id: 's5', timeOffset: 3, icon: '✅', message: 'Retrieved 62 daily settlements', type: 'success' },
  { id: 's6', timeOffset: 4, icon: '⚠️', message: 'Retrieved GMV trend: -2.1% MoM', type: 'warning' },
  
  { id: 's7', timeOffset: 5, icon: '🧮', message: 'Calculating alternative credit score...', type: 'header' },
  { id: 's8', timeOffset: 6, icon: '📈', message: 'Factor 1: QR Transaction Volume → Score: 610/900', type: 'progress', progress: 67 },
  { id: 's9', timeOffset: 7, icon: '📈', message: 'Factor 2: GMV Growth Trend → Score: 580/900', type: 'progress', progress: 64 },
  { id: 's10', timeOffset: 8, icon: '📈', message: 'Factor 3: Payer Diversity (42%) → Score: 640/900', type: 'progress', progress: 71 },
  { id: 's11', timeOffset: 9, icon: '📈', message: 'Factor 4: Settlement Regularity → Score: 700/900', type: 'progress', progress: 77 },
  
  { id: 's12', timeOffset: 10, icon: '🎯', message: 'Weighted Saarthi Score: 620/900', type: 'warning' },
  { id: 's13', timeOffset: 10, icon: '✅', message: 'Eligibility: APPROVED with limits (Tier-3: up to ₹15,000)', type: 'success' },
  { id: 's14', timeOffset: 10, icon: '💡', message: 'Reasoning: Lower GMV & transactions. Capping risk exposure.', type: 'info' },

  { id: 's15', timeOffset: 11, icon: '🔐', message: 'Requesting Account Aggregator consent...', type: 'header' },
  { id: 's16', timeOffset: 13, icon: '✅', message: 'User consent granted (1-tap)', type: 'success' },
  { id: 's17', timeOffset: 14, icon: '🏦', message: 'Fetching Bank of Maharashtra statement...', type: 'info' },
  { id: 's18', timeOffset: 15, icon: '✅', message: 'Bank data verified (1 minor bounce in last 6 months)', type: 'success' },
  { id: 's19', timeOffset: 16, icon: '✅', message: 'KYC verified (Aadhaar eKYC)', type: 'success' },

  { id: 's20', timeOffset: 17, icon: '💰', message: 'Generating personalized offer...', type: 'header' },
  { id: 's21', timeOffset: 18, icon: '📊', message: 'Risk-adjusted interest rate: 18% APR | Optimal tenure: 3 months (EMI: ₹5,133)', type: 'info' },
  { id: 's22', timeOffset: 19, icon: '🏢', message: 'Matching NBFC partner: Kisetsu Saison Finance', type: 'info' },
  { id: 's23', timeOffset: 19, icon: '✅', message: 'Offer ready: ₹15,000 @ 18% for 3 months', type: 'success' },

  { id: 's24', timeOffset: 20, icon: '🚀', message: 'Initiating disbursal...', type: 'header' },
  { id: 's25', timeOffset: 21, icon: '🔗', message: 'Partner API: Kisetsu Saison → CALLED', type: 'info' },
  { id: 's26', timeOffset: 22, icon: '✅', message: 'Loan sanctioned by NBFC', type: 'success' },
  { id: 's27', timeOffset: 23, icon: '💸', message: 'Transferring ₹15,000 to Paytm Merchant Wallet...', type: 'info' },
  { id: 's28', timeOffset: 25, icon: '✅', message: 'SETTLED SUCCESS', type: 'success' },
  { id: 's29', timeOffset: 25, icon: '🎉', message: 'Soundbox: "Paytm par pandrah hazaar rupaye prapt hue!"', type: 'header' }
];

export class DemoEngine {
  private events: TraceEvent[] = [];
  private currentInterval: number | null = null;
  private currentScenario: ScenarioType = 'ramesh';
  private startTime: number = 0;

  constructor(private onEventCallback: (event: TraceEvent) => void, private onComplete: () => void) {}

  setScenario(scenario: ScenarioType) {
    this.currentScenario = scenario;
    this.events = scenario === 'ramesh' ? [...RAMESH_EVENTS] : [...SUNITA_EVENTS];
  }

  start() {
    this.stop();
    this.startTime = Date.now();
    let eventIndex = 0;
    
    // We maintain a pause offset so when we pause the timer, we don't skip time.
    let pauseDuration = 0;
    let pauseStart = 0;
    
    const runLoop = () => {
      this.currentInterval = window.setInterval(async () => {
        const elapsedSeconds = (Date.now() - this.startTime - pauseDuration) / 1000;
        
        while (eventIndex < this.events.length && this.events[eventIndex].timeOffset <= elapsedSeconds) {
          const evt = this.events[eventIndex];
          
          // INTERCEPT COGNEE MEMORY CALL
          if (evt.id === 'cognee2' || evt.id === 'scognee2') {
            this.stop(); // pause timer
            pauseStart = Date.now();
            
            try {
              const merchantId = this.currentScenario === 'ramesh' ? 'MERCH_JAIPUR_0821' : 'MERCH_PUNE_0411';
              const query = this.currentScenario === 'ramesh' 
                ? 'Check previous loan history for merchant MERCH_JAIPUR_0821' 
                : 'Check previous loan history for merchant MERCH_PUNE_0411';
                
              const res = await fetch('http://localhost:5000/api/cognee/recall', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ merchantId, query })
              });
              
              if (res.ok) {
                const json = await res.json();
                evt.message = `LIVE API MATCH: "${json.data}"`;
              } else {
                evt.message = `LIVE API ERROR: Could not fetch from graph.`;
                evt.type = 'warning';
              }
            } catch (err) {
              evt.message = `LIVE API FAILED: Network error.`;
              evt.type = 'warning';
            }
            
            this.onEventCallback(evt);
            eventIndex++;
            
            // resume timer
            pauseDuration += (Date.now() - pauseStart);
            runLoop();
            return; // exit current loop iteration
          }
          
          this.onEventCallback(evt);
          eventIndex++;
        }

        if (eventIndex >= this.events.length) {
          this.stop();
          this.onComplete();
        }
      }, 100);
    };
    
    runLoop();
  }

  stop() {
    if (this.currentInterval !== null) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
  }
}
