import React, { useState, useEffect } from 'react';
import { SaarthiFormAgent } from './components/form/SaarthiFormAgent';
import { WebUnderwriterPortal } from './components/web/WebUnderwriterPortal';
import { FormAuditReport } from './components/form/FormAuditReport';
import { TraceEvent } from './lib/demoEngine';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/pages/LandingPage';
import { SuccessPage } from './components/pages/SuccessPage';
import { InsuranceAgentView } from './components/insurance/InsuranceAgentView';
import { PersonaSelector } from './components/common/PersonaSelector';
import { knowledgeGraph } from './lib/knowledgeGraphAdapter';

// Default merchant — overridden by persona selector
const MERCHANT_DEFAULTS: Record<string, { name: string; businessName: string }> = {
  'MERCH_JAIPUR_0821':    { name: 'Ramesh Sharma',  businessName: 'Ramesh Kirana Store' },
  'MERCH_PUNE_0411':      { name: 'Sunita Devi',    businessName: 'Sunita Silai Centre' },
  'MERCH_DELHI_1104':     { name: 'Arjun Mehta',    businessName: 'Mehta Mobile & Recharge' },
  'MERCH_MUMBAI_0512':    { name: 'Priya Nadar',    businessName: 'Priya Tiffin Services' },
  'MERCH_HYDERABAD_0903': { name: 'Venkat Reddy',   businessName: 'Reddy Auto Spare Parts' },
  'MERCH_KOLKATA_0707':   { name: 'Fatima Begum',   businessName: 'Fatima Handicrafts' },
};

function App() {
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const pushEvent = (event: TraceEvent) => {
    setEvents(prev => [...prev, event]);
    
    // Push the event to Cognee Cloud in the background!
    knowledgeGraph.remember({
      merchantId: activeMerchantId,
      eventType: event.type || 'trace',
      text: event.message
    }).catch(err => console.error("Cognee Sync Error:", err));
  };
  
  const [showAudit, setShowAudit] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'apply' | 'success' | 'insurance'>('landing');
  const [insuranceCategory, setInsuranceCategory] = useState<string | null>(null);

  // ── Persona switcher state ────────────────────────────────────────────────
  const [activeMerchantId, setActiveMerchantId] = useState('MERCH_JAIPUR_0821');
  const activeMeta = MERCHANT_DEFAULTS[activeMerchantId] ?? MERCHANT_DEFAULTS['MERCH_JAIPUR_0821'];

  // Reset trace events whenever persona switches (fresh demo run)
  useEffect(() => {
    setEvents([]);
    setShowAudit(false);
  }, [activeMerchantId]);

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
          <div className="flex-1 px-4 pt-4 pb-6 md:px-8 md:pt-6 md:pb-8 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">

            {/* ── Demo Toolbar: Persona Selector (mobile) ── */}
            <div className="lg:hidden flex items-center justify-between gap-2 mb-1">
              <p className="text-xs text-slate-500 font-medium">Switch Merchant Demo:</p>
              <PersonaSelector currentId={activeMerchantId} onSelect={setActiveMerchantId} />
            </div>

            {/* Left Column: Form / Insurance Agent */}
            <div className="flex-1 flex flex-col items-center">
              {currentView === 'insurance' ? (
                <InsuranceAgentView onEvent={pushEvent} preselectedCategory={insuranceCategory} />
              ) : showAudit ? (
                <FormAuditReport onDisburse={handleApprove} />
              ) : (
                <SaarthiFormAgent onEvent={pushEvent} onAuditComplete={handleAuditComplete} />
              )}
            </div>

            {/* Right Column: Engineer Trace View */}
            <div className="w-full lg:w-[420px] shrink-0 bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-slate-700" style={{ minHeight: '800px' }}>

              {/* Persona Selector — desktop */}
              <div className="hidden lg:flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950 shrink-0">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Demo Merchant</span>
                <PersonaSelector currentId={activeMerchantId} onSelect={setActiveMerchantId} />
              </div>

              <WebUnderwriterPortal
                merchant={{ ...activeMeta, merchantId: activeMerchantId, cibilScore: null } as any}
                underwriting={{ merchantId: activeMerchantId, saarthiScore: 0, riskCategory: 'LOW', recommendedLimit: 0, maxLimit: 0, factors: [] }}
                knowledgeGraph={{ merchantId: activeMerchantId, nodes: [], edges: [] }}
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
