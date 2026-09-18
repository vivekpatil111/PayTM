import React from 'react';

const STEPS = [
  {
    n: '01', label: 'Intent',
    desc: 'Chat or voice trigger inside Paytm App or Paytm for Business. Hindi and regional languages. Zero form filling required.',
  },
  {
    n: '02', label: 'Consent',
    desc: 'User consent is captured before data access or processing begins, with clear disclosure and permission-based flow.',
  },
  {
    n: '03', label: 'Intelligence',
    desc: 'AI models scan Paytm transaction history, QR settlement frequency, GMV visibility, and repayment proxies — in real time.',
  },
  {
    n: '04', label: 'Verification',
    desc: 'Account Aggregator framework validates financial data with user consent — RBI compliant, instant, and secure.',
  },
  {
    n: '05', label: 'Offer',
    desc: 'Eligible merchants receive a context-aware loan offer, shaped by the underwriting outcome and platform policy checks.',
  },
  {
    n: '06', label: 'Action',
    desc: 'User reviews, confirms, and proceeds within the app. The journey is seamless while preserving control and transparency.',
  },
  {
    n: '07', label: 'Disbursal',
    desc: 'Loan approved and settled autonomously to self-settlement rails. Straight-through processing for eligible journeys.',
  },
];

export const SolutionSection: React.FC = () => (
  <section id="solution" className="bg-[#F5F7FA] border-t border-gray-100">
    <div className="section-container">

      <h2 className="text-3xl font-black text-gray-900 mb-2">The Solution: Paytm Saarthi</h2>
      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
        Saarthi (Sanskrit: <em>guide, charioteer</em>) is an{' '}
        <strong>in-app AI copilot</strong> embedded directly within the Paytm App and
        Paytm for Business. It does not redirect users to external portals or forms — it{' '}
        <strong>acts</strong> on their behalf.
      </p>

      {/* 3 Pillar Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-10 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        {[
          {
            num: '1',
            title: 'Embedded Access',
            detail:
              'Native integration in Paytm App & Paytm for Business — zero new app required. Available at the moment of intent, inside the product users already trust.',
          },
          {
            num: '2',
            title: 'Chat + Voice Interface',
            detail:
              'Conversational UI in Hindi and regional languages. A merchant in Jaipur says "Mujhe loan chahiye" — Saarthi understands, responds, and acts.',
          },
          {
            num: '3',
            title: 'Autonomous Execution',
            detail:
              'Saarthi orchestrates eligibility, verification, compliance checks, and disbursal through connected financial rails.',
          },
        ].map((step, i) => (
          <div
            key={step.num}
            className={`p-8 flex flex-col gap-3 ${i > 0 ? 'border-l border-gray-200' : ''}`}
          >
            {/* Step arrow badge */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="bg-[#002970] text-white text-xs font-black w-8 h-8 flex items-center justify-center"
                  style={{ clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)' }}>
                  {step.num}
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{step.detail}</p>
          </div>
        ))}
      </div>

      {/* 7-Step Journey Flow Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5">
          The 7-Step Autonomous Journey
        </h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {STEPS.slice(0, 4).map((s) => (
            <div key={s.n} className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-blue-500 font-bold">{s.n}</span>
                <div className="flex-1 h-px bg-blue-200" />
              </div>
              <p className="text-xs font-bold text-gray-800">{s.label}</p>
              <p className="text-[11px] text-gray-500 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {STEPS.slice(4).map((s) => (
            <div key={s.n} className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-blue-500 font-bold">{s.n}</span>
                <div className="flex-1 h-px bg-blue-200" />
              </div>
              <p className="text-xs font-bold text-gray-800">{s.label}</p>
              <p className="text-[11px] text-gray-500 leading-snug">{s.desc}</p>
            </div>
          ))}
          {/* Filler empty div so grid stays 4 cols */}
          <div />
        </div>
      </div>

      {/* Quote + Chips row */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="quote-box flex-1">
          "Loan chahiye" — Orchestrates the entire journey from intent to disbursal,
          with straight-through processing for eligible profiles.
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 min-w-[220px]">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Journeys Handled
          </p>
          {['Instant loans', 'Insurance onboarding', 'KYC verification', 'Account Aggregator consent flows'].map(j => (
            <span
              key={j}
              className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded font-medium"
            >
              {j}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
