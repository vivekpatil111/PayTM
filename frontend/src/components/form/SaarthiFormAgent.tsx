import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TraditionalForm } from './TraditionalForm';
import { INITIAL_FORM_DATA, AUTOFILL_MERCHANTS, FormPage, ValidationState } from '../../lib/validationEngine';
import { translate, SupportedLanguage, LANGUAGES } from '../../lib/translationEngine';
import { Mic, MicOff, Sparkles, Send, Globe, BrainCircuit, CheckCircle2, AlertCircle, RefreshCw, XCircle, ArrowRight, Play, Check, ShieldCheck, FileCheck2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraceEvent } from '../../lib/demoEngine';
import { MultiAgentTrace } from '../agent/MultiAgentTrace';

interface SaarthiFormAgentProps {
  onEvent: (event: TraceEvent) => void;
  onAuditComplete: () => void;
}

export const SaarthiFormAgent: React.FC<SaarthiFormAgentProps> = ({ onEvent, onAuditComplete }) => {
  const [pages, setPages] = useState<FormPage[]>(INITIAL_FORM_DATA);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [currentMerchantKey] = useState<'RAMESH' | 'SUNITA'>('RAMESH');

  const [agentMessageKey, setAgentMessageKey] = useState<string>(
    "Hi, I am Saarthi. Since you're logged into Paytm for Business, I can fetch most of your details securely from your ledgers and KYC. Tap the sparkle to start!"
  );
  const [chatInput, setChatInput] = useState('');
  const [traceIntent, setTraceIntent] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const autofillRef = useRef<number | null>(null);
  const timeOffsetRef = useRef<number>(1);

  // ── Speech synthesis ────────────────────────────────────────────────────────
  const speak = (textKey: string) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const translatedText = translate(textKey, lang);
      const utterance = new SpeechSynthesisUtterance(translatedText);
      const locale = LANGUAGES.find(l => l.code === lang)?.speechLocale || 'en-IN';
      utterance.lang = locale;
      utterance.rate = 1.0;
      const voices = synth.getVoices();
      const specificVoice = voices.find(
        v => v.lang.toLowerCase().replace('_', '-') === locale.toLowerCase() || v.lang.toLowerCase().startsWith(lang.toLowerCase())
      );
      if (specificVoice) utterance.voice = specificVoice;
      synth.speak(utterance);
    } catch (_) {}
  };

  // ── Web Speech API — SpeechRecognition ─────────────────────────────────────
  // Detect browser support on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSpeechSupported(!!SpeechRecognition);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    // ── Real STT path ────────────────────────────────────────────────────────
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      const locale = LANGUAGES.find(l => l.code === lang)?.speechLocale || 'en-IN';
      recognition.lang = locale;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setAgentMessageKey('Listening... Speak your question.');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
        onEvent({
          id: `voice_stt_${Date.now()}`,
          timeOffset: timeOffsetRef.current++,
          icon: '🎙️',
          message: `STT (${locale}): "${transcript}"`,
          type: 'info'
        });
        setAgentMessageKey('Got it! Sending your query...');
      };

      recognition.onerror = (event: any) => {
        console.warn('[STT] Error:', event.error);
        setIsListening(false);
        setAgentMessageKey('Could not understand. Please type your query.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      return;
    }

    // ── Simulated fallback (non-supporting browsers) ──────────────────────────
    setIsListening(true);
    setAgentMessageKey('Listening... Speak your question.');
    setTimeout(() => {
      setChatInput('Mujhe yaha dikkat aa rahi hai, kaise fill karu?');
      setIsListening(false);
    }, 2500);
  }, [lang, onEvent]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setPages(prev =>
      prev.map((page, idx) => {
        if (idx !== currentPageIndex) return page;
        return {
          ...page,
          fields: page.fields.map(f =>
            f.id === fieldId ? { ...f, value, state: ValidationState.PENDING } : f
          )
        };
      })
    );
  };

  const handleFieldStateChange = (fieldId: string, state: ValidationState) => {
    setPages(prev =>
      prev.map((page, idx) => {
        if (idx !== currentPageIndex) return page;
        return {
          ...page,
          fields: page.fields.map(f =>
            f.id === fieldId ? { ...f, state } : f
          )
        };
      })
    );
  };

  const startAutofillForPage = (pageIdx: number) => {
    setIsAutofilling(true);
    setAgentMessageKey(`Securely fetching ${INITIAL_FORM_DATA[pageIdx].title} from your Paytm account and KYC records...`);
    speak('Fetching your details securely from your Paytm account.');

    if (pageIdx === 0) {
      onEvent({ id: 'f1', timeOffset: 0, icon: '⚡', message: 'Form autofill sequence initiated...', type: 'header' });
    }

    let currentFieldIdx = 0;
    const targetAutofillData = AUTOFILL_MERCHANTS[currentMerchantKey];

    const fillNextField = () => {
      if (currentFieldIdx >= INITIAL_FORM_DATA[pageIdx].fields.length) return;
      
      const field = INITIAL_FORM_DATA[pageIdx].fields[currentFieldIdx];
      const targetData = targetAutofillData[field.id];

      setPages(prevPages => {
        const newPages = [...prevPages];
        // Deep copy the page and fields to avoid mutating state directly
        const newPage = { ...newPages[pageIdx] };
        newPage.fields = [...newPage.fields];
        const newField = { ...newPage.fields[currentFieldIdx] };

        if (targetData) {
          newField.value = targetData.value;
          newField.source = targetData.source;
          newField.state = targetData.valid;
          newField.errorMessage = targetData.error;
        } else {
          newField.state = ValidationState.VERIFIED;
        }
        
        newPage.fields[currentFieldIdx] = newField;
        newPages[pageIdx] = newPage;
        return newPages;
      });

      if (targetData) {
        onEvent({
          id: `f_${field.id}_${Date.now()}`,
          timeOffset: timeOffsetRef.current++,
          icon: targetData.valid === ValidationState.VERIFIED ? '✓' : '⚠️',
          message: `${field.label}: ${targetData.valid} (${targetData.source})`,
          type: targetData.valid === ValidationState.VERIFIED ? 'success' : 'warning'
        });
      }

      currentFieldIdx++;
      if (currentFieldIdx < INITIAL_FORM_DATA[pageIdx].fields.length) {
        autofillRef.current = window.setTimeout(fillNextField, 700);
      } else {
        setIsAutofilling(false);
        setAgentMessageKey('Page complete. You can review, edit manually, or ask me questions. Click Save & Next to proceed.');
        speak('Page filled. Please review and click Next.');
      }
    };

    autofillRef.current = window.setTimeout(fillNextField, 600);
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      const nextIdx = currentPageIndex + 1;
      setCurrentPageIndex(nextIdx);
      startAutofillForPage(nextIdx);
    } else {
      setAgentMessageKey('Form completed with 100% accuracy. Preparing audit report.');
      speak('All details verified. Generating your audit report.');
      onEvent({ id: 'f_end', timeOffset: timeOffsetRef.current++, icon: '🏁', message: 'Form audit complete.', type: 'header' });
      setTimeout(() => onAuditComplete(), 1500);
    }
  };

  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsChatLoading(true);

    onEvent({
      id: `chat_user_${Date.now()}`,
      timeOffset: timeOffsetRef.current++,
      icon: '👤',
      message: `User: ${userMessage}`,
      type: 'info'
    });

    setAgentMessageKey('Thinking...');

    try {
      // Call backend with full form context for accurate AI response
      const currentPageData = pages[currentPageIndex];
      const res = await fetch('http://localhost:5001/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language: lang === 'en' ? 'en' : 'hi',
          currentPage: currentPageData.title,
          formFields: currentPageData.fields.map(f => ({
            label: f.label,
            value: f.value,
            state: f.state,
            source: f.source || ''
          }))
        })
      });

      const data = await res.json();
      const reply = data.reply || "I'm here to help. Please try again.";

      // Emit Privacy Traces if they exist
      if (data.privacyTrace && Array.isArray(data.privacyTrace)) {
        data.privacyTrace.forEach((trace: any, idx: number) => {
          let icon = '🔒';
          if (trace.action === 'PRIVACY_CONSENT') icon = '🔐';
          if (trace.action === 'PRIVACY_ZDR') icon = '🛡️';

          onEvent({
            id: `privacy_${Date.now()}_${idx}`,
            timeOffset: timeOffsetRef.current++,
            icon: icon,
            message: `${trace.details}`,
            type: 'success'
          });
        });
      }

      setAgentMessageKey(reply);
      setTraceIntent(data.source || 'FALLBACK');
      speak(reply);

      onEvent({
        id: `chat_agent_${Date.now()}`,
        timeOffset: timeOffsetRef.current++,
        icon: '🤖',
        message: `Saarthi: ${reply}`,
        type: 'agent_trace',
        traceIntent: data.source || 'FALLBACK'
      });
    } catch {
      const fallback = lang === 'en'
        ? "I'm here to help Ramesh ji! Ask me about the loan offer, form fields, or your eligibility."
        : "Ramesh ji, main aapki madad ke liye hoon! Loan, form, ya eligibility ke baare mein poochho.";
      setAgentMessageKey(fallback);
      setTraceIntent('FALLBACK');
      speak(fallback);
      
      onEvent({
        id: `chat_agent_${Date.now()}`,
        timeOffset: timeOffsetRef.current++,
        icon: '🤖',
        message: `Saarthi: ${fallback}`,
        type: 'agent_trace',
        traceIntent: 'FALLBACK'
      });
    } finally {
      setIsChatLoading(false);
    }
  };



  useEffect(() => {
    return () => {
      if (autofillRef.current) clearTimeout(autofillRef.current);
      window.speechSynthesis?.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">

      {/* ── Language Selector (top right, above form) ── */}
      <div className="absolute -top-12 right-0 z-50 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-slate-200">
        <Globe className="w-3.5 h-3.5 text-blue-500" />
        <select
          value={lang}
          onChange={e => setLang(e.target.value as SupportedLanguage)}
          className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* ── Form ── */}
      <div className="absolute inset-x-0 inset-y-0 pb-[100px] pointer-events-auto">
        <TraditionalForm
          pages={pages}
          currentPageIndex={currentPageIndex}
          isAutofilling={isAutofilling}
          onNextPage={handleNextPage}
          onFieldChange={handleFieldChange}
          onFieldStateChange={handleFieldStateChange}
          lang={lang}
        />
      </div>

      {/* ── Floating Saarthi Agent Panel ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 rounded-b-2xl overflow-hidden
          bg-gradient-to-b from-slate-900 to-slate-950
          border-t ${isAutofilling ? 'border-blue-500' : 'border-slate-700'}
          shadow-xl transition-all duration-500`}
      >
        {/* Animated top glow when autofilling */}
        {isAutofilling && (
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
        )}

        {/* Agent Message Row */}
        <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative shrink-0 mt-0.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center z-10 relative
                  bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-lg shadow-blue-500/30
                  ${isAutofilling || isListening ? 'animate-pulse' : ''}`}
              >
                {isListening
                  ? <Mic className="w-4 h-4 text-white" />
                  : <Sparkles className="w-4 h-4 text-white" />
                }
              </div>
              {(isAutofilling || isListening) && (
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Saarthi Agent</span>
                {isAutofilling && (
                  <span className="bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                    AUTO-FILLING
                  </span>
                )}
                {isListening && (
                  <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                    LISTENING
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-xs leading-snug line-clamp-2">
                {translate(agentMessageKey, lang)}
              </p>
            </div>

            {/* Sparkle trigger button (only on page 0 before start) */}
            {!isAutofilling && currentPageIndex === 0 && (
              <button
                onClick={() => startAutofillForPage(0)}
                title="Start Autofill"
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/40
                  transition-colors"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
              </button>
            )}
          </div>
          
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleChatSubmit} className="px-3 pb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListen}
            title={isSpeechSupported ? 'Voice input (real STT)' : 'Voice input (simulated fallback)'}
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors
              ${isListening ? 'bg-red-500/30 text-red-400 border border-red-400/50 animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>

          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder={translate('Ask a question or say Help...', lang)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white
              placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
              transition-all"
          />

          <button
            type="submit"
            disabled={!chatInput.trim() || isChatLoading}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors shadow-md shadow-blue-500/20"
          >
            {isChatLoading
              ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send className="w-3.5 h-3.5" />
            }
          </button>
        </form>
      </div>
    </div>
  );
};
