import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { NeuralOrb } from '../3d/NeuralOrb';
import { EASE_EDITORIAL } from '../animations/easing';
import { personal } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface IntroScreenProps {
  /** Called with `true` when the visitor skips, so the exit can be instant. */
  onFinish: (skipped: boolean) => void;
}

/**
 * Cinematic splash. It never traps the visitor: Skip and Escape close it at
 * once, scroll is only locked while it is visible, and the orb has a CSS
 * fallback if WebGL or the three.js chunk fails.
 */
export function IntroScreen({ onFinish }: IntroScreenProps) {
  const reducedMotion = useReducedMotion();
  const enterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    enterRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFinish(true);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onFinish]);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0.2 : 0.9, delay: reducedMotion ? 0 : delay, ease: EASE_EDITORIAL },
  });

  return (
    <motion.div
      key="intro"
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio introduction"
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-ink"
      initial={{ opacity: 1 }}
      variants={{
        // `skipped` comes from AnimatePresence's `custom` prop: skipping is instant.
        exit: (skipped: boolean) => ({
          opacity: 0,
          transition: { duration: skipped || reducedMotion ? 0.15 : 0.7, ease: EASE_EDITORIAL },
        }),
      }}
      exit="exit"
    >
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0.2 : 1.4, ease: EASE_EDITORIAL }}
      >
        <NeuralOrb detail="lite" className="aspect-square w-[min(88vw,560px)] opacity-80" />
      </motion.div>

      <div className="container-editorial relative z-10 flex items-center justify-between pt-5 sm:pt-7">
        <span className="label-mono text-mist-muted">{personal.initials} / {new Date().getFullYear()}</span>
        <button
          type="button"
          onClick={() => onFinish(true)}
          className="label-mono min-h-11 rounded-full border border-white/15 px-5 text-mist transition-colors duration-200 hover:border-white/40 hover:bg-white/[0.05]"
        >
          SKIP INTRO
        </button>
      </div>

      <div className="container-editorial relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <motion.p
          className="font-mono text-xs uppercase text-accent-light sm:text-sm"
          initial={{ opacity: 0, letterSpacing: reducedMotion ? '0.5em' : '1.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.5em' }}
          transition={{ duration: reducedMotion ? 0.2 : 1.4, ease: EASE_EDITORIAL }}
        >
          PORTFOLIO
        </motion.p>

        <motion.h1
          {...rise(0.25)}
          className="hero-heading mt-6 text-[clamp(2.25rem,8.6vw,9rem)] font-black uppercase leading-[0.9] tracking-tight"
        >
          {personal.name}
        </motion.h1>

        <motion.p {...rise(0.45)} className="label-mono mt-6 text-mist-muted sm:text-sm">
          {personal.headline}
        </motion.p>

        <motion.div {...rise(0.7)} className="mt-12">
          <button
            ref={enterRef}
            type="button"
            onClick={() => onFinish(false)}
            className="group inline-flex min-h-12 items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold tracking-[0.16em] text-white ring-1 ring-inset ring-white/20 transition-shadow duration-200 hover:shadow-[0_8px_40px_-6px_rgba(59,130,246,0.65)]"
            style={{ backgroundImage: 'linear-gradient(123deg, #0B1F3A, #2563EB, #3B82F6)' }}
          >
            ENTER PORTFOLIO
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </motion.div>
      </div>

      <div className="container-editorial relative z-10 flex justify-between pb-6 text-mist-dim">
        <span className="label-mono">{personal.location}</span>
        <span className="label-mono hidden sm:inline">Press Esc to skip</span>
      </div>
    </motion.div>
  );
}
