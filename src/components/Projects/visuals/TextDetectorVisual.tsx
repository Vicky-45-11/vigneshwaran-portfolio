import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';

// Animated illustration of a text-analysis pipeline: text types in, a scanner
// picks out patterns, and signals flow through a small network to a verdict.
// Decorative only: it shows no scores or statistics because none are published
// for the project, and the verdict simply alternates between runs.

const lines = [
  [38, 22, 30],
  [26, 44, 18],
  [52, 28],
  [20, 34, 32],
  [46, 24, 16],
  [30, 40],
  [18, 36, 28],
  [42, 30],
  [24, 20, 38],
  [34, 46],
  [28, 18, 26],
  [40, 24],
];

// Token positions [line, segment] that get highlighted as "patterns".
const highlighted = new Set(['0-1', '1-1', '3-2', '4-0', '7-1', '9-0', '10-2']);

const stages = ['Tokenize', 'Patterns', 'Classify'] as const;
const PHASE_MS = [1700, 2200, 2400];
const VERDICTS = ['AI-generated', 'Human-written'] as const;

const inputs = [10, 30, 50];
const outputs = [15, 45]; // index 0 = AI-generated, 1 = Human-written

export function TextDetectorVisual() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(reduce ? 2 : 0);
  const [run, setRun] = useState(0);
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);

  // Step through the three stages while the card is on screen.
  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setTimeout(() => {
      if (phase === 2) {
        setPhase(0);
        setRun((r) => r + 1);
      } else {
        setPhase(phase + 1);
      }
    }, PHASE_MS[phase]);
    return () => window.clearTimeout(id);
  }, [phase, inView, reduce]);

  const verdict = reduce ? 0 : run % 2;
  const animate = !reduce;

  return (
    <div ref={root} className="relative flex h-full w-full flex-col gap-4 overflow-hidden border border-line bg-ink p-5 sm:p-6">
      {/* Window bar with the pipeline stages lighting up in turn */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-2 w-2 bg-[#ff5f56]" />
            <span className="h-2 w-2 bg-[#ffbd2e]" />
            <span className="h-2 w-2 bg-accent-light" />
          </span>
          <span className="label-mono text-mist-muted">text_input.txt</span>
          {animate && phase === 0 && <span className="h-3 w-1.5 animate-pulse bg-accent-light" />}
        </div>
        <ol className="flex items-center gap-1.5">
          {stages.map((stage, i) => {
            const active = i === phase;
            const done = i < phase;
            return (
              <li key={stage} className="flex items-center gap-1.5">
                <span
                  className={`label-mono flex items-center gap-1.5 border px-2 py-0.5 text-[0.6rem] transition-colors duration-300 ${
                    active
                      ? 'border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan'
                      : done
                        ? 'border-accent-light/30 text-accent-light'
                        : 'border-line text-mist-dim'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 ${active ? 'animate-pulse bg-accent-cyan' : done ? 'bg-accent-light' : 'bg-mist-dim/60'}`} />
                  <span className="hidden sm:inline">{stage}</span>
                </span>
                {i < stages.length - 1 && <span className={`h-px w-2 ${done ? 'bg-accent-light' : 'bg-line'}`} />}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Text panel: tokens type in, a scanner sweeps, patterns glow. A soft lens follows the pointer. */}
      <div
        className="relative flex-1 overflow-hidden border border-line bg-ink-800 p-4"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          setSpot({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onPointerLeave={() => setSpot(null)}
      >
        <div key={run} className="flex h-full flex-col justify-between gap-3">
          {lines.map((segments, l) => (
            <div key={l} className="flex gap-2">
              {segments.map((w, s) => {
                const isPattern = highlighted.has(`${l}-${s}`);
                const lit = isPattern && phase >= 1;
                return (
                  <motion.span
                    key={s}
                    style={{ width: `${w}%`, transformOrigin: 'left center' }}
                    initial={animate ? { scaleX: 0, opacity: 0 } : false}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.35, delay: animate ? l * 0.09 + s * 0.05 : 0, ease: 'easeOut' }}
                    className={`relative h-2.5 rounded-full transition-[background-color,box-shadow] duration-500 hover:bg-accent-cyan/70 hover:shadow-[0_0_14px_rgba(74,237,217,0.7)] ${
                      lit ? 'bg-accent/80 shadow-[0_0_12px_rgba(76,175,53,0.65)]' : 'bg-white/10'
                    }`}
                  >
                    {lit && animate && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-accent-light"
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.8, delay: (l / lines.length) * 1.6 }}
                      />
                    )}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Scanner beam, only while looking for patterns */}
        {animate && phase === 1 && (
          <motion.div
            key={`scan-${run}`}
            className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-accent-cyan/20 to-transparent"
            initial={{ top: '-15%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.8, ease: 'linear' }}
          >
            <div className="absolute inset-x-0 top-1/2 h-px bg-accent-cyan/70 shadow-[0_0_10px_#4AEDD9]" />
          </motion.div>
        )}

        {spot && (
          <div
            className="pointer-events-none absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-cyan/30 bg-[radial-gradient(circle,rgba(74,237,217,0.14),transparent_70%)]"
            style={{ left: spot.x, top: spot.y }}
          />
        )}

        {/* Pixel corner brackets */}
        {['left-1 top-1 border-l-2 border-t-2', 'right-1 top-1 border-r-2 border-t-2', 'left-1 bottom-1 border-l-2 border-b-2', 'right-1 bottom-1 border-r-2 border-b-2'].map((c) => (
          <span key={c} className={`pointer-events-none absolute h-3 w-3 border-accent-light/50 ${c}`} />
        ))}
      </div>

      {/* Network: signals travel from the features to the verdict */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <svg viewBox="0 0 160 60" className="h-12 w-full text-accent-light" fill="none">
          {inputs.map((y1) =>
            outputs.map((y2, o) => (
              <line
                key={`${y1}-${y2}`}
                x1="8"
                y1={y1}
                x2="152"
                y2={y2}
                stroke={phase === 2 && o === verdict ? '#4AEDD9' : 'currentColor'}
                strokeOpacity={phase === 2 && o === verdict ? 0.6 : 0.2}
                strokeWidth="1"
                className="transition-[stroke,stroke-opacity] duration-500"
              />
            )),
          )}
          {animate &&
            phase === 2 &&
            inputs.map((y1, i) => (
              <motion.circle
                key={`sig-${run}-${y1}`}
                r="2.4"
                fill="#4AEDD9"
                initial={{ cx: 8, cy: y1, opacity: 0 }}
                animate={{ cx: 152, cy: outputs[verdict], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.9, delay: i * 0.18, ease: 'easeInOut', repeat: 1, repeatDelay: 0.25 }}
              />
            ))}
          {inputs.map((y) => (
            <circle key={y} cx="8" cy={y} r="4" fill="currentColor" fillOpacity={phase >= 1 ? 0.9 : 0.4} className="transition-[fill-opacity] duration-500" />
          ))}
          {outputs.map((y, o) => (
            <circle
              key={y}
              cx="152"
              cy={y}
              r={phase === 2 && o === verdict ? 6 : 4.5}
              fill="#4AEDD9"
              fillOpacity={phase === 2 && o === verdict ? 1 : 0.35}
              className="transition-all duration-500"
            />
          ))}
        </svg>
        <span className="label-mono text-[0.6rem] text-mist-dim">→</span>
        <div className="flex flex-col gap-2">
          {[1, 0].map((o) => {
            const on = phase === 2 && o === verdict;
            return (
              <span
                key={o}
                className={`label-mono relative overflow-hidden border px-3 py-1.5 text-center text-[0.6rem] transition-colors duration-500 ${
                  on ? 'border-accent-cyan/60 bg-accent-cyan/15 text-accent-cyan' : 'border-line text-mist-dim'
                }`}
              >
                {VERDICTS[o]}
                <AnimatePresence>
                  {on && animate && (
                    <motion.span
                      className="absolute inset-0 bg-accent-cyan/30"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  )}
                </AnimatePresence>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
