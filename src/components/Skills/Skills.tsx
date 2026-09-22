import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Terminal,
  Database,
  Cpu,
  Layers,
  GitBranch,
  Box,
  Server,
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'PROGRAMMING',
    'FRONTEND',
    'BACKEND',
    'DATABASES',
    'AI',
    'TOOLS',
    'CORE',
  ];

  const filteredSkills =
    activeCategory === 'ALL'
      ? PORTFOLIO_DATA.skills
      : PORTFOLIO_DATA.skills.filter((s) => s.category === activeCategory);

  const getSkillIcon = (category: string, name: string) => {
    switch (category) {
      case 'AI':
        return <Cpu size={18} className="text-cyan-400 group-hover:rotate-12 transition-transform" />;
      case 'DATABASES':
        return <Database size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />;
      case 'FRONTEND':
        return <Layers size={18} className="text-blue-400 group-hover:translate-y-[-2px] transition-transform" />;
      case 'BACKEND':
        return <Server size={18} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />;
      case 'TOOLS':
        return name === 'Docker' ? (
          <Box size={18} className="text-sky-400 group-hover:rotate-6 transition-transform" />
        ) : (
          <GitBranch size={18} className="text-amber-400 group-hover:rotate-12 transition-transform" />
        );
      case 'CORE':
        return <Terminal size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />;
      default:
        return <Code size={18} className="text-blue-400 group-hover:rotate-6 transition-transform" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs tracking-widest uppercase mb-3">
            <span>02. SKILLS & TECH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F5F5F5] flex items-center gap-4">
            <span>Technical Proficiency</span>
            <span className="hidden sm:block h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-blue-500/40 to-transparent" />
          </h2>
          <p className="mt-2 text-[#A1A1AA] text-sm sm:text-base font-mono">
            Languages, frameworks, databases and tools I work with.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500'
                    : 'bg-[#111111]/80 text-[#A1A1AA] hover:text-white border border-white/[0.08] hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Skill Cards Grid */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                className="group relative p-4 rounded-xl bg-[#111111]/80 hover:bg-[#171717] border border-white/[0.07] hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 cursor-default select-none"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.05] group-hover:bg-blue-500/10 group-hover:border-blue-500/25 transition-colors">
                    {getSkillIcon(skill.category, skill.name)}
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A] tracking-wider uppercase group-hover:text-blue-400/80 transition-colors">
                    {skill.category}
                  </span>
                </div>

                <div className="font-bold text-sm text-[#F5F5F5] group-hover:text-white transition-colors tracking-tight">
                  {skill.name}
                </div>

                {/* Subtle bottom glowing accent bar on hover */}
                <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Context Info */}
        <div className="mt-8 flex items-center justify-between text-xs font-mono text-[#71717A] px-2">
          <span>{filteredSkills.length} Technologies Listed</span>
          <span className="hidden sm:inline">Active category: {activeCategory}</span>
        </div>
      </div>
    </section>
  );
};
