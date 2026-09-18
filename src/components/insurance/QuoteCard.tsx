import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  HeartHandshake, 
  Sparkles, 
  ChevronRight, 
  X, 
  Zap, 
  MapPin, 
  PhoneCall, 
  UserCheck 
} from 'lucide-react';
import { 
  PAYTM_COVER_TIERS, 
  NETWORK_HOSPITALS_PUNE, 
  DEFAULT_PREFILLED_KYC, 
  CoverTier 
} from '../../lib/paytmInsuranceData';
import { translate, SupportedLanguage } from '../../lib/translationEngine';

interface QuoteCardProps {
  category: string;
  quote: {
    coverage: number;
    monthlyPremium?: number;
    annualPremium: number;
    dailyPremium: string;
    stabilityFactor: number;
    cashlessHospitalsCount?: number;
  };
  partner: {
    name: string;
    rating: number;
    claimSettlement: string;
    claimsSettled?: string;
    lifeInsured?: string;
    subtitle?: string;
  };
  onBuy: (planDetails?: any) => void;
  lang?: SupportedLanguage;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ category, quote, partner, onBuy, lang = 'en' }) => {
  const t = (text: string) => translate(text, lang);
  // Find initial tier
  const initialTier = PAYTM_COVER_TIERS.find(tier => tier.amount === quote.coverage) || PAYTM_COVER_TIERS[1];
  
  const [selectedTier, setSelectedTier] = useState<CoverTier>(initialTier);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showHospitalsModal, setShowHospitalsModal] = useState(false);

  // Dynamic pricing based on selected cover
  const currentMonthly = selectedTier.monthly;
  const currentAnnual = selectedTier.yearly;
  const displayPrice = billingCycle === 'monthly' ? `₹${currentMonthly}/month` : `₹${currentAnnual}/year`;

  const handleProceed = () => {
    onBuy({
      coverAmount: selectedTier.amount,
      coverLabel: selectedTier.label,
      billingCycle,
      premium: billingCycle === 'monthly' ? currentMonthly : currentAnnual,
      partner: partner.name
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
      
      {/* Top Insurer Header */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 border-b border-sky-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm text-lg">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">{partner.name}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">
                  IRDAI Approved
                </span>
              </div>
              <p className="text-xs text-slate-500">{partner.subtitle || 'Curated Group Health Plan'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs font-bold text-blue-700 justify-end">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Paytm Curated
            </div>
            <p className="text-[11px] text-slate-500">Cover up to {selectedTier.label}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        
        {/* Cover Amount Selector Chips (Matching Paytm Screen) */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Select Cover Amount
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PAYTM_COVER_TIERS.map((tier) => {
              const isSelected = selectedTier.amount === tier.amount;
              return (
                <button
                  key={tier.amount}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex flex-col items-center border ${
                    isSelected
                      ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-sm ring-1 ring-sky-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tier.label}</span>
                  {tier.isRecommended && (
                    <span className="text-[9px] text-amber-600 font-bold mt-0.5">Recommended</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Frequency Toggle (Monthly vs Annually with discount) */}
        <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200 flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Monthly (₹{currentMonthly}/mo)
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all relative ${
              billingCycle === 'annual'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Annually (₹{currentAnnual}/yr)
            <span className="ml-1 text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">
              Save ₹989
            </span>
          </button>
        </div>

        {/* UPI Autopay Guarantee Notice */}
        <div className="flex items-center justify-between text-xs text-slate-600 bg-sky-50/70 p-2.5 rounded-xl border border-sky-100">
          <div className="flex items-center gap-1.5 text-blue-700 font-medium">
            <Zap className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Automatic payments via Paytm UPI Autopay</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">
            Active
          </span>
        </div>

        {/* Cashless Hospitals Banner (From Image 2 & 5) */}
        <button
          onClick={() => setShowHospitalsModal(true)}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white rounded-xl shadow-sm transition-all text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">458 Hospitals in Pune</p>
              <p className="text-[11px] text-sky-100">& 10,928 cashless covered across India</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-0.5 transition-transform">
            <span>View List</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* 4 Feature Highlights (From Image 4) */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              100% Bills Covered
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              No room rent cap & zero co-pay on claim.
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              Regular Expenses
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              1 OPD visit/month & 24x7 doctor-on-call.
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
              Solid Coverage
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              10% extra bonus cover for each claim-free year.
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Paytm Perks
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              Priority claim assist & zero physical medical tests.
            </p>
          </div>
        </div>

        {/* Insurer Credibility Stats (From Image 2) */}
        <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
          <div>
            <p className="text-[10px] text-slate-400">Settlement Ratio</p>
            <p className="text-sm font-bold text-emerald-400">{partner.claimSettlement}</p>
          </div>
          <div className="h-6 w-[1px] bg-slate-700"></div>
          <div>
            <p className="text-[10px] text-slate-400">Claims Settled</p>
            <p className="text-sm font-bold text-white">{partner.claimsSettled || '16 Lakh+'}</p>
          </div>
          <div className="h-6 w-[1px] bg-slate-700"></div>
          <div>
            <p className="text-[10px] text-slate-400">Lives Insured</p>
            <p className="text-sm font-bold text-sky-400">{partner.lifeInsured || '2.17 Cr+'}</p>
          </div>
        </div>

        {/* Zero-Click Paytm Verified KYC Preview (From Image 6) */}
        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-left flex items-start gap-2.5">
          <UserCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{DEFAULT_PREFILLED_KYC.fullName}</span>
              <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                KYC Pre-filled
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Mobile: {DEFAULT_PREFILLED_KYC.mobileNumber} • {DEFAULT_PREFILLED_KYC.city} ({DEFAULT_PREFILLED_KYC.pincode})
            </p>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Action Bar (From Image 1 & 7) */}
      <div className="p-4 bg-white border-t border-slate-200 mt-auto flex items-center justify-between gap-3 shrink-0">
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Premium (incl. of GST)</p>
          <p className="text-lg font-extrabold text-slate-900 leading-tight">
            {displayPrice}
          </p>
        </div>
        <button
          onClick={handleProceed}
          className="flex-1 max-w-[200px] py-3 px-4 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-xl shadow-md shadow-sky-500/25 transition-all text-xs flex items-center justify-center gap-1.5"
        >
          <span>Proceed with UPI</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Network Hospitals Modal (From Image 5) */}
      {showHospitalsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm">Cashless Network Hospitals</h4>
                <p className="text-xs text-slate-400">458 Network Hospitals in Pune (411014)</p>
              </div>
              <button 
                onClick={() => setShowHospitalsModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto divide-y divide-slate-100 flex-1">
              {NETWORK_HOSPITALS_PUNE.map((hospital, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 text-left">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{hospital.name}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{hospital.address}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                          Pincode: {hospital.pincode}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          100% Cashless
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setShowHospitalsModal(false)}
                className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
              >
                Close Hospital List
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
