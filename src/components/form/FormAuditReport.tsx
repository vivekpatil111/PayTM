import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface FormAuditReportProps {
  onDisburse: () => void;
}

export const FormAuditReport: React.FC<FormAuditReportProps> = ({ onDisburse }) => {
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDisburse = () => {
    setIsDisbursing(true);
    setTimeout(() => {
      setIsDisbursing(false);
      setIsSuccess(true);
      setTimeout(onDisburse, 1500); // Wait 1.5s then trigger parent disbursal action
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-emerald-500 rounded-xl p-8 shadow-2xl flex flex-col items-center justify-center text-center animate-scaleUp h-[700px]">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Loan Approved!</h2>
        <p className="text-emerald-50 font-medium">₹50,000 disbursed to Paytm Merchant Wallet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 h-[700px] flex flex-col">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-paytm-cyan" />
        <div>
          <h2 className="text-xl font-black text-white">Form Audit Report</h2>
          <p className="text-xs text-slate-400">AI-Verified Application Data</p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accuracy</p>
            <p className="text-3xl font-black text-emerald-400">100%</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rejection Risk</p>
            <p className="text-3xl font-black text-emerald-400">0%</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Verification Summary</h3>
          {[
            'Personal Details: Verified via CKYC',
            'PAN: Verified (NSDL API)',
            'Aadhaar: Verified (UIDAI API)',
            'Bank Account: Verified (Penny Drop)',
            'Income: Verified (Paytm GMV Ledger)',
            'Documents: 5/5 Valid & Signed'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-800 border-t border-slate-700">
        <button
          onClick={handleDisburse}
          disabled={isDisbursing}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
        >
          {isDisbursing ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              Processing Disbursal...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-slate-950" />
              Submit & Disburse ₹50,000
            </>
          )}
        </button>
      </div>
    </div>
  );
};
