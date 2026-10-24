import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useGame } from '../World/gameContext';
import { SectionHeading } from '../ui/SectionHeading';
import { education } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Two steps of a staircase, one per qualification, built from the ground up. The words come straight from the portfolio data.
const COLS = 14;
const ROWS = 8;
const CELL = 30;
const DROP_MS = 70;
const SCENE_W = 600;
const SCENE_H = ROWS * CELL + 60;
const STAIR_X = 90;
const STEP_SPLIT = 6; // columns 0-5 are the first step, 6-13 the second
const STEP_TOPS = [6, 4]; // grass row of each step

interface Block { x: number; y: number; layer: number; color: string }

function stairBlocks(): Block[] {
  const out: Block[] = [];
  for (let layer = 0; layer < 2; layer++) {
    const from = layer === 0 ? 0 : STEP_SPLIT;
    const to = layer === 0 ? STEP_SPLIT - 1 : COLS - 1;
    for (let x = from; x <= to; x++) {
      for (let y = STEP_TOPS[layer]; y < ROWS; y++) {
        const top = y === STEP_TOPS[layer];
        const color = top ? '#5fa83a' : y === ROWS - 1 ? (x % 2 ? '#7d7d85' : '#6b6b73') : (x + y) % 3 ? '#8a5a32' : '#7a4e28';
        out.push({ x, y, layer, color });
      }
    }
  }
  return out;
}

function Stars() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {[[40, 20], [120, 50], [220, 18], [330, 40], [430, 22], [520, 56], [570, 18]].map(([x, y], i) => (
        <motion.span key={i} className="absolute block h-1.5 w-1.5 bg-white" style={{ left: x, top: y }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 + i * 0.3 }} />
      ))}
      <span className="absolute right-10 top-6 block h-10 w-10 border-2 border-black bg-[#e8e8f0]" />
    </div>
  );
}

function Sun() {
  return <span className="pointer-events-none absolute right-12 top-6 block h-12 w-12 border-2 border-[#d9a400] bg-[#ffe45e] shadow-[0_0_30px_10px_#fff3a088]" aria-hidden="true" />;
}

/** The enchanting table: obsidian base, red cloth top, a book that floats and glyphs that rise. */
function EnchantingTable({ show, x, y }: { show: boolean; x: number; y: number }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y, width: CELL, height: CELL }} aria-hidden="true">
      <span className="absolute inset-x-0 bottom-0 block h-5 border-2 border-black bg-[#2a1a4a]" />
      <span className="absolute inset-x-0 bottom-4 block h-2 border-2 border-black bg-[#b02030]" />
      <motion.span className="absolute left-[7px] block h-3 w-4 border-2 border-black bg-[#e8dcb0]" style={{ top: -8 }} animate={{ y: [0, -8, 0], rotate: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }} />
      {['ᛉ', 'ᚦ', 'ᛟ', 'ᚨ'].map((g, i) => (
        <motion.span key={g} className="absolute font-pixel text-sm text-[#b890ff]" style={{ left: 4 + i * 6, top: -6 }} animate={{ y: [0, -46], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.7 }}>{g}</motion.span>
      ))}
    </div>
  );
}

function Sign({ x, y, text, show }: { x: number; y: number; text: string; show: boolean }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y }} aria-hidden="true">
      <span className="label-mono block whitespace-nowrap border-2 border-black bg-[#b8864b] px-1.5 py-0.5 text-black">{text}</span>
      <span className="mx-auto block h-3 w-1 bg-[#6a4a2a]" />
    </div>
  );
}

/** A villager who walks the first step, then hops up to the second. */
function Student({ show, up, reduce }: { show: boolean; up: boolean; reduce: boolean }) {
  const hop = up && !reduce;
  return (
    <motion.div className="absolute z-10" style={{ width: 18, height: 40 }} initial={false}
      animate={{ left: !show ? -40 : up ? 10 * CELL : 1 * CELL, bottom: up ? ROWS * CELL - STEP_TOPS[1] * CELL : ROWS * CELL - STEP_TOPS[0] * CELL, opacity: show ? 1 : 0 }}
      transition={reduce ? { duration: 0 } : hop ? { duration: 2.6, ease: 'easeInOut' } : { duration: 1.4, ease: 'linear' }} aria-hidden="true">
      <span className="absolute left-[3px] top-0 block h-[14px] w-[12px] border-2 border-black bg-[#c9976a]" />
      <span className="absolute left-[2px] top-[-4px] block h-[5px] w-[14px] border-2 border-black bg-[#1a1a22]" />
      <span className="absolute left-0 top-[14px] block h-[18px] w-[18px] border-2 border-black bg-[#4a5a9a]" />
      <span className="absolute bottom-0 left-[2px] block h-[8px] w-[14px] bg-[#3a2a1a]" />
    </motion.div>
  );
}

/** The education entries, told as a staircase that builds itself: each qualification is one step up. */
export function EducationBuild() {
  const reduce = useReducedMotion();
  const blocks = useMemo(() => stairBlocks(), []);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const { night } = useGame();
  const [run, setRun] = useState(0);
  const [mined, setMined] = useState<Set<number>>(() => new Set());
  const [drops, setDrops] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [hot, setHot] = useState<number | null>(null);
  const dropId = useRef(0);
  const [built, setStage] = useState(0); // 1 = first step, 2 = second step, 3 = student on first step, 4 = student up, 5 = done
  const stage = reduce ? 5 : built;
  const fit = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const started = useRef(false);

  // The scene is drawn at a fixed size; on narrow screens it is scaled down to fit.
  useEffect(() => {
    const el = fit.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / SCENE_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build once when the scene scrolls into view, and again whenever the visitor presses REBUILD.
  useEffect(() => {
    if (reduce) return;
    if (!inView && !started.current) return;
    started.current = true;
    const timers: number[] = [window.setTimeout(() => setStage(0), 0)];
    const n0 = blocks.filter((b) => b.layer === 0).length;
    const n1 = blocks.length - n0;
    let t = 300;
    t += n0 * DROP_MS + 400; timers.push(window.setTimeout(() => setStage(1), t));
    t += n1 * DROP_MS + 400; timers.push(window.setTimeout(() => setStage(2), t));
    t += 300; timers.push(window.setTimeout(() => setStage(3), t));
    t += 1800; timers.push(window.setTimeout(() => setStage(4), t));
    t += 2800; timers.push(window.setTimeout(() => setStage(5), t));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, run, reduce, blocks]);

  const order = (b: Block) => blocks.indexOf(b);
  const stepHot = (layer: number) => hot === layer;
  const labels = ['Higher Secondary', 'B.Tech'];
  // Chronological: the earlier qualification is the lower step.
  const steps = [...education].reverse();

  return (
    <section id="education" aria-labelledby="education-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeading index="06" label="Academic path" title="Education" id="education-title" />

        <div ref={ref} className="mt-12 grid items-end gap-10 lg:grid-cols-[auto_1fr]">
          <div className="mx-auto w-full min-w-0 max-w-[600px] lg:w-[600px]">
            <div ref={fit} className="relative" style={{ width: '100%', maxWidth: SCENE_W, height: SCENE_H * scale }}>
              <div className="overflow-hidden border-4 border-black" style={{ position: 'absolute', left: 0, top: 0, width: SCENE_W, height: SCENE_H, transform: `scale(${scale})`, transformOrigin: 'top left', background: night ? 'linear-gradient(#070b22, #1a2150)' : 'linear-gradient(#5E95F2, #bfe0ff)' }}>
                {night ? <Stars /> : <Sun />}
                <div className="absolute" style={{ left: STAIR_X, top: 30, width: COLS * CELL, height: ROWS * CELL }}>
                  {blocks.map((b, i) => (
                    <motion.button key={`${run}-${i}`} type="button" tabIndex={-1} aria-hidden="true" onMouseEnter={() => setHot(b.layer)} onMouseLeave={() => setHot(null)}
                      onClick={() => {
                        if (mined.has(i) || stage < 5) return;
                        setMined((m) => new Set(m).add(i));
                        const id = ++dropId.current;
                        setDrops((d) => [...d, { id, x: b.x * CELL + CELL / 2, y: b.y * CELL, color: b.color }]);
                        window.setTimeout(() => setDrops((d) => d.filter((q) => q.id !== id)), 1100);
                      }}
                      className="absolute block cursor-[crosshair] border-2 border-black/60 p-0"
                      style={{
                        left: b.x * CELL, top: b.y * CELL, width: CELL, height: CELL, background: b.color,
                        boxShadow: 'inset 3px 3px 0 #fff3, inset -3px -3px 0 #0003',
                        outline: stepHot(b.layer) ? '2px solid #ffff55' : 'none', outlineOffset: -2,
                      }}
                      initial={reduce ? false : { y: -260, opacity: 0 }}
                      animate={mined.has(i) ? { scale: 0, rotate: 40, opacity: 0 } : (b.layer === 0 ? stage >= 0 && built > 0 : stage >= 1 && built > 0) || reduce ? { y: 0, opacity: 1, scale: 1, rotate: 0 } : { y: -260, opacity: 0 }}
                      transition={mined.has(i) ? { duration: 0.25 } : { delay: reduce ? 0 : ((b.layer === 0 ? order(b) : order(b) - blocks.filter((o) => o.layer === 0).length) * DROP_MS) / 1000, type: 'spring', stiffness: 220, damping: 18 }} />
                  ))}
                  <Sign x={1.2 * CELL} y={STEP_TOPS[0] * CELL - 38} text={steps[0]?.period ?? ''} show={stage >= 1} />
                  <Sign x={11.2 * CELL} y={STEP_TOPS[1] * CELL - 38} text={steps[1]?.period ?? ''} show={stage >= 2} />
                  <EnchantingTable show={stage >= 2} x={8 * CELL} y={STEP_TOPS[1] * CELL - CELL + 4} />
                  <AnimatePresence>
                    {drops.map((d) => (
                      <motion.span key={d.id} aria-hidden="true" className="pointer-events-none absolute block h-3 w-3 border border-black" style={{ left: d.x - 6, top: d.y, background: d.color }}
                        initial={{ y: 0, opacity: 1 }} animate={{ y: [-30, 0, -12, 0], x: [0, 8, 14, 18], opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} />
                    ))}
                  </AnimatePresence>
                  <Student show={stage >= 3} up={stage >= 4} reduce={reduce} />
                </div>
                <div className="absolute inset-x-0 bottom-0" style={{ height: 30, background: 'repeating-linear-gradient(90deg,#5a8a3a 0 30px,#4f7d33 30px 60px)', borderTop: '6px solid #6fae4a' }} aria-hidden="true" />
                <p className="label-mono absolute left-2 top-2 bg-black/60 px-2 py-1 text-white">BLOCKS MINED · {mined.size}</p>
                {stage >= 5 && mined.size === 0 && <p className="label-mono absolute bottom-9 right-2 bg-black/60 px-2 py-1 text-[#ffff55]">CLICK A BLOCK TO MINE IT</p>}
              </div>
            </div>
            <button type="button" className="label-mono mc-slot mt-4 px-4 py-2 text-white" onClick={() => { setMined(new Set()); setRun((n) => n + 1); }}>REBUILD</button>
            <p className="label-mono mt-2 max-w-[37rem] text-mist-muted">Click a block to mine it. This scene is a toy: the text beside it has everything.</p>
          </div>

          <ol className="grid gap-3" aria-label="Education, oldest first">
            {steps.map((item, i) => {
              const done = stage > i;
              return (
                <motion.li key={item.institution} className={`mc-card flex items-start gap-4 p-4 sm:p-5 ${hot === i ? 'outline outline-2 outline-[#ffff55]' : ''}`} animate={{ opacity: done ? 1 : 0.35, x: done ? (hot === i ? -8 : 0) : 12 }} transition={{ duration: 0.4 }}>
                  <span className="mt-1 block h-6 w-6 shrink-0 border-[3px] border-black" style={{ background: i === 0 ? '#8a5a32' : '#5fa83a' }} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="label-mono block text-accent-light">STEP {i + 1} · {labels[i] ?? ''} · {item.period}</span>
                    <span className="mt-1 block font-pixel text-lg uppercase text-white">{item.qualification}</span>
                    <span className="block text-mist-muted">{item.institution}</span>
                    <span className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-mist">
                      <span className="flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" /> {item.location}</span>
                      {item.cgpa && <span className="font-mono">CGPA {item.cgpa}</span>}
                    </span>
                  </span>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
