import React from 'react';

const MOATS = [
  {
    icon: '🗄️',
    title: 'Unmatched Transaction Data',
    body: "5 Cr+ merchants generating real-time QR payment data, settlement histories, and GMV patterns. This merchant graph powers underwriting and personalisation with signals that are deeper, fresher, and more behaviourally predictive than bureau-only inputs.",
  },
  {
    icon: '🏪',
    title: 'Existing Distribution Infrastructure',
    body: 'Paytm App and Paytm for Business already reach hundreds of millions of users. Saarthi plugs into an installed, trusted, daily-use surface — enabling instant reach without building a new acquisition or onboarding funnel.',
  },
  {
    icon: '🛡️',
    title: 'Trust, Compliance & Regulatory Approval',
    body: 'Paytm operates within an RBI-regulated ecosystem. Saarthi is designed to integrate with existing RBI-regulated lending, KYC, and AA rails, leveraging the compliance foundation already in place.',
  },
];

const AI_LAYERS = [
  { label: 'User Voice', width: '60%', bg: '#1e3a8a' },
  { label: 'Intent Agent', width: '72%', bg: '#1d4ed8' },
  { label: 'Journey Orchestrator', width: '86%', bg: '#2563eb' },
  { label: 'Financial Engine', width: '100%', bg: '#3b82f6' },
];

export const MoatSection: React.FC = () => (
  <section id="moat" className="bg-white border-t border-gray-100">
    <div className="section-container">
      <h2 className="text-3xl font-black text-gray-900 mb-2">Why Paytm is Uniquely Positioned</h2>
      <p className="text-sm text-gray-600 mb-8">
        Saarthi is not a standalone AI product — it is a{' '}
        <strong>capability built on assets that no competitor can replicate</strong>. The moat is structural, not technical.
      </p>

      {/* 3 Moat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {MOATS.map(m => (
          <div key={m.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{m.icon}</div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">{m.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{m.body}</p>
          </div>
        ))}
      </div>

      {/* AI Architecture arrows */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
          AI Architecture: More Than a Chatbot
        </h3>
        <div className="space-y-2">
          {AI_LAYERS.map((layer) => (
            <div key={layer.label} className="flex items-center gap-3">
              <div
                className="h-11 flex items-center pl-5 text-white font-bold text-sm rounded-sm relative"
                style={{
                  width: layer.width,
                  background: layer.bg,
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
                  transition: 'width 0.5s ease',
                }}
              >
                {layer.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
