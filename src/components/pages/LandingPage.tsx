import React from 'react';
import { ArrowRight, Bot, ShieldCheck, Zap, Globe, MessageSquare, Mic } from 'lucide-react';

interface LandingPageProps {
  onApply: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onApply }) => {
  return (
    <div className="w-full bg-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 pt-16 pb-24 lg:pt-32 lg:pb-36">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-paytm-navy rounded-l-[100px] hidden lg:block opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paytm-cyan/20 text-paytm-navy font-bold text-xs uppercase tracking-wide mb-6">
                <span className="w-2 h-2 rounded-full bg-paytm-cyan animate-pulse"></span>
                Meet Saarthi AI Copilot
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
                No Forms. No Friction.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-paytm-navy to-paytm-cyan">
                  Just Financial Confidence.
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                Paytm Saarthi transforms complex business loan applications into an interactive, multilingual chat experience. Let AI do the heavy lifting while you focus on growing your business.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button 
                  onClick={onApply}
                  className="bg-paytm-navy text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 group w-full sm:w-auto justify-center"
                >
                  Start Application <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  RBI Approved NBFCs
                </div>
              </div>
            </div>

            {/* Hero Image/Mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-paytm-cyan to-blue-500 opacity-20 blur-2xl rounded-full"></div>
              <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-paytm-cyan" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Saarthi Agent</h3>
                      <p className="text-xs text-slate-500">Omnichannel Copilot</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                    Online
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none inline-block max-w-[85%] text-sm text-slate-700 shadow-sm">
                    Hi Ramesh! Since you're logged into Paytm for Business, I can fetch your KYC and ledger details securely. Should we begin?
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-paytm-cyan p-4 rounded-xl rounded-tr-none inline-block max-w-[85%] text-sm font-medium text-slate-900 shadow-sm">
                      Yes, let's apply for a ₹50,000 loan.
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none inline-block max-w-[85%] text-sm text-slate-700 shadow-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-paytm-cyan" /> Auto-filling 50 fields securely...
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Why Merchants Love Saarthi</h2>
            <p className="text-lg text-slate-600">We've eliminated the confusing 10-page forms and replaced them with an intelligent, conversational interface.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multilingual Support</h3>
              <p className="text-slate-600 leading-relaxed">Speak or type in your native language. Saarthi supports Hindi, Marathi, Bengali, Tamil, Telugu, and English effortlessly.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 rounded-xl bg-paytm-cyan/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-7 h-7 text-paytm-navy" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Auto-fill</h3>
              <p className="text-slate-600 leading-relaxed">By leveraging your existing Paytm for Business data, Saarthi securely auto-fills up to 80% of the loan application for you.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Voice & Chat UI</h3>
              <p className="text-slate-600 leading-relaxed">Stuck on a field? Just tap the microphone and ask Saarthi for help. It guides you step-by-step to prevent application drop-offs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-paytm-cyan rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">The Omnichannel Advantage</h2>
            <p className="text-slate-400 text-lg">One ecosystem. Two perfect experiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 relative">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                Traditional Loan Process
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-red-400 text-xs">✕</span></div>
                  <span>Redirection to third-party sites (e.g. InstaMoney)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-red-400 text-xs">✕</span></div>
                  <span>Upfront processing/assessment fees (₹199) before approval</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-red-400 text-xs">✕</span></div>
                  <span>Multiple loading screens and confusing consent pages</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-red-400 text-xs">✕</span></div>
                  <span>English-only forms causing high drop-off rates</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-b from-slate-800 to-paytm-navy border border-paytm-cyan/30 rounded-2xl p-8 relative shadow-[0_0_40px_rgba(0,186,242,0.1)]">
              <div className="absolute top-0 right-0 bg-paytm-cyan text-paytm-navy text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">SAARTHI AI</div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                Paytm Saarthi Ecosystem
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-green-400 text-xs">✓</span></div>
                  <span>Conversational UI on Web & Mobile</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-green-400 text-xs">✓</span></div>
                  <span>Secure auto-fill using Paytm ecosystem</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-green-400 text-xs">✓</span></div>
                  <span>Near 0% drop-off with AI guidance</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-green-400 text-xs">✓</span></div>
                  <span>Native voice & chat in 6 Indian languages</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-paytm-cyan text-paytm-navy text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Experience the Magic?</h2>
          <p className="text-lg font-medium mb-10 opacity-90">Test the Saarthi Web Portal now. See how we transform a 10-page form into a seamless conversation.</p>
          <button 
            onClick={onApply}
            className="bg-paytm-navy text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl"
          >
            Launch Web Portal Demo
          </button>
        </div>
      </section>

    </div>
  );
};
