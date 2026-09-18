import React, { useState } from 'react';
import { SaarthiFormAgent } from './components/form/SaarthiFormAgent';
import { WebUnderwriterPortal } from './components/web/WebUnderwriterPortal';
import { FormAuditReport } from './components/form/FormAuditReport';
import { TraceEvent } from './lib/demoEngine';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/pages/LandingPage';
import { SuccessPage } from './components/pages/SuccessPage';
import { InsuranceAgentView } from './components/insurance/InsuranceAgentView';

// Dummy data for WebUnderwriterPortal to act as a trace panel
const RAMESH_MERCHANT = {
  merchantId: 'MERCH_JAIPUR_0821',
  name: 'Ramesh Kumar',
  businessName: 'Ramesh Kirana Store',
  category: 'Grocery',
  address: 'Shop 4, Main Market, Jaipur, Rajasthan',
  upiId: 'ramesh.kirana@paytm',
  walletBalance: 12450,
  joinedDate: '2021-08-14',
  cibilScore: 745,
  cibilStatus: 'GOOD',
  bankAccount: { bankName: '', accountMasked: '', ifsc: '', verified: true },
  qrMetrics: {
    totalTransactions180d: 0,
    avgMonthlyGmv: 0,
    growthMoM: 0,
    uniquePayerRatio: 0,
    dailySettlements: 0,
    bouncedSettlements: 0,
    peakHours: '',
    avgTicketSize: 0
  },
  activeLoan: null
};

function App() {
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const pushEvent = (event: TraceEvent) => {
    setEvents(prev => [...prev, event]);
  };
  
  const [showAudit, setShowAudit] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'apply' | 'success' | 'insurance'>('landing');
  const [insuranceCategory, setInsuranceCategory] = useState<string | null>(null);

  const handleAuditComplete = () => {
    setShowAudit(true);
  };

  const handleApprove = () => {
    setCurrentView('success');
    setShowAudit(false);
  };

  const handleNavigate = (view: 'landing' | 'apply' | 'success' | 'insurance', category?: string) => {
    setCurrentView(view);
    if (view === 'insurance' && category) {
      setInsuranceCategory(category);
    } else {
      setInsuranceCategory(null);
    }
    if (view !== 'apply' && view !== 'insurance') {
      setShowAudit(false);
      setEvents([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar onNavigate={handleNavigate} currentView={currentView} />

      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingPage onApply={() => handleNavigate('apply')} />
        )}

        {currentView === 'success' && (
          <SuccessPage 
            onHome={() => handleNavigate('landing')} 
            onCrossSell={(cat) => handleNavigate('insurance', cat)}
          />
        )}

        {(currentView === 'apply' || currentView === 'insurance') && (
          <div className="flex-1 p-4 md:p-8 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
            {/* Left Column: Form / Insurance Agent */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] relative">
              {currentView === 'insurance' ? (
                <InsuranceAgentView onEvent={pushEvent} preselectedCategory={insuranceCategory} />
              ) : showAudit ? (
                <FormAuditReport onDisburse={handleApprove} />
              ) : (
                <SaarthiFormAgent onEvent={pushEvent} onAuditComplete={handleAuditComplete} />
              )}
            </div>

            {/* Right Column: Engineer Trace View */}
            <div className="w-full lg:w-96 shrink-0 h-[600px] lg:h-auto lg:min-h-[800px] bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-slate-700">
              <WebUnderwriterPortal
                merchant={RAMESH_MERCHANT as any}
                underwriting={{ merchantId: '', saarthiScore: 0, riskCategory: 'LOW', recommendedLimit: 0, maxLimit: 0, factors: [] }}
                knowledgeGraph={{ merchantId: '', nodes: [], edges: [] }}
                telemetryLogs={[]} 
                activeStep="IDLE"
                traceEvents={events}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
