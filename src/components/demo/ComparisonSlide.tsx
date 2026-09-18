import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export const ComparisonSlide: React.FC = () => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">The Pain vs. The Solution</h2>
          <p className="text-slate-400 text-sm mt-1">Why merchants abandon traditional loans, and how Saarthi fixes it instantly.</p>
        </div>
        <div className="bg-paytm-navy px-4 py-2 rounded-lg flex items-center gap-2 border border-paytm-cyan/30">
          <Zap className="w-5 h-5 text-paytm-cyan" />
          <span className="text-white font-bold text-sm tracking-widest uppercase">No Forms. Just Financial Confidence.</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px] tracking-wider w-1/3">Metric</th>
              <th className="p-3 border-b border-slate-700 text-red-400 font-bold uppercase text-[10px] tracking-wider w-1/3 bg-red-950/20">Traditional Flow 😫</th>
              <th className="p-3 border-b border-slate-700 text-emerald-400 font-bold uppercase text-[10px] tracking-wider w-1/3 bg-emerald-950/20">Saarthi Agent Flow 😊</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              { metric: 'Manual Data Entry', trad: '50+ Fields', saarthi: '0 Fields (100% Autofill)' },
              { metric: 'Document Uploads', trad: '20+ Scans (PAN, Bank)', saarthi: '0 Uploads (API Verified)' },
              { metric: 'Data Error Rate', trad: '30% - 40%', saarthi: '0% (Real-time Validation)' },
              { metric: 'Average Time to Apply', trad: '45 Minutes', saarthi: '25 Seconds' },
              { metric: 'Application Drop-off', trad: '60%', saarthi: '0%' },
              { metric: 'Rejection Risk', trad: 'High (due to errors)', saarthi: '0% (Pre-audited)' }
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-medium text-slate-300">{row.metric}</td>
                <td className="p-3 font-semibold text-slate-400 bg-red-950/10">{row.trad}</td>
                <td className="p-3 font-bold text-white bg-emerald-950/10 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                  {row.saarthi}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
