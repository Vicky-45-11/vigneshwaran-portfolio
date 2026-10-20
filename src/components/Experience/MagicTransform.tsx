import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { FileText, RotateCcw, Sparkles } from 'lucide-react';
import type { Responsibility } from '../../data/portfolio';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Plain "documents" fly into a glowing core one at a time and come out the
 * other side as colourful result cards. Written for this site in the spirit of
 * React Bits Pro "Magic Transform"; the result list is real, readable markup
 * from the start, the documents are decoration.
 */

const STEP_MS = 1400;
const REVEAL_DELAY_S = 0.6;

// One colour pair per result, on top of the site's blue/cyan.
const PALETTE = [
  { from: '#3B82F6', to: '#22D3EE' },
  { from: '#8B5CF6', to: '#EC4899' },
  { from: '#10B981', to: '#22D3EE' },
  { from: '#F59E0B', to: '#EF4444' },
];

interface MagicTransformProps {
  items: Responsibility[];
}

export function MagicTransform({ items }: MagicTransformProps) {
  const reducedMotion = useReducedMotion();
  const wide = useMediaQuery('(min-width: 1024px)');
  const rootRef = useRef<HTMLDivElement>(null);
  const pileRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.35 });
  const [step, setStep] = useState(0);
  const [flight, setFlight] = useState({ x: 240, y: 0 });
  const total = items.length;
  const shown = reducedMotion ? total : step;

  // Where the core sits relative to the document pile, so documents fly into it.
  useLayoutEffect(() => {
    const measure = () => {
      const pile = pileRef.current?.getBoundingClientRect();
      const core = coreRef.current?.getBoundingClientRect();
      if (!pile || !core) return;
      setFlight({
        x: core.left + core.width / 2 - (pile.left + pile.width / 2),
        y: core.top + core.height / 2 - (pile.top + pile.height / 2),
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [wide]);

  useEffect(() => {
    if (reducedMotion || !inView || step >= total) return undefined;
    const id = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 500 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [reducedMotion, inView, step, total]);

  const done = shown >= total;

  return (
    <div ref={rootRef} className="relative">
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.5fr)] lg:gap-10">
        {/* Documents waiting to be transformed */}
        <div ref={pileRef} className="relative mx-auto h-[200px] w-full max-w-[260px] sm:h-[230px] lg:h-[280px]" aria-hidden="true">
          <AnimatePresence>
            {items.map((item, i) => {
              if (i < shown) return null;
              const depth = i - shown;
              return (
                <motion.div
                  key={item.topic}
                  className="absolute inset-x-0 top-1/2 mx-auto w-[86%] mc-card p-4 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]"
                  style={{ zIndex: total - i, translateY: '-50%' }}
                  initial={false}
                  animate={{
                    y: depth * 12,
                    rotate: depth === 0 ? -2 : (depth % 2 ? 4 : -5) * Math.min(depth, 2) * 0.6,
                    scale: 1 - depth * 0.05,
                    opacity: depth > 3 ? 0 : 1 - depth * 0.18,
                  }}
                  exit={{
                    x: flight.x,
                    y: flight.y,
                    scale: 0.15,
                    rotate: 28,
                    opacity: 0,
                    filter: 'blur(6px)',
                    transition: { duration: 0.7, ease: [0.55, 0, 0.75, 0.3] },
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-mist-muted" />
                    <span className="label-mono truncate text-mist-muted">{item.topic}</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-1.5 w-full bg-white/10" />
                    <div className="h-1.5 w-[82%] bg-white/10" />
                    <div className="h-1.5 w-[64%] bg-white/10" />
                    <div className="h-1.5 w-[74%] bg-white/[0.07]" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {done && (
            <motion.p
              className="label-mono absolute inset-0 flex items-center justify-center text-center text-mist-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              All transformed
            </motion.p>
          )}
        </div>

        {/* The core */}
        <div ref={coreRef} className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28 lg:h-36 lg:w-36" aria-hidden="true">
          <div className="magic-core absolute inset-0" />
          <div className="absolute inset-[4px] flex items-center justify-center bg-[#0e0e12]">
            <Sparkles size={wide ? 30 : 24} className="text-accent-light" />
          </div>
          {!reducedMotion &&
            shown > 0 && (
              <motion.div
                key={`pulse-${shown}`}
                className="absolute inset-0 border-2"
                style={{ borderColor: PALETTE[(shown - 1) % PALETTE.length].from }}
                initial={{ scale: 0.9, opacity: 0.9 }}
                animate={{ scale: 1.9, opacity: 0 }}
                transition={{ duration: 0.9, delay: REVEAL_DELAY_S - 0.15, ease: 'easeOut' }}
              />
            )}
          {!reducedMotion &&
            shown > 0 &&
            Array.from({ length: 10 }, (_, k) => {
              const c = PALETTE[(shown - 1) % PALETTE.length];
              const spread = (k / 9 - 0.5) * 1.6;
              const dist = 90 + (k % 3) * 30;
              const angle = wide ? spread : Math.PI / 2 + spread;
              return (
                <motion.span
                  key={`spark-${shown}-${k}`}
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5"
                  style={{ background: k % 2 ? c.from : c.to, boxShadow: `0 0 10px ${c.to}` }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                  animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: [0, 1, 0], scale: [0.5, 1.2, 0.4] }}
                  transition={{ duration: 0.8, delay: REVEAL_DELAY_S - 0.1, ease: 'easeOut' }}
                />
              );
            })}
        </div>

        {/* Results: always in the markup, revealed as each document comes through */}
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item, i) => {
            const c = PALETTE[i % PALETTE.length];
            const visible = i < shown;
            return (
              <motion.li
                key={item.topic}
                className="rounded-2xl p-px"
                style={{ backgroundImage: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                initial={false}
                animate={
                  visible
                    ? { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }
                    : { opacity: 0, x: wide ? -60 : 0, y: wide ? 0 : -40, scale: 0.6, filter: 'blur(10px)' }
                }
                transition={{ duration: reducedMotion ? 0 : 0.7, delay: visible && !reducedMotion ? REVEAL_DELAY_S : 0, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative h-full overflow-hidden bg-ink-800 p-5 sm:p-6">
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 opacity-25 blur-2xl"
                    style={{ background: c.to }}
                    aria-hidden="true"
                  />
                  <p
                    className="label-mono relative bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${c.from}, ${c.to})` }}
                  >
                    {item.topic}
                  </p>
                  <p className="relative mt-3 text-base leading-relaxed text-mist">{item.detail}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {!reducedMotion && done && (
        <motion.button
          type="button"
          onClick={() => setStep(0)}
          className="label-mono mt-8 inline-flex items-center gap-2 border border-line px-4 py-2 text-mist-muted transition-colors hover:border-line-strong hover:text-mist"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <RotateCcw size={14} aria-hidden="true" />
          Replay
        </motion.button>
      )}
    </div>
  );
}
