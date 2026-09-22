import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { AiTextDetectorShowcase } from './AiTextDetectorShowcase';
import { CampusConnectShowcase } from './CampusConnectShowcase';
import { SpotifyCloneShowcase } from './SpotifyCloneShowcase';
import { GithubIcon } from '../icons/GithubIcon';

export const Projects: React.FC = () => {
  const [proj1, proj2, proj3] = PORTFOLIO_DATA.projects;

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs tracking-widest uppercase mb-3">
            <span>03. PROJECTS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F5F5F5] flex items-center gap-4">
            <span>Featured Software Projects</span>
            <span className="hidden sm:block h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-blue-500/40 to-transparent" />
          </h2>
          <p className="mt-2 text-[#A1A1AA] text-sm sm:text-base font-mono">
            Selected projects focused on AI, software and interactive experiences.
          </p>
        </div>

        {/* Project 01 — Featured: AI Text Detector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          data-cursor="project"
          data-cursor-text="EXPLORE"
          className="mb-16 rounded-3xl bg-[#111111]/80 border border-white/[0.08] hover:border-blue-500/40 p-6 sm:p-8 lg:p-10 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Interactive Left Side Showcase (7 cols) */}
            <div className="lg:col-span-7">
              <AiTextDetectorShowcase />
            </div>

            {/* Right Side Info (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400 tracking-widest">
                  01 • FEATURED SHOWCASE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-300 uppercase">
                  {proj1.subtitle}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] tracking-tight group-hover:text-blue-300 transition-colors">
                {proj1.title}
              </h3>

              <div className="text-xs font-mono text-cyan-400">
                {proj1.tagline}
              </div>

              <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed font-sans">
                {proj1.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {proj1.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#F5F5F5]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <a
                  href={PORTFOLIO_DATA.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono tracking-wider font-semibold transition-all shadow-md shadow-blue-600/20"
                >
                  <span>SOURCE CODE</span>
                  <GithubIcon size={14} />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] text-xs font-mono text-[#A1A1AA] hover:text-white transition-all"
                >
                  <span>INQUIRE DETAILS</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two-Column Grid for Projects 02 & 03 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project 02: Campus Connect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            data-cursor="project"
            data-cursor-text="VIEW"
            className="rounded-3xl bg-[#111111]/80 border border-white/[0.08] hover:border-cyan-500/40 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest">
                  02 • PLATFORM
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 uppercase">
                  {proj2.subtitle}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] mb-2 group-hover:text-cyan-300 transition-colors">
                {proj2.title}
              </h3>

              <div className="text-xs font-mono text-cyan-400 mb-3">
                {proj2.tagline}
              </div>

              <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                {proj2.description}
              </p>

              <div className="mb-6">
                <CampusConnectShowcase />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-5">
                {proj2.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-[#F5F5F5]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={PORTFOLIO_DATA.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-white transition-all"
                >
                  <GithubIcon size={14} />
                  <span>VIEW REPOSITORY</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Project 03: Spotify Clone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            data-cursor="project"
            data-cursor-text="LISTEN"
            className="rounded-3xl bg-[#111111]/80 border border-white/[0.08] hover:border-emerald-500/40 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest">
                  03 • WEB APPLICATION
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300 uppercase">
                  {proj3.subtitle}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] mb-2 group-hover:text-emerald-300 transition-colors">
                {proj3.title}
              </h3>

              <div className="text-xs font-mono text-emerald-400 mb-3">
                {proj3.tagline}
              </div>

              <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                {proj3.description}
              </p>

              <div className="mb-6">
                <SpotifyCloneShowcase />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-5">
                {proj3.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-[#F5F5F5]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={PORTFOLIO_DATA.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-white transition-all"
                >
                  <GithubIcon size={14} />
                  <span>VIEW REPOSITORY</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
