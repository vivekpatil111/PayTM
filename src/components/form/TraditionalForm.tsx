import React from 'react';
import { FormPage, FormField, ValidationState } from '../../lib/validationEngine';
import { AlertTriangle, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';
import { translate, SupportedLanguage } from '../../lib/translationEngine';

interface TraditionalFormProps {
  pages: FormPage[];
  currentPageIndex: number;
  isAutofilling: boolean;
  onNextPage: () => void;
  onFieldChange: (fieldId: string, value: string) => void;
  lang: SupportedLanguage;
}

export const TraditionalForm: React.FC<TraditionalFormProps> = ({
  pages,
  currentPageIndex,
  isAutofilling,
  onNextPage,
  onFieldChange,
  lang
}) => {
  const page = pages[currentPageIndex];
  
  // Progress calculation
  const totalFields = pages.reduce((acc, p) => acc + p.fields.length, 0);
  const filledFields = pages.reduce((acc, p) => {
    return acc + p.fields.filter(f => f.value !== '').length;
  }, 0);
  const progressPercent = Math.round((filledFields / totalFields) * 100);

  // Check if current page is completely filled
  const isPageComplete = page.fields.every(f => f.value !== '');

  const getValidationIcon = (state: ValidationState) => {
    switch(state) {
      case ValidationState.VERIFIED: return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case ValidationState.MISMATCH: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case ValidationState.ERROR: return <XCircle className="w-4 h-4 text-red-500" />;
      case ValidationState.VERIFYING: return <div className="w-4 h-4 border-2 border-paytm-cyan border-t-transparent rounded-full animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[700px] relative">
      
      {/* Form Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 shrink-0 relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-black text-slate-800">{translate("Business Loan Application", lang)}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span>{translate("Page", lang)} {currentPageIndex + 1} {translate("of", lang)} {pages.length}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {translate("Estimated Time: 45 Mins", lang).replace("Estimated Time: ", "")}
              </span>
            </div>
          </div>
          
          {/* Next Button Appears at Top Right when page is complete */}
          <div className="h-8 flex items-center">
            {isPageComplete && !isAutofilling && (
              <button 
                onClick={onNextPage}
                className="px-3 py-1.5 flex items-center gap-1 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md animate-bounce"
              >
                {translate("Save & Next", lang)} <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
          <div 
            className={`h-full transition-all duration-300 ${isAutofilling ? 'bg-paytm-cyan' : 'bg-slate-800'}`} 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* Form Body */}
      <div className="p-5 flex-1 overflow-y-auto pb-40 custom-scrollbar">
        <h3 className="font-bold text-slate-700 mb-4">{translate(page.title, lang)}</h3>
        
        <div className="space-y-4">
          {page.fields.map((field) => (
            <div key={field.id} className="relative">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {translate(field.label, lang)}
              </label>
              
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => onFieldChange(field.id, e.target.value)}
                  placeholder={`${translate(field.label, lang)}...`}
                  className={`w-full text-sm font-medium border rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:border-paytm-cyan focus:ring-1 focus:ring-paytm-cyan ${
                    field.value ? 'bg-slate-50 text-slate-800 border-slate-300' : 'bg-white border-slate-200 text-slate-400'
                  } ${field.state === ValidationState.MISMATCH ? 'border-yellow-400 bg-yellow-50' : ''}`}
                />
                
                {/* Validation Status Indicator */}
                <div className="absolute right-3 flex items-center gap-2 pointer-events-none">
                  {field.source && field.value && (
                    <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                      {field.source}
                    </span>
                  )}
                  {getValidationIcon(field.state)}
                </div>
              </div>
              
              {/* Error Message */}
              {field.errorMessage && (
                <p className="text-[10px] text-yellow-600 mt-1 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {field.errorMessage}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Drop-off Simulation warning */}
        {!isAutofilling && currentPageIndex === 4 && (
          <div className="mt-6 bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-2 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-700">High Drop-off Zone</p>
              <p className="text-[10px] text-red-600 mt-0.5">60% of users abandon the application at this stage due to complex documentation requirements.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
