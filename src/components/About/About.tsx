import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Brain, Terminal, MapPin, GraduationCap, Award, Compass } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';

export const About: React.FC = () => {
  const capabilityIcons = [
    <Code2 size={24} className="text-blue-400" />,
    <Brain size={24} className="text-cyan-400" />,
    <Terminal size={24} className="text-indigo-400" />,
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-14 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs tracking-widest uppercase mb-3">
            <span>01. ABOUT ME</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F5F5F5] flex items-center gap-4">
            <span>Background & Passions</span>
            <span className="hidden sm:block h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-blue-500/40 to-transparent" />
          </h2>
          <p className="mt-2 text-[#A1A1AA] text-sm sm:text-base font-mono">
            Academic foundation, technical interest, and problem-solving focus.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Personal Narrative & Quick Facts (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="p-8 rounded-2xl bg-[#111111]/80 border border-white/[0.08] backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-xl font-bold text-[#F5F5F5] mb-4 flex items-center gap-2.5">
                <Compass size={20} className="text-blue-400" />
                <span>Personal Profile</span>
              </h3>

              <p className="text-[#A1A1AA] leading-relaxed text-base mb-6 font-sans">
                {PORTFOLIO_DATA.personal.profile}
              </p>

              {/* Quick Facts Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/[0.08]">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-400 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                      Location
                    </span>
                    <span className="text-sm font-medium text-[#F5F5F5]">
                      {PORTFOLIO_DATA.personal.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap size={18} className="text-cyan-400 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                      Degree
                    </span>
                    <span className="text-sm font-medium text-[#F5F5F5]">
                      B.Tech in CSE (AI)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award size={18} className="text-indigo-400 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                      Academic CGPA
                    </span>
                    <span className="text-sm font-medium text-[#F5F5F5]">
                      8.15 • SRMIST
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Brain size={18} className="text-blue-400 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                      Specialization
                    </span>
                    <span className="text-sm font-medium text-[#F5F5F5]">
                      Artificial Intelligence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Three Capability Cards (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {PORTFOLIO_DATA.aboutCapabilities.map((cap, idx) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group p-6 rounded-2xl bg-[#111111]/70 hover:bg-[#171717] border border-white/[0.08] hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-colors">
                    {capabilityIcons[idx]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-base font-bold text-[#F5F5F5] group-hover:text-blue-400 transition-colors">
                        {cap.title}
                      </h4>
                      <span className="font-mono text-xs text-[#71717A]">
                        0{idx + 1}
                      </span>
                    </div>
                    <p className="text-sm text-[#A1A1AA] leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
