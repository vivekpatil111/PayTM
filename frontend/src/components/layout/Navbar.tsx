import React from 'react';

interface NavbarProps {
  onNavigate: (view: 'landing' | 'apply' | 'success' | 'insurance') => void;
  currentView: 'landing' | 'apply' | 'success' | 'insurance';
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate('landing')}
          >
            <div className="w-8 h-8 bg-paytm-navy rounded-lg flex items-center justify-center font-black text-white text-lg">
              P
            </div>
            <span className="font-black text-paytm-navy text-xl tracking-tight">
              Paytm <span className="text-paytm-cyan font-semibold">Saarthi</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('landing')} 
              className={`text-sm font-bold transition-colors ${currentView === 'landing' ? 'text-paytm-navy' : 'text-slate-500 hover:text-paytm-navy'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('insurance')} 
              className={`text-sm font-bold transition-colors ${currentView === 'insurance' ? 'text-paytm-navy' : 'text-slate-500 hover:text-paytm-navy'}`}
            >
              Insurance
            </button>
            <button 
              className="text-sm font-bold text-slate-500 hover:text-paytm-navy transition-colors"
            >
              Benefits
            </button>
          </div>

          {/* Apply Button */}
          <div className="flex items-center">
            {currentView !== 'apply' && (
              <button 
                onClick={() => onNavigate('apply')}
                className="bg-paytm-cyan text-paytm-navy font-black text-sm px-5 py-2.5 rounded-full hover:bg-paytm-navy hover:text-white transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Apply for Loan
              </button>
            )}
            {currentView === 'apply' && (
              <div className="px-4 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Secure Application
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
