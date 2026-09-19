import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  UserCheck, 
  Wrench, 
  PhoneCall 
} from 'lucide-react';
import { 
  MOCK_VEHICLE_DATA, 
  CAR_COMPREHENSIVE_PLANS, 
  CAR_THIRD_PARTY_PLANS, 
  CAR_ADDONS 
} from '../../lib/paytmCarInsuranceData';
import { DEFAULT_PREFILLED_KYC } from '../../lib/paytmInsuranceData';
import { translate, SupportedLanguage } from '../../lib/translationEngine';

interface CarQuoteCardProps {
  quote: any;
  partner: any;
  onBuy: (details?: any) => void;
  lang?: SupportedLanguage;
}

export const CarQuoteCard: React.FC<CarQuoteCardProps> = ({ quote, partner, onBuy, lang = 'en' }) => {
  const t = (text: string) => translate(text, lang);
  const [selectedPlanType, setSelectedPlanType] = useState<'comprehensive' | 'third_party'>('comprehensive');
  const [selectedPartnerId, setSelectedPartnerId] = useState('tata_aig_comp');
  const [includePACover, setIncludePACover] = useState(true);
  const [includeRSA, setIncludeRSA] = useState(false);
  const [showBreakup, setShowBreakup] = useState(false);

  // Selected plan calculation
  const plansList = selectedPlanType === 'comprehensive' ? CAR_COMPREHENSIVE_PLANS : CAR_THIRD_PARTY_PLANS;
  const currentPlan = plansList.find(p => p.id === selectedPartnerId) || plansList[0];

  const basePrice = currentPlan.basePrice;
  const paPrice = includePACover ? 354 : 0;
  const rsaPrice = includeRSA ? 199 : 0;
  const subtotal = basePrice + paPrice + rsaPrice;
  const gst = Math.round(subtotal * 0.18);
  const totalPrice = subtotal + gst;

  const handleProceed = () => {
    onBuy({
      vehicleNumber: quote.vehicleNumber || MOCK_VEHICLE_DATA.vehicleNumber,
      vehicleModel: MOCK_VEHICLE_DATA.makeModel,
      planType: selectedPlanType,
      partner: currentPlan.partner,
      idv: currentPlan.idv,
      basePrice,
      paCover: includePACover,
      rsaCover: includeRSA,
      totalPrice
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
      
      {/* Top Vehicle Info Header (From Image 2) */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 border-b border-sky-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm">{MOCK_VEHICLE_DATA.makeModel}</span>
              <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-semibold">
                {MOCK_VEHICLE_DATA.fuel}
              </span>
            </div>
            <p className="text-xs font-mono font-semibold text-slate-500">{quote.vehicleNumber || MOCK_VEHICLE_DATA.vehicleNumber}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
            VAHAN Verified
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">{MOCK_VEHICLE_DATA.variant} • {MOCK_VEHICLE_DATA.year}</p>
        </div>
      </div>

      {/* Avoid Challan Alert Banner (From Image 3) */}
      <div className="bg-amber-50 px-3 py-2 border-b border-amber-200/60 flex items-center gap-2 text-left">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-[11px] text-amber-800 font-medium">
          Renew now to secure your car and avoid up to <b>₹2,000 Challans</b>.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        
        {/* Plan Type Selector (Comprehensive vs Third Party) */}
        <div className="bg-slate-50 p-1 rounded-xl border border-slate-200 flex">
          <button
            onClick={() => {
              setSelectedPlanType('comprehensive');
              setSelectedPartnerId('tata_aig_comp');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedPlanType === 'comprehensive'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Comprehensive Plan
          </button>
          <button
            onClick={() => {
              setSelectedPlanType('third_party');
              setSelectedPartnerId('digit_tp');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedPlanType === 'third_party'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Third Party Only (₹2,094)
          </button>
        </div>

        {/* Insurer Quotation Card (From Image 2 & 3) */}
        <div className="p-3.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-sm text-left relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{currentPlan.partner}</span>
                {currentPlan.popularChoice && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                    Popular Choice ⭐
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                IDV: <span className="font-semibold text-sky-400">{currentPlan.idv}</span> • Claim Settlement: <span className="font-semibold text-emerald-400">{currentPlan.claimSettlement}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Base Price</span>
              <span className="text-base font-extrabold text-white">₹{currentPlan.basePrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-300 bg-white/10 p-2 rounded-lg mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{currentPlan.perk || 'Instant digital policy issuance with zero inspection'}</span>
          </p>
        </div>

        {/* Add-ons Checklist (From Image 2 & 4) */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2 text-left">
            Popular Add-Ons
          </label>
          <div className="space-y-2">
            
            {/* PA Cover */}
            <div 
              onClick={() => setIncludePACover(!includePACover)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-left ${
                includePACover 
                  ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-300' 
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  checked={includePACover} 
                  onChange={() => {}} 
                  className="mt-1 rounded text-blue-600 pointer-events-none" 
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">15 Lakh Personal Accident Cover</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                      Mandatory by Law
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">By IndusInd GIC • Valid for 1 year</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 shrink-0">+₹354</span>
            </div>

            {/* Roadside Assistance */}
            <div 
              onClick={() => setIncludeRSA(!includeRSA)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-left ${
                includeRSA 
                  ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-300' 
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  checked={includeRSA} 
                  onChange={() => {}} 
                  className="mt-1 rounded text-blue-600 pointer-events-none" 
                />
                <div>
                  <span className="text-xs font-bold text-slate-900">24x7 Roadside Assistance</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Towing, flat tyre, jumpstart across India</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 shrink-0">+₹199</span>
            </div>

          </div>
        </div>

        {/* Auto-Prefilled Vehicle Owner Details (From Image 4) */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500 text-[11px]">Registered Owner</span>
            <span className="font-bold text-slate-900">{DEFAULT_PREFILLED_KYC.fullName}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500 text-[11px]">Mobile Number</span>
            <span className="font-mono text-slate-900">{DEFAULT_PREFILLED_KYC.mobileNumber}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500 text-[11px]">Policy Duration</span>
            <span className="font-semibold text-emerald-700">19 Sep 2026 - 18 Sep 2027</span>
          </div>
        </div>

        {/* Pricing Breakup Dropdown (From Image 3) */}
        {showBreakup && (
          <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 text-left text-xs space-y-1.5 animate-in fade-in">
            <div className="flex justify-between text-slate-600">
              <span>Own Damage & Third Party Base</span>
              <span>₹{basePrice.toLocaleString('en-IN')}</span>
            </div>
            {includePACover && (
              <div className="flex justify-between text-slate-600">
                <span>Personal Accident Cover</span>
                <span>₹354</span>
              </div>
            )}
            {includeRSA && (
              <div className="flex justify-between text-slate-600">
                <span>Roadside Assistance</span>
                <span>₹199</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>GST (18%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-sky-200">
              <span>Total Payable</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

      </div>

      {/* Sticky Bottom Bar (From Image 3) */}
      <div className="p-4 bg-white border-t border-slate-200 mt-auto flex items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-1">
            <p className="text-[10px] text-slate-400 font-medium">Price (including GST)</p>
            <button 
              onClick={() => setShowBreakup(!showBreakup)} 
              className="text-[10px] text-blue-600 font-bold hover:underline"
            >
              {showBreakup ? 'Hide' : 'View Breakup'}
            </button>
          </div>
          <p className="text-lg font-extrabold text-slate-900 leading-tight">
            ₹{totalPrice.toLocaleString('en-IN')}
          </p>
        </div>
        <button
          onClick={handleProceed}
          className="flex-1 max-w-[180px] py-3 px-4 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-xl shadow-md shadow-sky-500/25 transition-all text-xs flex items-center justify-center gap-1.5"
        >
          <span>Pay Now</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
