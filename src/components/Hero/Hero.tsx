import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Code2, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { NeuralOrb } from '../3d/NeuralOrb';
import { HeroCards } from './HeroCards';
import { GithubIcon } from '../icons/GithubIcon';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Typography & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Metadata Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
                <span className="text-xs font-mono tracking-wider text-emerald-400">
                  {PORTFOLIO_DATA.personal.status}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono">
                <Sparkles size={12} />
                <span>{PORTFOLIO_DATA.personal.educationMeta}</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight text-[#F5F5F5] leading-[1.05] uppercase">
                <span className="block text-[#A1A1AA] text-2xl sm:text-3xl md:text-4xl font-mono font-medium tracking-normal mb-1">
                  Hi, I'm
                </span>
                <span className="bg-gradient-to-r from-white via-[#F5F5F5] to-[#A1A1AA] bg-clip-text text-transparent">
                  Vigneshwaran S
                </span>
              </h1>
            </motion.div>

            {/* Supporting Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 flex items-center gap-3"
            >
              <div className="w-8 h-[2px] bg-blue-500" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-mono font-semibold tracking-wider text-blue-400 uppercase">
                {PORTFOLIO_DATA.personal.role}
              </h2>
            </motion.div>

            {/* Concise Resume Profile */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed font-sans"
            >
              {PORTFOLIO_DATA.personal.heroIntro}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm tracking-wide shadow-lg shadow-blue-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Code2 size={16} />
                <span>VIEW PROJECTS</span>
                <ArrowRight size={15} />
              </a>

              <a
                href={PORTFOLIO_DATA.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-[#F5F5F5] font-mono text-xs tracking-wider uppercase transition-all duration-200"
              >
                <GithubIcon size={16} />
                <span>GITHUB</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-blue-500/25 hover:border-blue-500/50 bg-blue-950/20 text-blue-300 font-medium text-xs tracking-wider uppercase transition-all duration-200"
              >
                <Mail size={15} />
                <span>CONTACT ME</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: 3D AI Core (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center">
              {/* Radial background aura */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

              {/* Decorative Tech Rings */}
              <div className="absolute inset-6 rounded-full border border-dashed border-white/[0.06] animate-spin-slow pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-white/[0.04] pointer-events-none" />

              {/* 3D Neural Orb */}
              <NeuralOrb className="w-full h-full" />

              {/* Technical floating badges */}
              <div className="absolute bottom-4 left-0 px-3 py-1.5 rounded-lg bg-[#111111]/90 border border-white/[0.08] backdrop-blur-md shadow-lg pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-[10px] font-mono text-[#A1A1AA] tracking-wider">
                    AI CORE • NEURAL GRAPH
                  </span>
                </div>
              </div>

              <div className="absolute top-4 right-0 px-3 py-1.5 rounded-lg bg-[#111111]/90 border border-white/[0.08] backdrop-blur-md shadow-lg pointer-events-none">
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider">
                  SRMIST CHENNAI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Information Highlights */}
        <HeroCards />
      </div>
    </section>
  );
};
