import React from 'react';

const STEPS = [
  {
    n: '1', label: 'Intent',
    desc: 'Chat or voice trigger inside Paytm App or Paytm for Business. Hindi and regional languages. Zero form filling required.',
  },
  {
    n: '2', label: 'Consent',
    desc: "User consent is captured before data access or processing begins, with clear disclosure and permission-based flow.",
  },
  {
    n: '3', label: 'Intelligence',
    desc: 'AI models scan Paytm transaction history, QR settlement frequency, GMV visibility, and repayment proxies — in real time.',
  },
  {
    n: '4', label: 'Verification',
    desc: 'Account Aggregator framework validates financial data with user consent — RBI compliant, instant, and secure.',
  },
  {
    n: '5', label: 'Offer',
    desc: 'Eligible merchants receive a context-aware loan offer, shaped by the underwriting outcome and platform policy checks.',
  },
  {
    n: '6', label: 'Action',
    desc: 'User reviews, confirms, and proceeds within the app. The journey is seamless while preserving control and transparency.',
  },
  {
    n: '7', label: 'Disbursal',
    desc: 'Loan approved and settled autonomously to self-settlement rails. Straight-through processing for eligible journeys, with human escalation for exceptions.',
  },
];

// CSS Pinwheel: 4 blade divs + center circle
const Pinwheel: React.FC = () => (
  <div className="relative w-52 h-52 mx-auto my-8">
    {/* 4 blades */}
    {[
      { rotate: 0, label: 'Intent', top: '-10%', left: '-10%' },
      { rotate: 90, label: 'Consent', top: '-10%', right: '-10%' },
      { rotate: 180, label: 'Intelligence', bottom: '-10%', right: '-10%' },
      { rotate: 270, label: 'Verification', bottom: '-10%', left: '-10%' },
    ].map((blade) => (
      <div key={blade.label} className="absolute" style={{
        top: blade.top, left: blade.left, right: (blade as any).right, bottom: (blade as any).bottom,
        width: '55%', height: '55%',
      }}>
        <div
          className="w-full h-full bg-[#2563EB] rounded-tl-[70%] opacity-90"
          style={{ transform: `rotate(${blade.rotate}deg)` }}
        />
      </div>
    ))}
    {/* Center circle */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-white shadow-lg border-4 border-[#002970] flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-[#002970] flex items-center justify-center">
          <span className="text-white font-black text-lg leading-none">P</span>
        </div>
      </div>
    </div>
    {/* Labels around pinwheel */}
    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700">Intent</span>
    <span className="absolute top-1/2 -right-14 -translate-y-1/2 text-xs font-bold text-gray-700">Consent</span>
    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700">Intelligence</span>
    <span className="absolute top-1/2 -left-16 -translate-y-1/2 text-xs font-bold text-gray-700">Verification</span>
  </div>
);

export const HowItWorksSection: React.FC = () => (
  <section id="how-it-works" className="bg-[#F5F7FA] border-t border-gray-100">
    <div className="section-container">
      <h2 className="text-3xl font-black text-gray-900 mb-2">How It Works: The Autonomous Journey</h2>
      <p className="text-sm text-gray-600 mb-2">
        From user intent to money in account — Saarthi orchestrates a complete financial journey
        inside the Paytm app, targeted for{' '}
        <strong>&lt;2 minutes</strong> for eligible merchant profiles.
      </p>

      {/* Pinwheel */}
      <Pinwheel />

      {/* 7-step grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STEPS.map(s => (
          <div key={s.n} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                {s.n}
              </span>
              <span className="text-sm font-bold text-gray-900">{s.label}</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
