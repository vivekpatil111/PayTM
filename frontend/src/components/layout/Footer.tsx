import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-paytm-cyan rounded-lg flex items-center justify-center font-black text-paytm-navy text-lg">
                P
              </div>
              <span className="font-black text-white text-xl tracking-tight">
                Paytm <span className="text-paytm-cyan font-semibold">Saarthi</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Paytm Saarthi is an AI-powered omnichannel lending copilot designed to help merchants get business loans seamlessly, without the friction of traditional forms.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-paytm-cyan transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-paytm-cyan transition-colors">About Saarthi</a></li>
              <li><a href="#" className="hover:text-paytm-cyan transition-colors">Merchant Guidelines</a></li>
              <li><a href="#" className="hover:text-paytm-cyan transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-paytm-cyan transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-paytm-cyan transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-paytm-cyan transition-colors">Lending Disclaimers</a></li>
              <li><a href="#" className="hover:text-paytm-cyan transition-colors">Grievance Redressal</a></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            &copy; {new Date().getFullYear()} One97 Communications Limited. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-lg">
            Loans are offered by our RBI registered NBFC partners. Paytm only acts as a facilitator for lead generation and does not directly provide loans.
          </p>
        </div>
      </div>
    </footer>
  );
};
