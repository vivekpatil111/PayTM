import React from 'react';
import { PresentationMode, AppLanguage } from '../../types';
import { Smartphone, LayoutGrid, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  mode: PresentationMode;
  setMode: (mode: PresentationMode) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  onReset: () => void;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  language,
  setLanguage,
  onReset,
  isResetting
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#080e1e]/90 backdrop-blur-md px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Track Info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-paytm-navy to-paytm-cyan p-0.5 flex items-center justify-center shadow-lg shadow-paytm-cyan/20">
              <div className="w-full h-full bg-[#001944] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-paytm-cyan text-xl tracking-tighter">P</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Paytm <span className="text-paytm-cyan">Saarthi</span>
                </h1>
                <span className="bg-paytm-cyan/15 text-paytm-cyan border border-paytm-cyan/30 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-pulse" /> AI Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Copilot for Thin-File Lending & Fintech
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>RBI AA Rails • Gemini 3.8 Flash</span>
          </div>
        </div>

        {/* Center Controls: Presentation Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setMode('split')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              mode === 'split'
                ? 'bg-paytm-cyan text-slate-950 shadow-md shadow-paytm-cyan/25 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Side-by-side view for Hackathon Pitch"
          >
            <span className="text-sm">⚡</span>
            <span>Pitch Mode (Split)</span>
          </button>

          <button
            onClick={() => setMode('mobile')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              mode === 'mobile'
                ? 'bg-paytm-cyan text-slate-950 shadow-md shadow-paytm-cyan/25 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Full Mobile Phone Simulator"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App</span>
          </button>

          <button
            onClick={() => setMode('web')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              mode === 'web'
                ? 'bg-paytm-cyan text-slate-950 shadow-md shadow-paytm-cyan/25 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Underwriter & Analytics Command Center"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Web Portal</span>
          </button>
        </div>

        {/* Right Controls: Language & Reset */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-900/80 rounded-lg border border-slate-700/60 p-0.5 text-xs">
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                language === 'hi' ? 'bg-paytm-navy text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇮🇳 हिंदी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                language === 'en' ? 'bg-paytm-navy text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={onReset}
            disabled={isResetting}
            className="flex items-center gap-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
            title="Reset demo data to initial state"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset</span>
          </button>
        </div>

      </div>
    </header>
  );
};
