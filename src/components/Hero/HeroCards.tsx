import React from 'react';
import { Brain, Code, Database } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';

export const HeroCards: React.FC = () => {
  const icons = [
    <Brain size={18} className="text-blue-400" />,
    <Code size={18} className="text-cyan-400" />,
    <Database size={18} className="text-indigo-400" />,
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12">
      {PORTFOLIO_DATA.heroHighlights.map((card, idx) => (
        <div
          key={card.number}
          className="group relative rounded-2xl p-5 bg-[#111111]/80 backdrop-blur-md border border-white/[0.08] hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5"
        >
          {/* Subtle Corner Glow on Hover */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-semibold text-blue-400/80 tracking-widest">
              {card.number}
            </span>
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.05] group-hover:border-blue-500/20 group-hover:bg-blue-500/10 transition-colors">
              {icons[idx]}
            </div>
          </div>

          <h3 className="text-sm font-bold text-[#F5F5F5] tracking-wide mb-2">
            {card.title}
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {card.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[#A1A1AA] group-hover:text-blue-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
