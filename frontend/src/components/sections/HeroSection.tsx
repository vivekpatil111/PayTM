import React from 'react';

export const HeroSection: React.FC = () => (
  <section id="top" className="pt-14 bg-white">
    <div className="max-w-6xl mx-auto px-6 py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">

        {/* Left: Navy banner */}
        <div className="bg-[#002970] text-white p-12 flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-4">
            Paytm Saarthi
          </h1>
          <h2 className="text-xl font-semibold text-blue-200 mb-4 leading-snug">
            Autonomous AI Copilot for Financial Journeys
          </h2>
          <p className="text-blue-100 italic text-sm mb-8 border-l-2 border-blue-400 pl-4">
            "No Forms. No Friction. Just Financial Confidence."
          </p>
          <hr className="border-white/20 mb-6" />
          <p className="text-blue-300 text-sm">
            <span className="font-semibold text-white">Team:</span> AVINYA &nbsp;·&nbsp;{' '}
            <span className="font-semibold text-white">Track:</span> AI-Powered Financial Journeys
          </p>
        </div>

        {/* Right: 3 stacked info cards */}
        <div className="flex flex-col divide-y divide-gray-100 border-l border-gray-100">
          {[
            {
              title: 'The Problem',
              body: '60% of loan and insurance applications never complete due to friction, forms, and exclusion of thin-file customers.',
            },
            {
              title: 'The Answer',
              body: 'An in-app AI copilot that autonomously executes financial journeys — no forms, instant decisions, real disbursement.',
            },
            {
              title: 'The Moat',
              body: "Built on Paytm's 5 Cr+ merchant transaction dataset and RBI-regulated infrastructure — an advantage no one else can replicate.",
            },
          ].map((card) => (
            <div key={card.title} className="p-8 flex-1 flex flex-col justify-center hover:bg-blue-50/50 transition-colors">
              <h3 className="text-sm font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  </section>
);
