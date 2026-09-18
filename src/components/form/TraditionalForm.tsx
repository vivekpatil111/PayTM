import React from 'react';
import { FormPage, ValidationState } from '../../lib/validationEngine';
import { AlertTriangle, CheckCircle2, XCircle, Clock, ChevronRight, Shield } from 'lucide-react';
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

  const totalFields = pages.reduce((acc, p) => acc + p.fields.length, 0);
  const filledFields = pages.reduce((acc, p) => acc + p.fields.filter(f => f.value !== '').length, 0);
  const progressPercent = Math.round((filledFields / totalFields) * 100);
  const isPageComplete = page.fields.every(f => f.value !== '');

  const getValidationIcon = (state: ValidationState) => {
    switch (state) {
      case ValidationState.VERIFIED:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case ValidationState.MISMATCH:
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case ValidationState.ERROR:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case ValidationState.VERIFYING:
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  const getFieldBorderClass = (field: { value: string; state: ValidationState }) => {
    if (!field.value) return 'border-slate-200 focus-within:border-blue-400';
    if (field.state === ValidationState.VERIFIED) return 'border-emerald-300 bg-emerald-50/40';
    if (field.state === ValidationState.MISMATCH) return 'border-amber-300 bg-amber-50/40';
    if (field.state === ValidationState.ERROR) return 'border-red-300 bg-red-50/40';
    return 'border-blue-300 bg-blue-50/20';
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col" style={{ height: '700px' }}>

      {/* ─── Header ───────────────────────────────── */}
      <div className="shrink-0 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-5 pt-5 pb-4">
        {/* Title Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">
              Paytm for Business
            </p>
            <h2 className="text-white text-base font-black leading-tight">
              {translate('Business Loan Application', lang)}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-slate-400 text-[10px]">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-blue-400" />
                <span className="text-blue-300 font-semibold">Secured by RBI AA Framework</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {translate('Estimated Time: 45 Mins', lang).replace('Estimated Time: ', '')}
              </span>
            </div>
          </div>

          {/* Save & Next button — top right when page is complete */}
          {isPageComplete && !isAutofilling && (
            <button
              onClick={onNextPage}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 animate-bounce"
            >
              {translate('Save & Next', lang)}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Page Pills */}
        <div className="flex gap-1 mb-3 flex-wrap">
          {pages.map((p, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                idx < currentPageIndex
                  ? 'bg-emerald-400'
                  : idx === currentPageIndex
                  ? isAutofilling
                    ? 'bg-blue-400 animate-pulse'
                    : 'bg-blue-500'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Progress Row */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">
            {translate('Page', lang)} <span className="text-white font-bold">{currentPageIndex + 1}</span> {translate('of', lang)} {pages.length}
          </span>
          <span className={`font-bold ${progressPercent > 80 ? 'text-emerald-400' : progressPercent > 40 ? 'text-blue-400' : 'text-slate-400'}`}>
            {progressPercent}% {translate('Complete', lang)}
          </span>
        </div>
      </div>

      {/* ─── Body (scrollable fields) ─────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
        {/* Section Title */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {translate(page.title, lang)}
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {/* Fields */}
        {page.fields.map((field) => (
          <div key={field.id} className="group">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 group-focus-within:text-blue-500 transition-colors">
              {translate(field.label, lang)}
            </label>

            <div className={`relative flex items-center rounded-xl border-2 transition-all duration-300 ${getFieldBorderClass(field)}`}>
              <input
                type="text"
                value={field.value}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                placeholder={`${translate(field.label, lang)}...`}
                className="w-full bg-transparent text-sm font-medium text-slate-800 px-3.5 py-2.5 pr-24 rounded-xl placeholder:text-slate-300 focus:outline-none"
              />

              {/* Source tag + validation icon */}
              <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
                {field.source && field.value && (
                  <span className="text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-md">
                    {field.source}
                  </span>
                )}
                {getValidationIcon(field.state)}
              </div>
            </div>

            {field.errorMessage && (
              <p className="text-[10px] text-amber-600 mt-1 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                {field.errorMessage}
              </p>
            )}
          </div>
        ))}

        {/* High drop-off warning (page 5) */}
        {!isAutofilling && currentPageIndex === 4 && (
          <div className="mt-2 bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-700">⚠ High Drop-off Zone</p>
              <p className="text-[10px] text-red-600 mt-0.5">
                60% of users abandon here due to complex document requirements. Saarthi fills this for you automatically.
              </p>
            </div>
          </div>
        )}

        {/* Bottom padding so agent overlay doesn't hide last field */}
        <div className="h-40" />
      </div>
    </div>
  );
};
