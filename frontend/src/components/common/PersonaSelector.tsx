import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

// ── Tier color coding ──────────────────────────────────────────────────────────
const TIER_COLORS: Record<string, string> = {
  TIER_1: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  TIER_2: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  TIER_3: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  TIER_4: 'text-red-400 bg-red-400/10 border-red-400/30',
};

interface PersonaOption {
  merchantId: string;
  name: string;
  businessName: string;
  city: string;
  tier: string;
  altScore: number;
}

interface PersonaSelectorProps {
  currentId: string;
  onSelect: (id: string) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ currentId, onSelect }) => {
  const [personas, setPersonas] = useState<PersonaOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hardcoded fallback — mirrors mockMerchants.json so the demo works offline
  const FALLBACK_PERSONAS: PersonaOption[] = [
    { merchantId: 'MERCH_JAIPUR_0821',    name: 'Ramesh Sharma',  businessName: 'Ramesh Kirana Store',       city: 'Jaipur',     tier: 'TIER_1', altScore: 825 },
    { merchantId: 'MERCH_PUNE_0411',       name: 'Sunita Devi',    businessName: 'Sunita Silai Centre',       city: 'Pune',       tier: 'TIER_3', altScore: 620 },
    { merchantId: 'MERCH_DELHI_1104',      name: 'Arjun Mehta',    businessName: 'Mehta Mobile & Recharge',  city: 'Delhi',      tier: 'TIER_2', altScore: 762 },
    { merchantId: 'MERCH_MUMBAI_0512',     name: 'Priya Nadar',    businessName: 'Priya Tiffin Services',    city: 'Mumbai',     tier: 'TIER_1', altScore: 810 },
    { merchantId: 'MERCH_HYDERABAD_0903',  name: 'Venkat Reddy',   businessName: 'Reddy Auto Spare Parts',   city: 'Hyderabad',  tier: 'TIER_1', altScore: 851 },
    { merchantId: 'MERCH_KOLKATA_0707',    name: 'Fatima Begum',   businessName: 'Fatima Handicrafts',       city: 'Kolkata',    tier: 'TIER_4', altScore: 520 },
  ];

  useEffect(() => {
    fetch(`/api/merchant?id=${currentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.availablePersonas?.length) {
          setPersonas(data.availablePersonas);
        } else {
          setPersonas(FALLBACK_PERSONAS);
        }
      })
      .catch(() => setPersonas(FALLBACK_PERSONAS))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = personas.find(p => p.merchantId === currentId) ?? FALLBACK_PERSONAS[0];

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      >
        <Users className="w-3.5 h-3.5 text-paytm-cyan shrink-0" />
        <span className="hidden sm:inline text-slate-400 mr-0.5">Persona:</span>
        <span className="truncate max-w-[120px]">{current?.name ?? '...'}</span>
        {current && (
          <span className={`ml-1 text-[9px] font-bold px-1 py-0.5 rounded border ${TIER_COLORS[current.tier] ?? ''}`}>
            {current.tier.replace('TIER_', 'T')}
          </span>
        )}
        <span className="text-slate-500 ml-0.5">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute left-0 top-full mt-1.5 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 py-1 min-w-[280px] overflow-hidden">
            <div className="px-3 py-1.5 border-b border-slate-800">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Switch Demo Merchant</p>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 px-3 py-3 text-xs text-slate-400">
                <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-paytm-cyan rounded-full animate-spin" />
                Loading personas...
              </div>
            ) : (
              personas.map(p => {
                const isActive = p.merchantId === currentId;
                return (
                  <button
                    key={p.merchantId}
                    onClick={() => { onSelect(p.merchantId); setOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors hover:bg-slate-800
                      ${isActive ? 'bg-slate-800/70' : ''}`}
                  >
                    {/* Alt score ring */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[9px] font-black shrink-0 ${TIER_COLORS[p.tier] ?? 'text-slate-400 border-slate-600'}`}>
                      {p.altScore}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{p.name}</span>
                        {isActive && <span className="text-[8px] bg-paytm-cyan/20 text-paytm-cyan border border-paytm-cyan/30 px-1 py-0.5 rounded font-bold">ACTIVE</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{p.city} · {p.businessName}</div>
                    </div>

                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${TIER_COLORS[p.tier] ?? ''}`}>
                      {p.tier.replace('_', ' ')}
                    </span>
                  </button>
                );
              })
            )}

            {/* Legend */}
            <div className="px-3 py-2 border-t border-slate-800 flex items-center gap-3">
              {Object.entries(TIER_COLORS).map(([tier, cls]) => (
                <div key={tier} className="flex items-center gap-1">
                  <span className={`text-[8px] font-bold px-1 py-0.5 rounded border ${cls}`}>{tier.replace('TIER_', 'T')}</span>
                </div>
              ))}
              <span className="text-[9px] text-slate-600 ml-auto">Alt Score →</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
