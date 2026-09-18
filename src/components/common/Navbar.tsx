import React, { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Problem', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'USPs', href: '#usps' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Moat', href: '#moat' },
  { label: 'Demo', href: '#demo' },
  { label: 'Impact', href: '#impact' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      // Determine active section
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md border-b border-gray-200' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#002970] flex items-center justify-center">
            <span className="text-white font-black text-base leading-none">P</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-black text-[#002970] tracking-tight">Paytm Saarthi</div>
            <div className="text-[9px] text-blue-600 font-semibold uppercase tracking-wider">
              AI-Powered Financial Journeys
            </div>
          </div>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                link.label === 'Demo'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 ml-2 shadow-sm'
                  : activeSection === link.href.replace('#', '')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#demo"
          className="shrink-0 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          🚀 Live Demo
        </a>
      </div>
    </nav>
  );
};
