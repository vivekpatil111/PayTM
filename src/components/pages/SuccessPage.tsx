import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, ExternalLink, Download } from 'lucide-react';

interface SuccessPageProps {
  onHome: () => void;
  onCrossSell?: (category: string) => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onHome, onCrossSell }) => {

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00baf2', '#002970']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00baf2', '#002970']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
    
    // Attempt to play soundbox chime if we had an audio file
    // const audio = new Audio('/soundbox.mp3');
    // audio.play().catch(e => console.log(e));
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-paytm-navy to-blue-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-paytm-cyan rounded-full mix-blend-overlay filter blur-2xl opacity-50"></div>
          
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)] relative z-10">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2 relative z-10">Loan Approved!</h2>
          <p className="text-paytm-cyan font-medium relative z-10">₹50,000 has been disbursed.</p>
        </div>

        {/* Content Details */}
        <div className="p-8">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-center">
            <p className="text-sm text-slate-500 mb-1 font-medium uppercase tracking-wider">Amount Credited to Wallet</p>
            <h3 className="text-4xl font-black text-slate-800 mb-4">₹50,000</h3>
            
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg py-2 px-4 inline-flex">
              <span>Transaction ID: <strong>TXN984210045X</strong></span>
              <button className="hover:text-paytm-cyan transition-colors" title="Copy ID">
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Interest Rate</span>
              <span className="text-sm font-bold text-slate-800">12% p.a.</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Tenure</span>
              <span className="text-sm font-bold text-slate-800">6 Months</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Daily EMI (Deducted via QR)</span>
              <span className="text-sm font-bold text-slate-800">₹295 / day</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Lending Partner</span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                Aditya Birla Finance <ExternalLink className="w-3 h-3 text-paytm-cyan" />
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Agreement
            </button>
            <button 
              onClick={onHome}
              className="flex-1 bg-paytm-navy text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
            >
              Back to Home
            </button>
          </div>

          {/* Cross-sell Banner */}
          {onCrossSell && (
            <div 
              onClick={() => onCrossSell('shop')}
              className="mt-6 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-2xl">🏪</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Protect your newly funded shop!</h4>
                  <p className="text-sm text-slate-600">Get Shop Insurance from just ₹2/day</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded-full shadow-sm text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                →
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
