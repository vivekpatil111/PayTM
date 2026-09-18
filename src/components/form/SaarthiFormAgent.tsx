import React, { useState, useEffect, useRef } from 'react';
import { TraditionalForm } from './TraditionalForm';
import { INITIAL_FORM_DATA, AUTOFILL_MERCHANTS, FormPage, ValidationState } from '../../lib/validationEngine';
import { translate, SupportedLanguage, LANGUAGES } from '../../lib/translationEngine';
import { Mic, Sparkles, Send, Globe } from 'lucide-react';
import { TraceEvent } from '../../lib/demoEngine';

interface SaarthiFormAgentProps {
  onEvent: (event: TraceEvent) => void;
  onAuditComplete: () => void;
}

export const SaarthiFormAgent: React.FC<SaarthiFormAgentProps> = ({ onEvent, onAuditComplete }) => {
  const [pages, setPages] = useState<FormPage[]>(INITIAL_FORM_DATA);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [currentMerchantKey, setCurrentMerchantKey] = useState<'RAMESH' | 'SUNITA'>('RAMESH');
  
  const [agentMessageKey, setAgentMessageKey] = useState<string>("Hi, I am Saarthi. Since you're logged into Paytm for Business, I can fetch most of your details securely from your ledgers and KYC. Tap the sparkle to start!");
  const [chatInput, setChatInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const autofillRef = useRef<number | null>(null);
  const timeOffsetRef = useRef<number>(1);

  const speak = (textKey: string) => {
    try {
      const synth = window.speechSynthesis;
      if (synth) {
        synth.cancel();
        const translatedText = translate(textKey, lang);
        const utterance = new SpeechSynthesisUtterance(translatedText);
        
        // Find correct locale for voice
        const locale = LANGUAGES.find(l => l.code === lang)?.speechLocale || 'en-IN';
        utterance.lang = locale;
        utterance.rate = 1.0;
        
        // Try to find a specific voice for the locale
        const voices = synth.getVoices();
        // Fallbacks for checking dash vs underscore and partial language matches
        const specificVoice = voices.find(v => 
          v.lang.toLowerCase().replace('_', '-') === locale.toLowerCase() ||
          v.lang.toLowerCase().startsWith(lang.toLowerCase())
        );
        if (specificVoice) {
          utterance.voice = specificVoice;
        }

        synth.speak(utterance);
      }
    } catch (e) {}
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setPages(prev => prev.map((page, idx) => {
      if (idx !== currentPageIndex) return page;
      return {
        ...page,
        fields: page.fields.map(f => f.id === fieldId ? { ...f, value, state: ValidationState.PENDING } : f)
      };
    }));
  };

  const startAutofillForPage = (pageIdx: number) => {
    setIsAutofilling(true);
    const msgKey = `Securely fetching ${INITIAL_FORM_DATA[pageIdx].title} from your Paytm account and KYC records...`;
    
    // Using a static string so that it correctly maps to the translated version in translationEngine
    const speechKey = `Fetching your details securely from your Paytm account.`;
    
    setAgentMessageKey(msgKey);
    speak(speechKey);
    
    if (pageIdx === 0) {
      onEvent({
        id: 'f1', timeOffset: 0, icon: '⚡', message: 'Form autofill sequence initiated...', type: 'header'
      });
    }

    let currentFieldIdx = 0;
    const targetAutofillData = AUTOFILL_MERCHANTS[currentMerchantKey];

    const fillNextField = () => {
      setPages(prevPages => {
        const newPages = [...prevPages];
        const page = newPages[pageIdx];
        
        if (currentFieldIdx >= page.fields.length) {
          return newPages;
        }

        const field = page.fields[currentFieldIdx];
        const targetData = targetAutofillData[field.id];
        
        if (targetData) {
          field.value = targetData.value;
          field.source = targetData.source;
          field.state = targetData.valid;
          field.errorMessage = targetData.error;

          onEvent({
            id: `f_${field.id}_${Date.now()}`, 
            timeOffset: timeOffsetRef.current++, 
            icon: targetData.valid === ValidationState.VERIFIED ? '✓' : '⚠️', 
            message: `${field.label}: ${targetData.valid} (${targetData.source})`, 
            type: targetData.valid === ValidationState.VERIFIED ? 'success' : 'warning'
          });
        } else {
          field.state = ValidationState.VERIFIED;
        }

        return newPages;
      });

      currentFieldIdx++;
      
      if (currentFieldIdx < INITIAL_FORM_DATA[pageIdx].fields.length) {
        autofillRef.current = window.setTimeout(fillNextField, 800);
      } else {
        setIsAutofilling(false);
        setAgentMessageKey("Page complete. You can review, edit manually, or ask me questions. Click Save & Next to proceed.");
        speak("Page filled. Please review and click Next.");
      }
    };

    autofillRef.current = window.setTimeout(fillNextField, 800);
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      const nextIdx = currentPageIndex + 1;
      setCurrentPageIndex(nextIdx);
      startAutofillForPage(nextIdx);
    } else {
      setAgentMessageKey("Form completed with 100% accuracy. Preparing audit report.");
      speak("All details verified. Generating your audit report.");
      onEvent({
        id: 'f_end', timeOffset: timeOffsetRef.current++, icon: '🏁', message: 'Form audit complete.', type: 'header'
      });
      setTimeout(() => {
        onAuditComplete();
      }, 1500);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    onEvent({
      id: `chat_user_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '👤', message: `User: ${chatInput}`, type: 'info'
    });

    let responseKey = "I can help with that. Please verify the information on screen.";
    const query = chatInput.toLowerCase();
    
    if (query.includes('ckyc') || query.includes('pan')) {
      responseKey = "CKYC is fetched automatically using your PAN. I've already pulled the verified record from the registry.";
    } else if (query.includes('address') || query.includes('mismatch')) {
      responseKey = "There is a slight mismatch in your shop address compared to Aadhaar. However, your Paytm QR history validates your location, so I have approved it.";
    } else if (query.includes('data') || query.includes('kaise') || query.includes('fetch') || query.includes('kaise pata')) {
      responseKey = "Since you have an active Paytm for Business account, we already have your verified KYC and transaction history. I am fetching that securely to save your time.";
    } else if (query.includes('dikkat') || query.includes('help') || query.includes('stuck')) {
      responseKey = "Don't worry! Tell me what you need help with. I can fill the fields for you based on your Paytm history.";
    }

    setChatInput("");
    setAgentMessageKey(responseKey);
    speak(responseKey);

    onEvent({
      id: `chat_agent_${Date.now()}`, timeOffset: timeOffsetRef.current++, icon: '🤖', message: `Saarthi: ${translate(responseKey, lang)}`, type: 'success'
    });
  };

  const toggleListen = () => {
    if (!isListening) {
      setIsListening(true);
      setAgentMessageKey("Listening... Speak your question.");
      setTimeout(() => {
        setChatInput("Mujhe yaha dikkat aa rahi hai, kaise fill karu?");
        setIsListening(false);
      }, 2500);
    }
  };

  useEffect(() => {
    return () => {
      if (autofillRef.current) clearTimeout(autofillRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      
      {/* Top Language Selector */}
      <div className="absolute -top-14 right-0 z-50 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-slate-200">
        <Globe className="w-4 h-4 text-paytm-cyan" />
        <select 
          value={lang}
          onChange={(e) => setLang(e.target.value as SupportedLanguage)}
          className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Underlying Traditional Form */}
      <TraditionalForm 
        pages={pages} 
        currentPageIndex={currentPageIndex} 
        isAutofilling={isAutofilling}
        onNextPage={handleNextPage}
        onFieldChange={handleFieldChange}
        lang={lang}
      />

      {/* Floating AI Agent Overlay with Chat */}
      <div className={`absolute bottom-4 left-4 right-4 bg-slate-900 rounded-2xl shadow-2xl border ${isAutofilling ? 'border-paytm-cyan' : 'border-slate-700'} transition-all duration-500 overflow-hidden flex flex-col`}>
        
        {/* Top Agent Status Bar */}
        <div className="p-4 flex items-start gap-3 bg-slate-800/50">
          <div className="relative shrink-0 mt-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-paytm-cyan shadow-lg z-10 relative ${isAutofilling || isListening ? 'animate-pulse' : ''}`}>
              {isListening ? <Mic className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
            </div>
            {(isAutofilling || isListening) && (
              <div className="absolute inset-0 bg-paytm-cyan rounded-full animate-ping opacity-20" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
              Saarthi Agent
              {isAutofilling && <span className="bg-paytm-cyan text-slate-900 text-[9px] px-1.5 py-0.5 rounded-full font-bold">AUTO-FILLING</span>}
              {isListening && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">LISTENING</span>}
            </h4>
            <p className="text-slate-300 text-xs mt-1 leading-snug">
              {translate(agentMessageKey, lang)}
            </p>
          </div>

          {!isAutofilling && currentPageIndex === 0 && (
            <button 
              onClick={() => startAutofillForPage(0)}
              className="shrink-0 w-8 h-8 rounded-full bg-paytm-cyan/20 flex items-center justify-center hover:bg-paytm-cyan/40 transition-colors border border-paytm-cyan/50"
              title="Start Autofill"
            >
              <Sparkles className="w-4 h-4 text-paytm-cyan" />
            </button>
          )}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleChatSubmit} className="p-2 bg-slate-900 border-t border-slate-700 flex items-center gap-2">
          <button 
            type="button"
            onClick={toggleListen}
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question or say 'Help'..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-paytm-cyan transition-colors"
          />
          <button 
            type="submit"
            disabled={!chatInput.trim()}
            className="shrink-0 w-8 h-8 rounded-full bg-slate-800 text-paytm-cyan flex items-center justify-center hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>

      </div>
    </div>
  );
};
