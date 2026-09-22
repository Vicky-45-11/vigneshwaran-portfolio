import React from 'react';
import { motion } from 'framer-motion';

export const CurrentlyBuilding: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-r from-blue-950/30 via-[#111111] to-cyan-950/20 border border-white/[0.08] p-8 sm:p-12 overflow-hidden shadow-2xl"
        >
          {/* Subtle Ambient Lighting */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                <span>CURRENTLY BUILDING</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F5F5F5] tracking-tight">
                Exploring AI, full-stack development and intelligent software systems.
              </h3>

              <p className="text-sm text-[#A1A1AA] font-mono">
                Continuous experimentation with neural architectures, modern web stacks, and scalable data models.
              </p>
            </div>

            {/* Code / Terminal Highlight Badge */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-[#A1A1AA] w-full md:w-auto shrink-0 shadow-lg">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.06] text-[10px] text-[#71717A]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                </div>
                <span>stack.config.ts</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <p><span className="text-blue-400">const</span> focus = <span className="text-emerald-400">'Scalable AI Engineering'</span>;</p>
                <p><span className="text-blue-400">const</span> stack = [<span className="text-cyan-400">'Python'</span>, <span className="text-cyan-400">'React'</span>, <span className="text-cyan-400">'Node'</span>];</p>
                <p><span className="text-blue-400">export default</span> () =&gt; buildIntelligentSolutions();</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
