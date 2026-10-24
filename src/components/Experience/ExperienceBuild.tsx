import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useGame } from '../World/gameContext';
import { SectionHeading } from '../ui/SectionHeading';
import { experience } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// One layer of the house per responsibility, built from the ground up. The words come straight from the portfolio data.
const COLS = 11;
const CELL = 30;
const DROP_MS = 90; // delay between blocks
const SCENE_W = 600;
const HOUSE_X = 135; // house offset inside the scene
const LAYER_COLORS = ['#7d7d85', '#b8864b', '#a8432f', '#6a4a2a'];

interface Block { x: number; y: number; layer: number; color: string; glass?: boolean }

function houseBlocks(): Block[] {
  const out: Block[] = [];
  // layer 0: cobblestone foundation
  for (let x = 0; x < COLS; x++) out.push({ x, y: 8, layer: 0, color: x % 2 ? '#7d7d85' : '#6b6b73' });
  // layer 1: plank walls with two windows and a door gap
  for (let y = 5; y <= 7; y++) {
    for (let x = 1; x <= COLS - 2; x++) {
      const door = x >= 5 && x <= 6 && y >= 6;
      if (door) continue;
      const glass = y === 6 && (x === 2 || x === COLS - 3);
      out.push({ x, y, layer: 1, color: glass ? '#9fd8ee' : '#b8864b', glass });
    }
  }
  // layer 2: brick roof, stepping in each row
  for (let r = 0; r < 4; r++) for (let x = r; x <= COLS - 1 - r; x++) out.push({ x, y: 4 - r, layer: 2, color: r % 2 ? '#a8432f' : '#933a29' });
  // layer 3: the door, finished last
  for (const y of [6, 7]) for (const x of [5, 6]) out.push({ x, y, layer: 3, color: '#6a4a2a' });
  return out;
}


function Sky({ night }: { night: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {night ? (
        <>
          {[[40, 20], [120, 50], [220, 18], [330, 40], [430, 22], [520, 56], [570, 18]].map(([x, y], i) => <motion.span key={i} className="absolute block h-1.5 w-1.5 bg-white" style={{ left: x, top: y }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 + i * 0.3 }} />)}
          <span className="absolute right-10 top-6 block h-10 w-10 border-2 border-black bg-[#e8e8f0]" />
        </>
      ) : (
        <>
          <span className="absolute right-12 top-6 block h-12 w-12 border-2 border-[#d9a400] bg-[#ffe45e] shadow-[0_0_30px_10px_#fff3a088]" />
          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="absolute block h-6 border-2 border-white/70 bg-white/90" style={{ top: 24 + i * 34, width: 70 + i * 16 }} initial={{ left: -120 }} animate={{ left: SCENE_W + 40 }} transition={{ repeat: Infinity, duration: 40 + i * 14, ease: 'linear', delay: -i * 12 }} />
          ))}
        </>
      )}
    </div>
  );
}

function Smoke({ on }: { on: boolean }) {
  if (!on) return null;
  return (
    <>
      <span className="absolute block h-6 w-6 border-2 border-black/60 bg-[#6b6b73]" style={{ left: 8 * CELL, top: 2 * CELL - 10 }} aria-hidden="true" />
      {[0, 1, 2, 3].map((i) => (
        <motion.span key={i} className="pointer-events-none absolute block h-3 w-3 bg-white/70" style={{ left: 8 * CELL + 6, top: 2 * CELL - 14 }} aria-hidden="true"
          animate={{ y: [0, -70], x: [0, 14, -4], opacity: [0.9, 0], scale: [1, 2.2] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.75, ease: 'easeOut' }} />
      ))}
    </>
  );
}

function Torch({ night, x, y, show }: { night: boolean; x: number; y: number; show: boolean }) {
  if (!show) return null;
  return (
    <span className="pointer-events-none absolute block" style={{ left: x, top: y, width: 6, height: 22 }} aria-hidden="true">
      <span className="absolute inset-x-0 bottom-0 block h-3.5 bg-[#6a4a2a]" />
      <motion.span className="absolute inset-x-0 top-0 block h-2 bg-[#ffcf3a]" animate={{ opacity: [1, 0.7, 1], boxShadow: [`0 0 ${night ? 22 : 8}px 6px #ffb02e99`, `0 0 ${night ? 30 : 10}px 9px #ffb02e66`, `0 0 ${night ? 22 : 8}px 6px #ffb02e99`] }} transition={{ repeat: Infinity, duration: 1.1 }} />
    </span>
  );
}

function Tree({ x, flip, grow }: { x: number; flip: boolean; grow: boolean }) {
  return (
    <motion.div className="absolute origin-bottom" style={{ left: x, bottom: 50, width: 60, height: 120, scaleX: flip ? -1 : 1 }} initial={false} animate={{ scaleY: grow ? 1 : 0.1 }} transition={{ duration: 1.2 }} aria-hidden="true">
      <span className="absolute bottom-0 left-[22px] block h-[56px] w-4 border-2 border-black bg-[#6a4a2a]" />
      <span className="absolute left-0 top-0 block h-[66px] w-[60px] border-2 border-black" style={{ background: 'repeating-conic-gradient(#2f7a2a 0 25%, #3c8f34 0 50%) 0 0/12px 12px' }} />
    </motion.div>
  );
}

function Chicken() {
  return (
    <motion.div className="absolute" style={{ bottom: 50, width: 18, height: 20 }} animate={{ left: [10, 90, 90, 10, 10], scaleX: [1, 1, -1, -1, 1] }} transition={{ repeat: Infinity, duration: 16, times: [0, 0.45, 0.5, 0.95, 1], ease: 'linear' }} aria-hidden="true">
      <span className="absolute bottom-[3px] left-[2px] block h-[12px] w-[14px] border-2 border-black bg-white" />
      <span className="absolute left-[10px] top-0 block h-[8px] w-[8px] border-2 border-black bg-white" />
      <span className="absolute left-[16px] top-[3px] block h-[4px] w-[4px] bg-[#e8a020]" />
      <span className="absolute left-[12px] top-[7px] block h-[3px] w-[3px] bg-[#d02020]" />
    </motion.div>
  );
}

function Villager({ x, show, reduce }: { x: number; show: boolean; reduce: boolean }) {
  return (
    <motion.div className="absolute z-10" style={{ bottom: CELL, width: 18, height: 40 }} initial={false}
      animate={{ left: show ? x : -40, opacity: show ? 1 : 0 }} transition={reduce ? { duration: 0 } : { duration: 2.2, ease: 'linear' }} aria-hidden="true">
      <span className="absolute left-[3px] top-0 block h-[14px] w-[12px] border-2 border-black bg-[#c9976a]" />
      <span className="absolute left-[7px] top-[8px] block h-[6px] w-[4px] bg-[#a8764e]" />
      <span className="absolute left-0 top-[14px] block h-[18px] w-[18px] border-2 border-black bg-[#7a5a3a]" />
      <span className="absolute bottom-0 left-[2px] block h-[8px] w-[14px] bg-[#3a2a1a]" />
    </motion.div>
  );
}

/** The experience entry, told as a house that builds itself block by block: one layer per responsibility. */
export function ExperienceBuild() {
  const reduce = useReducedMotion();
  const role = experience[0];
  const blocks = useMemo(() => houseBlocks(), []);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const { night } = useGame();
  const [run, setRun] = useState(0);
  const [mined, setMined] = useState<Set<number>>(() => new Set());
  const [drops, setDrops] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [hot, setHot] = useState<number | null>(null);
  const dropId = useRef(0);
  const [built, setStage] = useState(0); // 0 = nothing, 1..4 = layers built, 5 = villager home
  const stage = reduce ? 5 : built;
  const fit = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // The scene is drawn at a fixed size; on narrow screens it is scaled down to fit.
  useEffect(() => {
    const el = fit.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / SCENE_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const started = useRef(false);

  // Build once when the scene scrolls into view, and again whenever the visitor presses REBUILD.
  useEffect(() => {
    if (!role || reduce) return;
    if (!inView && !started.current) return;
    started.current = true;
    const timers: number[] = [window.setTimeout(() => setStage(0), 0)];
    const perLayer = [blocks.filter((b) => b.layer === 0).length, blocks.filter((b) => b.layer === 1).length, blocks.filter((b) => b.layer === 2).length, blocks.filter((b) => b.layer === 3).length];
    let t = 400;
    perLayer.forEach((n, i) => { t += n * DROP_MS + 500; timers.push(window.setTimeout(() => setStage(i + 1), t)); });
    timers.push(window.setTimeout(() => setStage(5), t + 400));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, run, reduce, blocks, role]);

  if (!role) return null;
  const order = (b: Block) => {
    const before = blocks.filter((o) => o.layer < b.layer).length;
    return before + blocks.filter((o) => o.layer === b.layer).indexOf(b);
  };
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeading index="05" label="Student organisation" title="Experience" id="experience-title" />
        <p className="label-mono mt-8 text-mist-muted">{role.organization} · {role.context}</p>

        <div ref={ref} className="mt-8 grid items-end gap-10 lg:grid-cols-[auto_1fr]">
          <div className="mx-auto w-full min-w-0 max-w-[600px] lg:w-[600px]">
            <div ref={fit} className="relative" style={{ width: '100%', maxWidth: SCENE_W, height: (9 * CELL + 70) * scale }}>
            <div className="overflow-hidden border-4 border-black" style={{ position: 'absolute', left: 0, top: 0, width: SCENE_W, height: 9 * CELL + 70, transform: `scale(${scale})`, transformOrigin: 'top left', background: night ? 'linear-gradient(#070b22, #1a2150)' : 'linear-gradient(#5E95F2, #bfe0ff)' }}>
              <Sky night={night} />
              <div className="absolute" style={{ left: HOUSE_X, top: 20, width: COLS * CELL, height: 9 * CELL }}>
                <Smoke on={stage >= 3} />
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
                      left: b.x * CELL, top: b.y * CELL, width: CELL, height: CELL, background: b.glass && night ? '#ffd86b' : b.color,
                      boxShadow: `inset 3px 3px 0 #fff3, inset -3px -3px 0 #0003${b.glass && night ? ', 0 0 14px 4px #ffd86b99' : ''}`,
                      outline: hot === b.layer ? '2px solid #ffff55' : 'none', outlineOffset: -2,
                    }}
                    initial={reduce ? false : { y: -260, opacity: 0 }}
                    animate={mined.has(i) ? { scale: 0, rotate: 40, opacity: 0 } : stage > 0 || reduce ? { y: 0, opacity: 1, scale: 1, rotate: 0 } : { y: -260, opacity: 0 }}
                    transition={mined.has(i) ? { duration: 0.25 } : { delay: reduce ? 0 : (order(b) * DROP_MS) / 1000, type: 'spring', stiffness: 220, damping: 18 }} />
                ))}
                <Torch night={night} x={4 * CELL + 4} y={6 * CELL + 2} show={stage >= 4} />
                <AnimatePresence>
                  {drops.map((d) => (
                    <motion.span key={d.id} aria-hidden="true" className="pointer-events-none absolute block h-3 w-3 border border-black" style={{ left: d.x - 6, top: d.y, background: d.color }}
                      initial={{ y: 0, opacity: 1 }} animate={{ y: [-30, 0, -12, 0], x: [0, 8, 14, 18], opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} />
                  ))}
                </AnimatePresence>
                <Villager x={stage >= 5 ? 5 * CELL + 6 : 0} show={stage >= 4} reduce={reduce} />
              </div>
              {[24, 470].map((x, i) => <Tree key={x} x={x} flip={i === 1} grow={stage >= 1 || reduce} />)}
              <Chicken />
              <div className="absolute inset-x-0 bottom-0" style={{ height: 50, background: 'repeating-linear-gradient(90deg,#5a8a3a 0 30px,#4f7d33 30px 60px)', borderTop: '6px solid #6fae4a' }} aria-hidden="true" />
              <p className="label-mono absolute left-2 top-2 bg-black/60 px-2 py-1 text-white">BLOCKS MINED · {mined.size}</p>
              {stage >= 5 && mined.size === 0 && <p className="label-mono absolute bottom-14 right-2 bg-black/60 px-2 py-1 text-[#ffff55]">CLICK A BLOCK TO MINE IT</p>}
            </div>
            </div>
            <button type="button" className="label-mono mc-slot mt-4 px-4 py-2 text-white" onClick={() => { setMined(new Set()); setRun((n) => n + 1); }}>REBUILD</button>
            <p className="label-mono mt-2 max-w-[37rem] text-mist-muted">Click a block to mine it. This scene is a toy: the text beside it has everything.</p>
          </div>

          <ol className="grid gap-3" aria-label="Responsibilities">
            {role.responsibilities.map((r, i) => {
              const built = stage > i;
              return (
                <motion.li key={r.topic} className={`mc-card flex items-start gap-4 p-4 ${hot === i ? 'outline outline-2 outline-[#ffff55]' : ''}`} animate={{ opacity: built ? 1 : 0.35, x: built ? (hot === i ? -8 : 0) : 12 }} transition={{ duration: 0.4 }}>
                  <span className="mt-1 block h-6 w-6 shrink-0 border-[3px] border-black" style={{ background: LAYER_COLORS[i] }} aria-hidden="true" />
                  <span>
                    <span className="block font-pixel text-lg uppercase text-white">{['Foundation', 'Walls', 'Roof', 'Door'][i]} · {r.topic}</span>
                    <span className="block text-mist-muted">{r.detail}</span>
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
