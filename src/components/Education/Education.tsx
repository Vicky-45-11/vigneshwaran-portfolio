import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, MapPin, Calendar } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';

export const Education: React.FC = () => {
  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs tracking-widest uppercase mb-3">
            <span>05. EDUCATION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F5F5F5] flex items-center gap-4">
            <span>Academic Background</span>
            <span className="hidden sm:block h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-blue-500/40 to-transparent" />
          </h2>
          <p className="mt-2 text-[#A1A1AA] text-sm sm:text-base font-mono">
            Degrees, academic milestones, and engineering specializations.
          </p>
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PORTFOLIO_DATA.education.map((item, idx) => (
            <motion.div
              key={item.institution}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative p-6 sm:p-8 rounded-2xl bg-[#111111]/80 border border-white/[0.08] hover:border-blue-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <GraduationCap size={22} />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#71717A]">
                  <Calendar size={13} />
                  <span>{item.duration}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#F5F5F5] mb-2 group-hover:text-blue-400 transition-colors tracking-tight">
                {item.institution}
              </h3>

              <div className="text-sm font-mono text-cyan-400 mb-4 font-medium">
                {item.degree}
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#A1A1AA]">
                  <MapPin size={14} className="text-[#71717A]" />
                  <span>{item.location}</span>
                </div>

                {item.cgpa && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                    <Award size={13} />
                    <span>CGPA: {item.cgpa}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
