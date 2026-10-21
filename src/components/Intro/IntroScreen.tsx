import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EASE_EDITORIAL } from '../animations/easing';
import { useGame } from '../World/gameContext';
import { sfx } from '../World/sound';
import { personal } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface IntroScreenProps {
  /** Called with `true` when the visitor skips, so the exit can be instant. */
  onFinish: (skipped: boolean) => void;
}

/**
 * Block-game title screen. It never traps the visitor: Skip and Escape close
 * it at once, and scroll is only locked while it is visible.
 */
export function IntroScreen({ onFinish }: IntroScreenProps) {
  const reducedMotion = useReducedMotion();
  const enterRef = useRef<HTMLButtonElement>(null);
  const { sound, setSound } = useGame();

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
      className="mc-dirt-bg fixed inset-0 z-[60] flex flex-col overflow-hidden"
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
      <div className="container-editorial relative z-10 flex items-center justify-between pt-5 sm:pt-7">
        <span className="label-mono text-white/70">{personal.initials} / {new Date().getFullYear()}</span>
        <button
          type="button"
          onClick={() => onFinish(true)}
          className="mc-btn min-h-11 px-5 text-base"
        >
          SKIP INTRO
        </button>
      </div>

      <div className="container-editorial relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <motion.h1
          {...rise(0.1)}
          className="hero-heading text-[clamp(2.1rem,7.6vw,7.5rem)] font-bold uppercase leading-[0.95]"
        >
          {personal.name}
        </motion.h1>

        <motion.p {...rise(0.3)} className="label-mono mt-5 text-[#ffff55] [text-shadow:2px_2px_0_#3f3f15]">
          {personal.headline}
        </motion.p>

        <motion.div {...rise(0.45)} className="mt-10 w-[min(80vw,26rem)]" aria-hidden="true">
          <p className="label-mono text-left text-white">Generating world…</p>
          <div className="mt-2 h-4 border-[3px] border-black bg-[#1b1b1b]">
            <motion.div
              className="h-full bg-[#80ff20] shadow-[inset_0_3px_0_rgba(255,255,255,0.35)]"
              initial={{ width: reducedMotion ? '100%' : '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: reducedMotion ? 0 : 2.2, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        <motion.div {...rise(0.7)} className="mt-10 flex w-[min(80vw,26rem)] flex-col gap-3">
          <button
            ref={enterRef}
            type="button"
            onClick={() => {
              sfx.click();
              onFinish(false);
            }}
            className="mc-btn mc-btn--green min-h-12 px-8 text-lg"
          >
            Enter Portfolio
          </button>
          <button
            type="button"
            onClick={() => setSound(!sound)}
            aria-pressed={sound}
            className="mc-btn min-h-11 px-6 text-base"
          >
            Sound: {sound ? 'ON' : 'OFF'}
          </button>
        </motion.div>
      </div>

      <div className="container-editorial relative z-10 flex justify-between pb-6 text-white/60">
        <span className="label-mono">{personal.location}</span>
        <span className="label-mono hidden sm:inline">Press M for sound · Esc to skip</span>
      </div>
    </motion.div>
  );
}
