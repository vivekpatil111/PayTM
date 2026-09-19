import React from 'react';

export const ProblemSection: React.FC = () => (
  <section id="problem" className="bg-white border-t border-gray-100">
    <div className="section-container">

      <h2 className="text-3xl font-black text-gray-900 mb-3">The Problem</h2>
      <p className="text-sm text-gray-600 mb-1">
        India's financial inclusion gap is not a supply problem — it is a{' '}
        <strong>friction and data problem</strong>. Customers exist. Intent exists. The process fails them.
      </p>
      <p className="text-sm font-bold text-gray-800 underline mb-8">
        The problem isn't a lack of financial products. It's completing the journey.
      </p>

      {/* 3-column problem cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">

        {/* Col 1: Big bold drop-off */}
        <div className="bg-[#2563EB] text-white p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-4xl font-black leading-tight mb-4">
              High<br />Application<br />Drop-Off
            </h3>
          </div>
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Friction</p>
            <p className="text-blue-100 text-xs leading-relaxed">
              Complex multi-step forms and document uploads create avoidable abandonment
              across loan and insurance journeys.
            </p>
          </div>
        </div>

        {/* Col 2: Exclusion */}
        <div className="bg-white border-l border-gray-200 p-8 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Exclusion</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Thin-file customers with <strong>no CIBIL score</strong> struggle to prove
              creditworthiness, even when their transaction history shows consistent cash flows.
            </p>
          </div>
          <div className="warning-box">
            <span className="text-amber-500 text-base mt-0.5">⚠️</span>
            <span>
              No score ≠ No creditworthiness. The data exists. The system ignores it.
            </span>
          </div>
        </div>

        {/* Col 3: No Execution Layer */}
        <div className="bg-white border-l border-gray-200 p-8">
          <h3 className="text-sm font-bold text-gray-900 mb-2">No Execution Layer</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Existing chatbots explain the journey, route FAQs, and provide links — but they do{' '}
            <strong>not complete the journey autonomously</strong>.
          </p>
        </div>
      </div>

      {/* Bottom 2-col row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-xl p-6 border-l-4 border-l-gray-400">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">The Gap</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            Users still fill forms, wait for approvals, and drop off before completion.
            Guidance is not the same as execution.
          </p>
        </div>
        <div className="border border-blue-200 rounded-xl p-6 border-l-4 border-l-[#2563EB] bg-blue-50/40">
          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">The Opportunity</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            A single AI agent can read transaction context, perform underwriting, route through
            compliance, and <strong className="text-blue-700">disburse funds</strong> — without a single form field.
          </p>
        </div>
      </div>
    </div>
  </section>
);
