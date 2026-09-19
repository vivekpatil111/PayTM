import React from 'react';
import { HeartPulse, Car, Bike, Home, Store } from 'lucide-react';
import { translate, SupportedLanguage } from '../../lib/translationEngine';

const categories = [
  {
    id: 'health',
    icon: HeartPulse,
    label: 'Health Insurance',
    subLabel: 'Protection for you & family',
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'hover:border-red-300',
  },
  {
    id: 'car',
    icon: Car,
    label: 'Car Insurance',
    subLabel: '4-Wheeler coverage',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'hover:border-blue-300',
  },
  {
    id: 'bike',
    icon: Bike,
    label: 'Bike Insurance',
    subLabel: '2-Wheeler coverage',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'hover:border-amber-300',
  },
  {
    id: 'home',
    icon: Home,
    label: 'Home Insurance',
    subLabel: 'Protect your home',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'hover:border-emerald-300',
  },
  {
    id: 'shop',
    icon: Store,
    label: 'Shop Insurance',
    subLabel: 'Safeguard your business',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'hover:border-purple-300',
  },
];

interface CategorySelectorProps {
  onSelect: (id: string) => void;
  lang?: SupportedLanguage;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect, lang = 'en' }) => {
  const t = (text: string) => translate(text, lang);

  return (
    <div className="w-full max-w-md mx-auto p-5 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
        <span className="text-xl">🛡️</span> Paytm Saarthi
      </h3>
      <p className="text-sm text-slate-500 mb-5">{t("What would you like to insure today?")}</p>

      <div className="grid grid-cols-3 gap-3">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 ${c.border} transition-all hover:scale-105 hover:shadow-md ${c.bg} active:scale-95`}
            >
              <Icon className={`w-6 h-6 mb-2 ${c.color}`} />
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                {t(c.label)}
              </span>
              <span className="text-[10px] text-slate-400 text-center leading-tight mt-0.5 hidden sm:block">
                {t(c.subLabel)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
