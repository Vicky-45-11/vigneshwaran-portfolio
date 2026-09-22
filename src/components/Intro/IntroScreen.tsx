import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { MiniNeuralOrb } from '../3d/MiniNeuralOrb';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface IntroScreenProps {
  onEnter: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const handleEnter = () => {
    sessionStorage.setItem('vs_intro_seen', 'true');
    setIsVisible(false);
    setTimeout(onEnter, 600); // Allow fade out
  };

  useEffect(() => {
    // If reduced motion is preferred or already seen in this session, provide quick escape
    const seen = sessionStorage.getItem('vs_intro_seen');
    if (seen === 'true' && !window.location.hash) {
      // Optional: automatically bypass or user can re-trigger if needed
    }
  }, []);

  const letters = ['P', 'O', 'R', 'T', 'F', 'O', 'L', 'I', 'O'];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none"
          role="dialog"
          aria-label="Portfolio Introduction"
        >
          {/* Top Skip Button */}
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={handleEnter}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-widest text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors uppercase border border-white/10 rounded-full hover:border-blue-500/40 bg-white/[0.02] backdrop-blur-sm"
            >
              <span>Skip Intro</span>
              <ArrowRight size={13} className="text-blue-400" />
            </button>
          </div>

          {/* Ambient Lighting & 3D Core in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
            <div className="w-80 h-80 rounded-full bg-cyan-500/10 blur-[90px]" />
            <div className="opacity-70 scale-150">
              <MiniNeuralOrb size={220} />
            </div>
          </div>

          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

          {/* Centered Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl">
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-950/20 text-[11px] font-mono tracking-wider text-blue-400 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              <span>AI / SOFTWARE DEVELOPER</span>
            </motion.div>

            {/* P O R T F O L I O letter-by-letter */}
            <h1 className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5 text-3xl sm:text-5xl md:text-6xl font-black tracking-widest text-[#F5F5F5]">
              {letters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block transition-transform hover:text-blue-400"
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            {/* Glowing Divider Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-48 sm:w-64 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent my-6"
            />

            {/* Vigneshwaran S */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wider text-[#A1A1AA] uppercase font-sans"
            >
              Vigneshwaran S
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-xs sm:text-sm text-[#71717A] mt-2 font-mono"
            >
              SRMIST • B.Tech CSE (AI)
            </motion.p>

            {/* Primary Action: Enter Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mt-10"
            >
              <button
                onClick={handleEnter}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium text-sm sm:text-base tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 active:scale-95"
              >
                <span>Enter Portfolio</span>
                <ChevronDown
                  size={18}
                  className="transition-transform group-hover:translate-y-1"
                />
              </button>
            </motion.div>
          </div>

          {/* Bottom subtle indicator */}
          <div className="absolute bottom-6 text-[11px] font-mono text-[#71717A] flex items-center gap-1.5">
            <Sparkles size={12} className="text-blue-400" />
            <span>Curated Developer Experience</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
