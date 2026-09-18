import React from 'react';

const USPS = [
  {
    n: 1,
    title: 'Consent-Based Alternative Underwriting',
    body: 'Loan approval with user consent and alternative data signals. Saarthi analyses Paytm payment data, settlement frequency, GMV trends, and merchant cash flow patterns alongside traditional underwriting inputs to build a more complete creditworthiness profile. Transaction data is a signal — not a replacement — helping reduce delay and expand access for thin-file merchants.',
  },
  {
    n: 2,
    title: 'Agentic End-to-End Execution',
    body: 'User intent → AI analysis → underwriting decision → compliance check → money in account. The journey is handled by Saarthi with straight-through processing for eligible journeys, with human escalation for exceptions. Targeted for <2 minutes for eligible merchant profiles.',
    highlight: true,
  },
  {
    n: 3,
    title: 'Vernacular Voice & Conversational UX',
    body: 'Hindi-first, with regional language support. Financial literacy barriers dissolve when users can speak in their own language and be understood accurately by the AI.',
  },
];

const TABLE_ROWS = [
  { cap: 'Loan guidance', trad: true, saarthi: true },
  { cap: 'Form auto-fill', trad: 'Partial', saarthi: true },
  { cap: 'Alternative-data underwriting', trad: false, saarthi: true },
  { cap: 'Agentic execution', trad: false, saarthi: true },
  { cap: 'Journey orchestration', trad: false, saarthi: true },
  { cap: 'Regional language voice', trad: false, saarthi: true },
];

const Cell: React.FC<{ v: boolean | string }> = ({ v }) => {
  if (v === true) return <span className="text-green-600 font-bold">✓</span>;
  if (v === false) return <span className="text-red-400">✗</span>;
  return <span className="text-gray-500 text-xs">{v}</span>;
};

export const UspSection: React.FC = () => (
  <section id="usps" className="bg-white border-t border-gray-100">
    <div className="section-container">
      <h2 className="text-3xl font-black text-gray-900 mb-2">
        Key USPs: What Makes Saarthi Different
      </h2>
      <p className="text-sm text-gray-600 mb-8">
        Saarthi is not a chatbot. It is an{' '}
        <strong>autonomous financial execution agent</strong> — the distinction is absolute.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: 3 USP cards */}
        <div className="space-y-4">
          {USPS.map(u => (
            <div
              key={u.n}
              className={`flex gap-4 p-5 rounded-xl border ${
                u.highlight
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="shrink-0 w-7 h-7 rounded-full bg-[#002970] text-white text-xs font-black flex items-center justify-center">
                {u.n}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{u.title}</h3>
                <p
                  className="text-xs text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: u.body.replace(
                      /money in account|straight-through processing|<2 minutes/g,
                      m => `<strong class="text-blue-700">${m}</strong>`
                    ),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right: Comparison table */}
        <div className="bg-[#002970] rounded-xl p-5 text-white">
          <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-4">
            Existing Copilots vs. Saarthi
          </h3>
          <table className="w-full text-xs border-collapse compare-table">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 rounded-tl-lg font-semibold text-white bg-[#1D4ED8]">Capability</th>
                <th className="px-3 py-2 font-semibold text-white text-center bg-[#1D4ED8]">Traditional</th>
                <th className="px-3 py-2 font-semibold text-white text-center bg-[#1D4ED8] rounded-tr-lg">Saarthi</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr key={row.cap} className={i % 2 === 0 ? 'bg-[#003490]' : 'bg-[#002970]'}>
                  <td className="px-3 py-2 text-blue-100 font-medium">{row.cap}</td>
                  <td className="px-3 py-2 text-center">
                    <Cell v={row.trad} />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Cell v={row.saarthi} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
);
