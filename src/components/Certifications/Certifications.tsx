import React from 'react';
import { motion } from 'framer-motion';
import { Award, Brain, Code, BarChart3, FileSpreadsheet } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';

export const Certifications: React.FC = () => {
  const getCertIcon = (cat: string) => {
    switch (cat) {
      case 'AI / MACHINE LEARNING':
        return <Brain size={20} className="text-cyan-400 group-hover:rotate-12 transition-transform" />;
      case 'PROGRAMMING':
        return <Code size={20} className="text-blue-400 group-hover:rotate-12 transition-transform" />;
      case 'DATA SCIENCE':
        return <BarChart3 size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />;
      case 'PRODUCTIVITY':
        return <FileSpreadsheet size={20} className="text-emerald-400 group-hover:rotate-6 transition-transform" />;
      default:
        return <Award size={20} className="text-blue-400 group-hover:rotate-12 transition-transform" />;
    }
  };

  return (
    <section id="certifications" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs tracking-widest uppercase mb-3">
            <span>06. CERTIFICATIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F5F5F5] flex items-center gap-4">
            <span>Courses & Credentials</span>
            <span className="hidden sm:block h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-blue-500/40 to-transparent" />
          </h2>
          <p className="mt-2 text-[#A1A1AA] text-sm sm:text-base font-mono">
            Verified academic courses, technical fundamentals, and specialized learning.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO_DATA.certifications.map((cert, idx) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative p-6 rounded-2xl bg-[#111111]/80 hover:bg-[#161616] border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:bg-blue-500/10 group-hover:border-blue-500/25 transition-colors">
                    {getCertIcon(cert.category)}
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A] group-hover:text-blue-400 transition-colors uppercase tracking-wider">
                    0{idx + 1}
                  </span>
                </div>

                <span className="inline-block text-[10px] font-mono text-blue-400/90 tracking-wider uppercase mb-2">
                  {cert.category}
                </span>

                <h3 className="text-base font-bold text-[#F5F5F5] leading-snug group-hover:text-white transition-colors">
                  {cert.name}
                </h3>
              </div>

              {cert.issuer && (
                <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono text-[#71717A]">
                  <span>Credential Issuer</span>
                  <span className="text-[#A1A1AA] font-semibold">{cert.issuer}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
