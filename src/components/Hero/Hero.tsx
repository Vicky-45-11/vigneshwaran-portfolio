import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { NeuralOrb } from '../3d/NeuralOrb';
import { EASE_EDITORIAL } from '../animations/easing';
import { ContactButton } from '../ui/ContactButton';
import { personal } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HeroProps {
  /** Hold the entrance animation until the intro has closed. */
  ready: boolean;
}

export function Hero({ ready }: HeroProps) {
  const reducedMotion = useReducedMotion();
  const distance = reducedMotion ? 0 : 1;

  const enter = (delay: number, y = 40) => ({
    initial: { opacity: 0, y: y * distance },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: reducedMotion ? 0.2 : 0.9, delay: reducedMotion ? 0 : delay, ease: EASE_EDITORIAL },
  });

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 sm:pt-28">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-[20%] top-[8%] -z-10 h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16),transparent_60%)]"
        aria-hidden="true"
      />

      <motion.div
        className="pointer-events-none absolute -z-[5] aspect-square w-[min(92vw,420px)] bottom-[16%] right-[-24%] sm:bottom-auto sm:right-[-6%] sm:top-[6%] sm:w-[min(70vw,560px)] lg:right-[4%] lg:top-[8%] lg:w-[min(46vw,720px)]"
        initial={{ opacity: 0, y: 30 * distance, scale: reducedMotion ? 1 : 0.94 }}
        animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: reducedMotion ? 0.2 : 1.4, delay: reducedMotion ? 0 : 0.35, ease: EASE_EDITORIAL }}
      >
        <div className={reducedMotion ? 'h-full w-full' : 'animate-float h-full w-full'}>
          <NeuralOrb className="h-full w-full" />
        </div>
      </motion.div>

      <div className="container-editorial flex flex-1 flex-col">
        <motion.p {...enter(0.1, 16)} className="label-mono mt-6 text-mist-muted sm:mt-10">
          <span className="text-accent-light">●</span>&nbsp;&nbsp;{personal.headline} — {personal.location}
        </motion.p>

        <motion.h1
          id="hero-title"
          {...enter(0.2)}
          className="hero-heading mt-6 text-[clamp(2.5rem,11.4vw,10.25rem)] font-black uppercase leading-[0.86] tracking-[-0.045em] sm:mt-8"
        >
          <span className="block">Hi, I'm</span>
          <span className="block">{personal.firstName}</span>
        </motion.h1>

        <motion.p {...enter(0.4, 24)} className="mt-8 max-w-xl text-lg leading-relaxed text-mist sm:text-xl">
          {personal.heroCopy}
        </motion.p>
        <motion.p {...enter(0.5, 24)} className="mt-3 max-w-xl text-sm text-mist-muted">
          {personal.supportingHeadline}
        </motion.p>

        <div className="mt-auto flex flex-col gap-8 border-t border-line pb-8 pt-8 sm:flex-row sm:items-center sm:justify-between sm:pb-10">
          <motion.div {...enter(0.6, 16)} className="flex items-center gap-4">
            <a
              href="#stack"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-mist transition-colors hover:border-white/40"
              aria-label="Scroll to the technology section"
            >
              <ArrowDown size={18} aria-hidden="true" />
            </a>
            <span className="label-mono text-mist">{personal.heroMeta}</span>
          </motion.div>
          <motion.div {...enter(0.7, 24)}>
            <ContactButton />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
