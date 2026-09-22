import React from 'react';
import { motion } from 'framer-motion';
import { Users2, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';

export const Experience: React.FC = () => {
  const exp = PORTFOLIO_DATA.experience[0];

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs tracking-widest uppercase mb-3">
            <span>04. EXPERIENCE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F5F5F5] flex items-center gap-4">
            <span>Experience</span>
            <span className="hidden sm:block h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-blue-500/40 to-transparent" />
          </h2>
          <p className="mt-2 text-[#A1A1AA] text-sm sm:text-base font-mono">
            Student Leadership & Operations
          </p>
        </div>

        {/* Vertical Timeline Card */}
        <div className="relative pl-6 sm:pl-10 border-l border-blue-500/30 max-w-3xl">
          {/* Animated Timeline Node */}
          <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-blue-600 border-4 border-[#050505] shadow-sm shadow-blue-500" />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-6 sm:p-8 rounded-2xl bg-[#111111]/80 border border-white/[0.08] hover:border-blue-500/30 backdrop-blur-md transition-all duration-300 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-mono text-blue-400 font-medium">
                <Users2 size={13} />
                <span>STUDENT LEADERSHIP & OPERATIONS</span>
              </span>

              <span className="text-xs font-mono text-[#71717A]">
                SRMIST Chennai
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#F5F5F5] mb-2 tracking-tight">
              {exp.organization}
            </h3>

            <p className="text-sm font-mono text-cyan-400 mb-6">
              {exp.roleDescription}
            </p>

            {/* Resume Highlights */}
            <div className="space-y-3.5 pt-2">
              {exp.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed font-sans">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>

            {/* Core Competencies Badges */}
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/[0.06]">
              {['Event Execution', 'Resource Allocation', 'Team Coordination', 'Faculty Collaboration'].map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-[#A1A1AA]"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
