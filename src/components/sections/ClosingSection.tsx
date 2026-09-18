import React from 'react';

const BUILT = [
  {
    title: 'Autonomous Execution',
    desc: 'Not guidance — actual loan approval, KYC, and disbursal inside the chat.',
  },
  {
    title: 'Consent-Based Alternative Underwriting',
    desc: 'Transaction data as the credit signal — no bureau dependency, no exclusion.',
  },
  {
    title: 'Scale-Ready Architecture',
    desc: '30 Cr+ users. Existing rails. Zero new infrastructure required.',
  },
];

export const ClosingSection: React.FC = () => (
  <section id="closing" className="bg-white border-t border-gray-100">
    <div className="max-w-6xl mx-auto px-6 py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[360px]">

        {/* Left: Navy banner */}
        <div className="bg-[#002970] text-white p-12 flex flex-col justify-center">
          <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-5">
            The Financial<br />Copilot for Bharat
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-4">
            India's 300 million underserved merchants and consumers don't need another
            portal. They need a <strong className="text-white">trusted guide</strong> that
            understands their language, reads their financial reality, and acts on their
            behalf — instantly.
          </p>
          <p className="text-blue-100 text-sm leading-relaxed mb-6">
            Saarthi doesn't just tell users what to do. It does it with them.
          </p>
          <hr className="border-white/20 mb-4" />
          <p className="text-blue-400 text-xs">
            Team AVINYA &nbsp;·&nbsp; Paytm Hackathon &nbsp;·&nbsp; AI-Powered Financial Journeys Track
          </p>
        </div>

        {/* Right: What We Built */}
        <div className="p-10 flex flex-col justify-center gap-6">
          <h3 className="text-base font-bold text-gray-900">What We Built</h3>

          <div className="space-y-4">
            {BUILT.map(b => (
              <div key={b.title} className="border-b border-gray-100 pb-4 last:border-0">
                <p className="text-sm font-bold text-gray-900 mb-1">{b.title}</p>
                <p className="text-xs text-gray-600">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="quote-box">
            "No Forms. No Friction. Just Financial Confidence."
          </div>

          <div className="green-badge">
            <span>✓</span>
            <span>Ready to transform financial journeys through autonomous AI</span>
          </div>
        </div>

      </div>
    </div>
  </section>
);
