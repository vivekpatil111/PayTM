import React, { useState, useEffect, useRef } from 'react';
import { Merchant, AppLanguage, SaarthiStep, UnderwritingData } from '../../types';
import { api } from '../../services/api';
import { speakPaytmSoundbox } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Mic,
  QrCode,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Volume2,
  X,
  ChevronRight,
  Landmark,
  FileCheck
} from 'lucide-react';

interface MobileAppSimulatorProps {
  merchant: Merchant;
  underwriting: UnderwritingData;
  language: AppLanguage;
  onRefreshMerchant: () => void;
  onStepChange?: (step: SaarthiStep) => void;
  onStartDemo?: () => void;
  activeStep?: SaarthiStep;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  merchant,
  underwriting,
  language,
  onRefreshMerchant,
  onStepChange,
  onStartDemo,
  activeStep: externalActiveStep
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [internalStep, setInternalStep] = useState<SaarthiStep>('IDLE');
  
  const currentStep = externalActiveStep || internalStep;
  const setCurrentStep = (step: SaarthiStep) => {
    setInternalStep(step);
    onStepChange?.(step);
  };
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: language === 'hi'
        ? 'Namaste Ramesh ji! Ramesh Kirana Store ke 4,520 QR transactions ke aadhar par aap ₹1,00,000 tak ke business loan ke liye eligible hain. Main aapki kya madad karun?'
        : 'Hello Ramesh ji! Based on 4,520 QR sales, you are pre-approved for an instant business loan up to ₹1,00,000. How can I assist you?',
      time: 'Just now'
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [disbursedResult, setDisbursedResult] = useState<{ txnId: string; amount: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStep]);

  // Open drawer helper
  const openAssistant = () => {
    setIsDrawerOpen(true);
    if (currentStep === 'IDLE') {
      setCurrentStep('LISTENING');
    }
  };

  // Process user message
  const handleSendMessage = async (userText: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: timeNow }]);

    const lower = userText.toLowerCase();

    if (lower.includes('loan') || lower.includes('50,000') || lower.includes('chahiye')) {
      setCurrentStep('SCANNING_LEDGER');
      setScanProgress(15);

      // Simulate step-by-step audit
      setTimeout(() => setScanProgress(45), 600);
      setTimeout(() => setScanProgress(75), 1200);
      setTimeout(() => {
        setScanProgress(100);
        setCurrentStep('AA_CONSENT');
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: language === 'hi'
              ? 'Aapka Alternative Credit Score 825/900 calculate hua hai! RBI Account Aggregator ke zariye bas 1-tap consent dekar apna SBI account cashflow verify karein.'
              : 'Your Alternative Credit Score is 825/900 (Excellent)! Please grant 1-tap consent via RBI Account Aggregator to verify SBI bank cashflow.',
            time: 'Just now'
          }
        ]);
      }, 1800);
    } else if (lower.includes('interest') || lower.includes('emi') || lower.includes('byaj')) {
      setCurrentStep('OFFER_VIEW');
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: language === 'hi'
            ? 'Aapko 12% p.a. interest rate par 6 mahine ke liye ₹50,000 milenge. Monthly EMI ₹8,830 ya daily deduction ₹294 hogi. Koi processing fee nahi hai.'
            : 'You get ₹50,000 at 12% APR for 6 months. Monthly EMI is ₹8,830 (or ₹294/day deduction). Zero processing fee for merchants.',
          time: 'Just now'
        }
      ]);
    } else {
      const res = await api.sendChatMessage(userText, language);
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: res.reply, time: 'Just now' }
      ]);
    }
  };

  // Handle Account Aggregator Consent
  const handleConsentApprove = async () => {
    setCurrentStep('THINKING');
    await api.submitConsent(true);

    setTimeout(() => {
      setCurrentStep('OFFER_VIEW');
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: language === 'hi'
            ? 'Account Aggregator se bank verification safal raha! Aapka ₹50,000 ka loan offer approve ho chuka hai. Kripya niche review karein aur 1-click mein paise apne wallet mein paayein.'
            : 'Bank verification via Account Aggregator successful! Your ₹50,000 loan offer is approved. Review below to disburse directly to your Paytm wallet.',
          time: 'Just now'
        }
      ]);
    }, 1000);
  };

  // Handle Instant Disbursal
  const handleDisburse = async () => {
    setIsDisbursing(true);
    setCurrentStep('DISBURSING');

    try {
      const result = await api.disburseLoan(50000, 6);
      setIsDisbursing(false);
      setCurrentStep('SUCCESS');
      setDisbursedResult({ txnId: result.data.txnId, amount: 50000 });

      // Trigger Celebration Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Play authentic Paytm Soundbox audio chime
      speakPaytmSoundbox(50000, language);

      // Refresh master state
      onRefreshMerchant();

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: language === 'hi'
            ? 'Badhai ho Ramesh ji! ₹50,000 aapke Paytm Merchant Account mein transfer ho gaye hain. Soundbox par confirmation announcement ho chuki hai.'
            : 'Congratulations Ramesh ji! ₹50,000 has been credited to your Paytm Merchant Account. Soundbox announcement completed.',
          time: 'Just now'
        }
      ]);
    } catch (e) {
      console.error(e);
      setIsDisbursing(false);
    }
  };

  // Web Speech recognition toggle
  const toggleSpeechRecognition = () => {
    if (onStartDemo) {
      onStartDemo();
      return;
    }

    const SpeechRecognitionClass = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      // Fallback: send instant prompt
      handleSendMessage(language === 'hi' ? 'Mujhe 50,000 ka loan chahiye' : 'I need a 50,000 loan');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        handleSendMessage(language === 'hi' ? 'Mujhe 50,000 ka loan chahiye' : 'I need a 50,000 loan');
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      handleSendMessage(language === 'hi' ? 'Mujhe 50,000 ka loan chahiye' : 'I need a 50,000 loan');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Visual Badge above phone */}
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-paytm-cyan bg-paytm-cyan/10 border border-paytm-cyan/30 px-3 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-paytm-cyan animate-ping" />
        Paytm for Business • Merchant View
      </div>

      {/* Phone Mockup Frame */}
      <div className="mobile-chassis text-slate-900 select-none flex flex-col justify-between">
        
        {/* iOS / Android Status Bar */}
        <div className="h-7 bg-[#002970] text-white flex items-center justify-between px-6 pt-1 text-[11px] font-semibold tracking-tight">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Paytm App Header */}
        <div className="bg-[#002970] text-white px-4 pb-4 pt-1 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm text-paytm-cyan">
                RS
              </div>
              <div>
                <h2 className="text-xs font-bold leading-tight flex items-center gap-1">
                  {merchant?.businessName || 'Loading...'}
                  <CheckCircle2 className="w-3.5 h-3.5 text-paytm-cyan fill-paytm-cyan/20" />
                </h2>
                <p className="text-[10px] text-slate-300">
                  {merchant?.name || ''} • {(merchant?.address || '').split(',')[2] || 'Jaipur'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-lg text-white" title="Business QR">
                <QrCode className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Today's Sales Card */}
          <div className="mt-3 bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/15 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-300 font-medium">Today's QR Collections</p>
              <p className="text-lg font-black tracking-tight text-white flex items-baseline gap-1">
                ₹{merchant.walletBalance.toLocaleString('en-IN')}
                <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> +14.2%
                </span>
              </p>
            </div>
            <div className="text-right">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                ● Soundbox Active
              </span>
              <p className="text-[10px] text-slate-300 mt-1">28 payments received</p>
            </div>
          </div>
        </div>

        {/* Scrollable Merchant Home Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f5f7fc]">
          
          {/* Hero Banner: Saarthi AI Instant Loan Hook */}
          <div 
            onClick={openAssistant}
            className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#002970] via-[#00388d] to-[#00baf2] p-3.5 text-white shadow-lg shadow-blue-900/20 border border-cyan-300/30 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="bg-cyan-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                    NEW • AI POWERED
                  </span>
                  <span className="text-[10px] text-cyan-200 font-semibold">Paytm Saarthi</span>
                </div>
                <h3 className="text-sm font-black leading-tight text-white">
                  {language === 'hi' ? '₹1,00,000 तक का बिजनेस लोन' : 'Instant Business Loan up to ₹1 Lakh'}
                </h3>
                <p className="text-[10px] text-slate-200 leading-snug">
                  {language === 'hi' 
                    ? 'No CIBIL needed • 4,520 QR बिक्री के आधार पर प्री-अप्रूव्ड'
                    : 'No CIBIL needed • Pre-approved from your 4,520 QR sales'}
                </p>
              </div>

              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[10px] font-bold">
              <span className="text-cyan-200 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                {language === 'hi' ? 'बोलकर तुरंत पाएं' : 'Tap to speak with Saarthi'}
              </span>
              <span className="bg-white text-paytm-navy px-2 py-0.5 rounded-full font-extrabold flex items-center gap-0.5">
                Apply in 90s <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-medium">6-Mo QR Volume</span>
                <TrendingUp className="w-3.5 h-3.5 text-paytm-navy" />
              </div>
              <p className="text-sm font-extrabold text-slate-900">4,520 Txns</p>
              <p className="text-[9px] text-slate-500">₹86,400 avg monthly</p>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-medium">Settlement Record</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-sm font-extrabold text-emerald-700">178 Days 100%</p>
              <p className="text-[9px] text-emerald-600 font-medium">Zero bounces</p>
            </div>
          </div>

          {/* Recent QR Transactions Strip */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold text-slate-800">Recent Customer QR Payments</h4>
              <span className="text-[10px] text-paytm-navy font-semibold">View All</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                    AK
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 leading-tight">Amit Kumar</p>
                    <p className="text-[9px] text-slate-400">UPI • 12 mins ago</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-600">+₹180</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                    PS
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 leading-tight">Pooja Sharma</p>
                    <p className="text-[9px] text-slate-400">Paytm Wallet • 28 mins ago</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-600">+₹450</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                    VS
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 leading-tight">Vijay Singh</p>
                    <p className="text-[9px] text-slate-400">UPI • 45 mins ago</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-600">+₹75</span>
              </div>
            </div>
          </div>

          {/* Active Loan Widget if Disbursed */}
          {merchant.activeLoan && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-emerald-900 animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Active Business Loan
                </span>
                <span className="text-[9px] bg-emerald-200/80 px-2 py-0.5 rounded-full font-bold">
                  Disbursed
                </span>
              </div>
              <p className="text-base font-black text-emerald-950">
                ₹{merchant.activeLoan.principal.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-emerald-800">
                Monthly EMI: ₹{merchant.activeLoan.monthlyEmi.toLocaleString('en-IN')} (auto-deducted daily: ₹294)
              </p>
            </div>
          )}

        </div>

        {/* Floating Saarthi Trigger Bar at Bottom */}
        <div className="p-3 bg-white border-t border-slate-200">
          <button
            onClick={openAssistant}
            className="w-full bg-gradient-to-r from-paytm-navy to-paytm-cyan text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-between shadow-md active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Mic className="w-3.5 h-3.5 text-white" />
              </div>
              <span>{language === 'hi' ? 'सारथी से पूछें (Voice / Chat)' : 'Ask Saarthi (Voice / Chat)'}</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-semibold">
              Live Copilot
            </span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SLIDE-UP BOTTOM SHEET: PAYTM SAARTHI COPILOT                   */}
        {/* ------------------------------------------------------------- */}
        {isDrawerOpen && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
            
            {/* Sheet Container */}
            <div className="bg-white rounded-t-3xl max-h-[92%] h-[92%] flex flex-col overflow-hidden shadow-2xl border-t border-slate-200 animate-slideUp">
              
              {/* Sheet Handle & Header */}
              <div className="bg-[#002970] text-white p-3.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-300 p-0.5">
                    <div className="w-full h-full rounded-full bg-[#001944] flex items-center justify-center">
                      <Zap className="w-4 h-4 text-paytm-cyan" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-black leading-tight flex items-center gap-1">
                      Paytm Saarthi <span className="text-[10px] text-cyan-300 font-normal">(सारथी)</span>
                    </h3>
                    <p className="text-[9px] text-slate-300">Autonomous Financial Copilot</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat & Interaction Stream */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f8fafc]">
                
                {/* Message Bubbles */}
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-paytm-navy text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[8px] text-slate-400 mt-0.5 px-1">{m.time}</span>
                  </div>
                ))}

                {/* State 1: Scanning Ledger Loader (WOW Factor for Judges) */}
                {currentStep === 'SCANNING_LEDGER' && (
                  <div className="bg-white rounded-xl p-3 border border-paytm-cyan/40 shadow-md space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-paytm-navy">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-paytm-cyan animate-pulse" />
                        Scanning QR Ledger & Cashflow...
                      </span>
                      <span className="text-paytm-cyan">{scanProgress}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-paytm-navy to-paytm-cyan transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-slate-500 space-y-1 pt-1">
                      <p className={scanProgress >= 25 ? 'text-emerald-700 font-semibold' : ''}>
                        ✔ Scanned 4,520 Paytm QR transactions
                      </p>
                      <p className={scanProgress >= 50 ? 'text-emerald-700 font-semibold' : ''}>
                        ✔ Verified 78.4% unique customer diversity (No circular fraud)
                      </p>
                      <p className={scanProgress >= 75 ? 'text-emerald-700 font-semibold' : ''}>
                        ✔ 178 daily settlements without bounce
                      </p>
                      <p className={scanProgress >= 100 ? 'text-emerald-700 font-bold' : ''}>
                        ✔ Alternative Score: 825/900 (Eligible for Tier-1)
                      </p>
                    </div>
                  </div>
                )}

                {/* State 2: RBI Account Aggregator Consent Modal */}
                {currentStep === 'AA_CONSENT' && (
                  <div className="bg-white rounded-xl p-3 border-2 border-emerald-500/50 shadow-lg space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">RBI Account Aggregator</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        1-Tap Consent
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">
                        Verify Bank Statement: {merchant.bankAccount.bankName} ({merchant.bankAccount.accountMasked})
                      </p>
                      <p className="text-slate-500 text-[9px]">
                        • Purpose: 3-month cash flow verification
                      </p>
                      <p className="text-slate-500 text-[9px]">
                        • Read-only access via RBI AA framework (No passwords or netbanking required)
                      </p>
                    </div>

                    <button
                      onClick={handleConsentApprove}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {language === 'hi' ? 'सहमति दें (Authorize 1-Tap Consent)' : 'Authorize 1-Tap Consent'}
                    </button>
                  </div>
                )}

                {/* State 3: Approved Loan Offer Card */}
                {currentStep === 'OFFER_VIEW' && (
                  <div className="bg-gradient-to-br from-slate-900 to-[#002970] text-white rounded-2xl p-3.5 shadow-xl border border-paytm-cyan/30 space-y-3 animate-scaleUp">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-paytm-cyan/20 text-paytm-cyan border border-paytm-cyan/30 font-bold px-2 py-0.5 rounded-full">
                        Instant Sanction
                      </span>
                      <span className="text-[10px] text-slate-300">
                        Partner: SMFG / Aditya Birla
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-300">Sanctioned Business Loan</p>
                      <p className="text-2xl font-black text-white tracking-tight">
                        ₹50,000
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-white/10 rounded-xl p-2.5 border border-white/10">
                      <div>
                        <span className="text-slate-300">Interest Rate:</span>
                        <p className="font-bold text-white text-xs">12% p.a.</p>
                      </div>
                      <div>
                        <span className="text-slate-300">Tenure:</span>
                        <p className="font-bold text-white text-xs">6 Months</p>
                      </div>
                      <div>
                        <span className="text-slate-300">Monthly EMI:</span>
                        <p className="font-bold text-cyan-300 text-xs">₹8,830 / mo</p>
                      </div>
                      <div>
                        <span className="text-slate-300">Daily Auto-Deduct:</span>
                        <p className="font-bold text-cyan-300 text-xs">₹294 / day</p>
                      </div>
                    </div>

                    <button
                      onClick={handleDisburse}
                      disabled={isDisbursing}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-98 disabled:opacity-50"
                    >
                      {isDisbursing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                          <span>Disbursing to Paytm Wallet...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-slate-950" />
                          <span>{language === 'hi' ? 'तुरंत खाते में ट्रांसफर करें' : 'Disburse ₹50,000 Instantly'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* State 4: Disbursal Success Celebration Card */}
                {currentStep === 'SUCCESS' && disbursedResult && (
                  <div className="bg-emerald-500 text-slate-950 rounded-2xl p-4 shadow-xl space-y-2 text-center animate-scaleUp">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h4 className="text-sm font-black">
                      ₹{disbursedResult.amount.toLocaleString('en-IN')} Disbursed Successfully!
                    </h4>
                    <p className="text-[10px] text-emerald-950 font-medium leading-tight">
                      Credited directly to Paytm Merchant Account.
                      <br />Ref: <span className="font-mono font-bold">{disbursedResult.txnId}</span>
                    </p>

                    <div className="mt-2 bg-slate-950 text-white rounded-xl p-2 text-[10px] flex items-center justify-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-paytm-cyan animate-pulse" />
                      <span>Soundbox: "Paytm par ₹50,000 prapt hue!"</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Voice Orb & Quick Action Chips Drawer Footer */}
              <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                
                {/* 1-Tap Quick Action Chips (Zero-Fail for Voice) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                  {currentStep === 'IDLE' || currentStep === 'LISTENING' ? (
                    <>
                      <button
                        onClick={() => handleSendMessage(language === 'hi' ? 'Mujhe 50,000 ka loan chahiye' : 'I want a 50,000 loan')}
                        className="bg-blue-50 text-paytm-navy border border-blue-200 font-bold px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-blue-100 transition-colors"
                      >
                        🎙️ {language === 'hi' ? '50,000 का लोन चाहिए' : 'Need 50k loan'}
                      </button>
                      <button
                        onClick={() => handleSendMessage(language === 'hi' ? 'Interest aur EMI kitni hogi?' : 'What is the interest & EMI?')}
                        className="bg-slate-100 text-slate-700 border border-slate-200 font-medium px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-slate-200 transition-colors"
                      >
                        ℹ️ {language === 'hi' ? 'ब्याज और EMI दर' : 'Interest & EMI details'}
                      </button>
                    </>
                  ) : currentStep === 'AA_CONSENT' ? (
                    <button
                      onClick={handleConsentApprove}
                      className="bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold px-3 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100"
                    >
                      ✅ {language === 'hi' ? 'हाँ, बैंक स्टेटमेंट वेरीफाई करो' : 'Yes, verify bank statement'}
                    </button>
                  ) : currentStep === 'OFFER_VIEW' ? (
                    <button
                      onClick={handleDisburse}
                      className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap shadow"
                    >
                      🚀 {language === 'hi' ? 'तुरंत डिस्बर्स करें' : 'Confirm Disbursal'}
                    </button>
                  ) : null}
                </div>

                {/* Voice Orb & Mic Action Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={language === 'hi' ? 'सारथी से कुछ भी पूछें...' : 'Ask Saarthi anything...'}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          handleSendMessage(e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-paytm-cyan"
                    />
                  </div>

                  {/* Animated Mic Voice Orb Button */}
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all shadow-md active:scale-95 ${
                      isListening
                        ? 'bg-red-500 animate-pulse ring-4 ring-red-300'
                        : 'bg-gradient-to-tr from-paytm-navy to-paytm-cyan'
                    }`}
                    title="Speak in Hindi / English"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
