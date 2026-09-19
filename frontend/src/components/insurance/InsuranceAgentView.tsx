import React, { useState, useEffect, useRef } from 'react';
import { CategorySelector } from './CategorySelector';
import { QuoteCard } from './QuoteCard';
import { CarQuoteCard } from './CarQuoteCard';
import { insuranceQuestions } from '../../lib/insuranceQuestions';
import { calculatePremium } from '../../lib/premiumCalculator';
import { matchPartner } from '../../lib/partnerMatcher';
import { DEFAULT_PREFILLED_KYC } from '../../lib/paytmInsuranceData';
import { TraceEvent } from '../../lib/demoEngine';
import { translate, LANGUAGES, SupportedLanguage } from '../../lib/translationEngine';
import { Send, Sparkles, CheckCircle, Download, MessageSquare, Globe } from 'lucide-react';
import { mockVerifyKyc, validateAadhaar, validatePAN, validateMobile } from '../../lib/kycValidation';

interface InsuranceAgentViewProps {
  onEvent: (event: TraceEvent) => void;
  preselectedCategory?: string | null;
}

export const InsuranceAgentView: React.FC<InsuranceAgentViewProps> = ({ onEvent, preselectedCategory }) => {
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [step, setStep] = useState<'category' | 'chat' | 'quote' | 'success'>('category');
  const [category, setCategory] = useState<string>('');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'agent'|'user', text: string}[]>([]);

  const [quoteData, setQuoteData] = useState<any>(null);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [issuedPolicy, setIssuedPolicy] = useState<any>(null);
  const [kycErrors, setKycErrors] = useState<Record<string, string>>({});
  const [kycVerifying, setKycVerifying] = useState(false);

  const timeOffsetRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  const t = (text: string) => translate(text, lang);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (preselectedCategory) {
      handleCategorySelect(preselectedCategory);
    }
  }, [preselectedCategory]);

  // Re-seed greeting when language changes mid-chat
  useEffect(() => {
    if (step === 'chat' && category && messages.length > 0) {
      const greeting = category === 'car'
        ? t("Namaste Ramesh ji! 🚗 Apni car insurance ko 2 minutes mein renew karein aur challans se bachein.")
        : t("Namaste Ramesh ji! 🙏 Main aapka Paytm Saarthi Insurance Copilot hoon. Aapke aur parivaar ke liye best curated health protection plan tayyar karte hain.");
      const firstQ = t(insuranceQuestions[category][0].question);
      setMessages([
        { role: 'agent', text: greeting },
        { role: 'agent', text: firstQ },
      ]);
      setCurrentQuestionIndex(0);
      setAnswers({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // ── category select ──────────────────────────────────────────────────────
  const handleCategorySelect = (selectedId: string) => {
    setCategory(selectedId);
    setStep('chat');
    setCurrentQuestionIndex(0);
    setAnswers({});

    onEvent({
      id: `ins_intent_${Date.now()}`,
      timeOffset: timeOffsetRef.current++,
      icon: selectedId === 'car' ? '🚗' : '🧠',
      message: `Intent: ${selectedId.toUpperCase()}_INSURANCE`,
      type: 'header'
    });

    onEvent({
      id: `ins_kyc_sync_${Date.now()}`,
      timeOffset: timeOffsetRef.current++,
      icon: '🆔',
      message: `Syncing Paytm Profile: ${DEFAULT_PREFILLED_KYC.fullName} (${DEFAULT_PREFILLED_KYC.mobileNumber})`,
      type: 'info'
    });

    const greeting = selectedId === 'car'
      ? t("Namaste Ramesh ji! 🚗 Apni car insurance ko 2 minutes mein renew karein aur challans se bachein.")
      : t("Namaste Ramesh ji! 🙏 Main aapka Paytm Saarthi Insurance Copilot hoon. Aapke aur parivaar ke liye best curated health protection plan tayyar karte hain.");

    const firstQ = t(insuranceQuestions[selectedId][0].question);

    setMessages([
      { role: 'agent', text: greeting },
      { role: 'agent', text: firstQ }
    ]);
  };

  // ── answer submission ─────────────────────────────────────────────────────
  const submitAnswer = (userAns: string) => {
    const newMessages = [...messages, { role: 'user' as const, text: userAns }];
    setMessages(newMessages);

    const questions = insuranceQuestions[category];
    const currentQ = questions[currentQuestionIndex];

    const newAnswers = { ...answers, [currentQ.id]: userAns };
    setAnswers(newAnswers);

    onEvent({
      id: `ins_q_${currentQuestionIndex}_${Date.now()}`,
      timeOffset: timeOffsetRef.current++,
      icon: '💬',
      message: `${currentQ.id} → ${userAns}`,
      type: 'info'
    });

    if (currentQ.id === 'vehicle_number') {
      onEvent({
        id: `ins_vahan_${Date.now()}`,
        timeOffset: timeOffsetRef.current++,
        icon: '🚘',
        message: `VAHAN Database Lookup: ${userAns} → Maruti Zen Estilo (Petrol 1.0 VXI ABS, 2010)`,
        type: 'header'
      });
    }

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        const nextQ = t(questions[currentQuestionIndex + 1].question);
        setMessages([...newMessages, { role: 'agent', text: nextQ }]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    } else {
      setTimeout(() => generateQuote(newAnswers), 700);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const ans = chatInput.trim();
    setChatInput('');
    submitAnswer(ans);
  };

  // ── quote generation ──────────────────────────────────────────────────────
  const generateQuote = (finalAnswers: any) => {
    const quote = calculatePremium(category, finalAnswers);
    const partner = matchPartner(category, quote.annualPremium, quote.coverage);

    setQuoteData(quote);
    setPartnerData(partner);
    setStep('quote');

    if (category === 'car') {
      onEvent({ id: `ins_vahan_fit_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '📋', message: `Parivahan RTO: Fitness & Registration Valid for MH 14 CC 7734`, type: 'info' });
      onEvent({ id: `ins_car_plan_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '🛡️', message: `Matched Tata AIG Comprehensive (IDV ₹1.26 Lakhs) @ ₹3,224`, type: 'success' });
      onEvent({ id: `ins_car_pa_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '⚡', message: `Included ₹15 Lakh Personal Accident Cover (+₹354, Mandatory by Law)`, type: 'info' });
      onEvent({ id: `ins_car_total_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '💰', message: `Total Price with GST: ₹4,158 | Avoids ₹2,000 Traffic Challan`, type: 'header' });
    } else {
      onEvent({ id: `ins_eval_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '🏥', message: `Scanning 458 cashless network hospitals in Pune (411014)...`, type: 'info' });
      onEvent({ id: `ins_quote_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '📈', message: `Recommended Cover: ₹10 Lakh | Premium: ₹804/month`, type: 'success' });
      onEvent({ id: `ins_partner_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '🤝', message: `Top Insurer Matched: ${partner.name} (${partner.claimSettlement} Claim Settlement Rate)`, type: 'header' });
    }
  };

  // ── buy / issue (with KYC validation) ────────────────────────────────────
  const handleBuy = async (planDetails?: any) => {
    setKycErrors({});
    setKycVerifying(true);

    // --- Format-level validation (instant) ---
    const kyc = DEFAULT_PREFILLED_KYC;
    const errors: Record<string, string> = {};

    const aadhaarResult = validateAadhaar(kyc.aadhaarNumber || '');
    if (!aadhaarResult.valid) errors.aadhaar = aadhaarResult.error!;

    const panResult = validatePAN(kyc.pan || '');
    if (!panResult.valid) errors.pan = panResult.error!;

    const mobileResult = validateMobile(kyc.mobileNumber || '');
    if (!mobileResult.valid) errors.mobile = mobileResult.error!;

    if (Object.keys(errors).length > 0) {
      setKycErrors(errors);
      setKycVerifying(false);
      onEvent({
        id: `kyc_fail_${Date.now()}`,
        timeOffset: timeOffsetRef.current++,
        icon: '❌',
        message: `KYC Validation Failed: ${Object.values(errors).join(' | ')}`,
        type: 'warning'
      });
      return;
    }

    // --- Mock verification delay (simulates real API roundtrip) ---
    onEvent({
      id: `kyc_verify_start_${Date.now()}`,
      timeOffset: timeOffsetRef.current++,
      icon: '🔐',
      message: 'Verifying KYC via Aadhaar UIDAI + PAN NSDL APIs...',
      type: 'info'
    });

    const aadhaarVerify = await mockVerifyKyc('aadhaar', kyc.aadhaarNumber || '');
    if (!aadhaarVerify.verified) {
      setKycErrors({ aadhaar: aadhaarVerify.error || 'Aadhaar verification failed' });
      setKycVerifying(false);
      return;
    }

    setKycVerifying(false);

    onEvent({ id: `ins_kyc_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '✅', message: `KYC verified via Paytm ID: ${DEFAULT_PREFILLED_KYC.mobileNumber} | Aadhaar: ${aadhaarVerify.maskedValue}`, type: 'success' });
    onEvent({ id: `ins_mandate_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '⚡', message: `Configuring UPI Autopay mandate: ₹${planDetails?.premium || quoteData.monthlyPremium || 804}/month`, type: 'info' });

    try {
      const res = await fetch('http://localhost:5000/api/insurance/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: 'MERCH_PUNE_411014',
          category,
          coverage: planDetails?.coverAmount || quoteData.coverage,
          coverLabel: planDetails?.coverLabel || '₹10 Lakh',
          premium: planDetails?.premium || quoteData.monthlyPremium || 804,
          billingCycle: planDetails?.billingCycle || 'monthly',
          partner: planDetails?.partner || partnerData.name,
          answers,
          kyc: DEFAULT_PREFILLED_KYC
        })
      });
      const data = await res.json();
      setIssuedPolicy(data);
      setStep('success');
      onEvent({ id: `ins_issue_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '📜', message: `Policy issued: ${data.policy_id}`, type: 'header' });
      onEvent({ id: `ins_webhook_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '🔗', message: `n8n Webhook: WhatsApp confirmation dispatched to ${DEFAULT_PREFILLED_KYC.mobileNumber} ✅`, type: 'success' });
    } catch (e) {
      const fallbackPolicyId = `PTM-INS-${category.toUpperCase()}-${Date.now().toString().slice(-6)}`;
      setIssuedPolicy({ policy_id: fallbackPolicyId, mandate_id: `UPI-MANDATE-${Date.now().toString().slice(-8)}`, pdf_url: `https://paytm.com/insurance/download/${fallbackPolicyId}.pdf`, phone: DEFAULT_PREFILLED_KYC.mobileNumber });
      setStep('success');
      onEvent({ id: `ins_issue_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '📜', message: `Policy issued: ${fallbackPolicyId}`, type: 'header' });
    }
  };

  const currentQuestions = insuranceQuestions[category] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[550px]">

      {/* ── Header ── */}
      <div className="bg-slate-900 p-4 shrink-0 border-b border-slate-700 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm min-w-0">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="truncate">{t("Paytm Saarthi Insurance Copilot")}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* ── Language Switcher ── */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(v => !v)}
              className="flex items-center gap-1.5 text-xs text-sky-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 transition-all font-medium"
            >
              <Globe className="w-3 h-3" />
              {LANGUAGES.find(l => l.code === lang)?.nativeLabel}
            </button>

            {showLangMenu && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 min-w-[160px]">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-sky-50 transition-colors ${lang === l.code ? 'text-sky-700 font-bold bg-sky-50' : 'text-slate-700'}`}
                    >
                      <span>{l.nativeLabel}</span>
                      <span className="text-slate-400 text-[10px]">{l.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {step !== 'category' && !preselectedCategory && (
            <button
              onClick={() => { setStep('category'); setCurrentQuestionIndex(0); setAnswers({}); setMessages([]); }}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              {t("Change Category")}
            </button>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col">

        {/* CATEGORY SELECTION */}
        {step === 'category' && (
          <div className="m-auto w-full">
            <CategorySelector onSelect={handleCategorySelect} lang={lang} />
          </div>
        )}

        {/* CHAT */}
        {step === 'chat' && (
          <div className="flex flex-col h-full justify-between">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick-Select Option Chips */}
            {currentQuestion?.options && (
              <div className="mb-3 space-y-1.5 shrink-0">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-left">
                  {t("Quick Select")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => submitAnswer(t(opt))}
                      className="px-2.5 py-1.5 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-xl text-xs font-medium border border-slate-200 hover:border-sky-300 shadow-xs transition-all active:scale-95 text-left"
                    >
                      {t(opt)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Text Input */}
            <form onSubmit={handleChatSubmit} className="flex gap-2 shrink-0 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={t("Type your response...")}
                className="flex-1 bg-transparent border-none outline-none text-xs px-2 text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-40 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* QUOTE */}
        {step === 'quote' && quoteData && partnerData && (
          <div className="m-auto w-full space-y-2">

            {/* KYC verifying overlay */}
            {kycVerifying && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5 text-xs text-blue-700 font-medium">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                Verifying Aadhaar UIDAI + PAN NSDL... please wait
              </div>
            )}

            {/* KYC validation errors */}
            {!kycVerifying && Object.keys(kycErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700 space-y-1">
                <p className="font-bold">⚠️ KYC Validation Failed:</p>
                {Object.entries(kycErrors).map(([field, err]) => (
                  <p key={field} className="capitalize">• <span className="font-semibold">{field}:</span> {err}</p>
                ))}
              </div>
            )}

            {category === 'car' ? (
              <CarQuoteCard quote={quoteData} partner={partnerData} onBuy={handleBuy} lang={lang} />
            ) : (
              <QuoteCard category={category} quote={quoteData} partner={partnerData} onBuy={handleBuy} lang={lang} />
            )}
          </div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <div className="m-auto text-center space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>

            <div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {t("Instant Issuance Active")}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                {t(category === 'car' ? 'Car Insurance Issued!' : 'Health Policy Issued!')}
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                {t(category === 'car'
                  ? 'Policy active on VAHAN & mParivahan. You are 100% protected against traffic challans.'
                  : 'Policy Document & Digital Health Card has been issued under IRDAI guidelines.')}
              </p>
            </div>

            {/* Policy Details Card */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[11px]">{t("Policy Number")}</span>
                <span className="font-mono font-bold text-slate-900">{issuedPolicy?.policy_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[11px]">{t("Insurer")}</span>
                <span className="font-semibold text-slate-900">
                  {issuedPolicy?.partner || partnerData?.name || (category === 'car' ? 'Tata AIG' : 'ICICI Lombard')}
                </span>
              </div>
              {category === 'car' ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">{t("Insured Vehicle")}</span>
                    <span className="font-semibold text-slate-900">Maruti Zen Estilo (MH 14 CC 7734)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">{t("Personal Accident")}</span>
                    <span className="font-semibold text-emerald-600">{t("₹15 Lakh Active")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">{t("Challan Status")}</span>
                    <span className="font-bold text-emerald-600">{t("Protected (0 Challans)")}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">{t("UPI Autopay Mandate")}</span>
                    <span className="font-mono text-[11px] text-emerald-600 font-semibold">{issuedPolicy?.mandate_id || 'ACTIVE'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">{t("Cashless Coverage")}</span>
                    <span className="font-bold text-blue-600">{t("458 Hospitals (Pune)")}</span>
                  </div>
                </>
              )}
            </div>

            {/* WhatsApp Confirmation */}
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-left text-xs border border-emerald-100">
              <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t("PDF Policy document sent via WhatsApp to")} <b>+91 {DEFAULT_PREFILLED_KYC.mobileNumber}</b></span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert(`Downloading Policy PDF (${issuedPolicy?.policy_id})...`); }}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("Download Policy PDF")}</span>
              </a>

              <button
                onClick={() => { setStep('category'); setCurrentQuestionIndex(0); setAnswers({}); setMessages([]); }}
                className="w-full py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs transition-colors"
              >
                {t("Explore Another Insurance")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
