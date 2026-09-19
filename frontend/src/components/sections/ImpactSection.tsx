import React from 'react';

const PHASES = [
  {
    tag: 'Phase 1: Merchant Loans MVP',
    color: 'border-blue-600 bg-blue-50',
    tagColor: 'text-blue-700',
    steps: [
      { n: '01', h: 'Merchant loan eligibility', d: 'Start with Paytm QR merchants and use transaction data for basic underwriting and pre-qualification.' },
      { n: '02', h: 'Guided application flow', d: 'Reduce manual steps with a conversational journey that collects only the information needed for the pilot.' },
      { n: '03', h: 'Decisioning under 2 minutes', d: 'Automate document checks and risk signals to support fast, contained lending pilot.' },
    ],
    quote: 'The strongest pitch to judges is a focused MVP: solve one problem well, prove adoption, and expand only after the pilot shows clear results.',
  },
];

const EXPANSION = [
  { phase: 'Phase 2', title: 'Insurance Onboarding', desc: 'Only after the merchant loan pilot is validated.', dim: false },
  { phase: 'Phase 3', title: 'Wealth Management', desc: 'Longer-term extension once the core workflow is proven.', dim: true },
];

export const ImpactSection: React.FC = () => (
  <section id="impact" className="bg-[#F5F7FA] border-t border-gray-100">
    <div className="section-container">
      <h2 className="text-3xl font-black text-gray-900 mb-2">Impact & Scalability</h2>
      <p className="text-sm text-gray-600 mb-8">
        Saarthi is being designed as a focused MVP, not a broad platform launch. The goal is to prove
        one high-value use case first, with conservative pilot targets grounded in Paytm's existing
        data and distribution.
      </p>

      {/* 3 Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          {
            stat: '40%',
            label: 'Pilot Target: Drop-Off Reduction',
            desc: 'Expected reduction in merchant loan application abandonment by removing form friction and enabling guided, conversational onboarding.',
          },
          {
            stat: '<2 min',
            label: 'Decisioning',
            desc: 'Target time from merchant sales raise to lending decision in the pilot using transaction data and automated checks.',
          },
          {
            stat: '1 Segment',
            label: 'Focused Reach',
            desc: 'Phase 1 is limited to Paytm QR merchants only — the highest-priority segment with the richest data signal for underwriting.',
          },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-black text-[#002970] mb-2">{s.stat}</div>
            <div className="text-xs font-bold text-gray-700 mb-2">{s.label}</div>
            <p className="text-[11px] text-gray-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Phase 1 + Phased Expansion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phase 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Phase 1: Merchant Loans MVP</h3>
          <div className="space-y-4">
            {PHASES[0].steps.map(step => (
              <div key={step.n} className="flex gap-3">
                <div className="shrink-0">
                  <span className="text-xs font-bold text-blue-600">{step.n}</span>
                  <div className="w-px bg-blue-200 h-full mx-auto mt-1" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 mb-0.5">{step.h}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 quote-box text-xs">
            {PHASES[0].quote}
          </div>
        </div>

        {/* Phased Expansion */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Phased Expansion, Not Everything at Once</h3>
          {EXPANSION.map(e => (
            <div
              key={e.phase}
              className={`border rounded-xl p-5 ${e.dim ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  e.dim ? 'bg-gray-200 text-gray-500' : 'bg-blue-200 text-blue-700'
                }`}>
                  {e.phase}
                </span>
                <span className="text-sm font-bold text-gray-900">{e.title}</span>
              </div>
              <p className="text-xs text-gray-600">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
