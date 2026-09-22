import React from 'react';
import { ArrowUp } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { MiniNeuralOrb } from '../3d/MiniNeuralOrb';
import { GithubIcon } from '../icons/GithubIcon';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-white/[0.08] relative z-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Branding & Orb */}
          <div className="flex items-center gap-4">
            <MiniNeuralOrb size={36} />
            <div>
              <div className="font-bold text-sm tracking-wide text-[#F5F5F5]">
                {PORTFOLIO_DATA.personal.name}
              </div>
              <div className="text-[11px] font-mono text-[#71717A] tracking-wider">
                {PORTFOLIO_DATA.personal.role} • {PORTFOLIO_DATA.personal.location}
              </div>
            </div>
          </div>

          {/* Center: Copyright */}
          <div className="text-xs font-mono text-[#71717A]">
            © 2026 {PORTFOLIO_DATA.personal.name}. All rights reserved.
          </div>

          {/* Right: GitHub & Back to top */}
          <div className="flex items-center gap-4">
            <a
              href={PORTFOLIO_DATA.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={18} />
            </a>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.03] text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>TOP</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
