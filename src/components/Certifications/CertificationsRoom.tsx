import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Award } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { certifications } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// A library with an enchanting table. Each certificate flies from the table into its own item frame.
// The names and areas come straight from the portfolio data; the rest is decoration.
const START_MS = 700;
const STEP_MS = 1150;
const FLIGHT_S = 0.75;
const AREA_COLORS = ['#38e8ff', '#9a6bff', '#5dff9a', '#ff9f3d', '#ff3da8', '#ffd23f'];
const RUNES = ['ᛉ', 'ᚦ', 'ᛟ', 'ᚨ', 'ᚷ', 'ᛁ'];
const BOOKS = ['#7a2a2a', '#2a4a7a', '#2f6a3a', '#6a4a2a', '#5a2a6a', '#8a6a2a'];

/** Percentage position of frame i along the back wall. */
const frameLeft = (i: number, n: number) => `${((i + 0.5) / n) * 100}%`;

function Bookshelf() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[17%] items-end gap-[3px] border-b-4 border-[#2a1c10] bg-[#2a1c10] px-2" aria-hidden="true">
      {Array.from({ length: 46 }, (_, k) => (
        <span key={k} className="block flex-1 border border-black/50" style={{ height: `${58 + ((k * 37) % 42)}%`, background: BOOKS[(k * 5) % BOOKS.length] }} />
      ))}
    </div>
  );
}

function Torch({ left }: { left: string }) {
  return (
    <span className="pointer-events-none absolute bottom-[34%] block" style={{ left, width: 8, height: 30 }} aria-hidden="true">
      <span className="absolute inset-x-0 bottom-0 block h-5 bg-[#6a4a2a]" />
      <motion.span className="absolute inset-x-0 top-0 block h-3 bg-[#ffcf3a]" animate={{ opacity: [1, 0.7, 1], boxShadow: ['0 0 26px 10px #ffb02e88', '0 0 36px 14px #ffb02e55', '0 0 26px 10px #ffb02e88'] }} transition={{ repeat: Infinity, duration: 1.2 }} />
    </span>
  );
}

/** The enchanting table: obsidian base, red cloth top, a book that floats and glyphs that rise. */
function Table() {
  return (
    <div className="pointer-events-none absolute bottom-[5%] left-1/2 h-[18%] w-[11%] min-w-[54px] -translate-x-1/2" aria-hidden="true">
      <span className="absolute inset-x-0 bottom-0 block h-[60%] border-[3px] border-black bg-[#2a1a4a]" />
      <span className="absolute inset-x-[-4%] bottom-[48%] block h-[30%] border-[3px] border-black bg-[#b02030]" />
      <motion.span className="absolute left-[28%] top-[-22%] block h-[26%] w-[44%] border-2 border-black bg-[#e8dcb0]" animate={{ y: [0, -9, 0], rotate: [-7, 7, -7] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }} />
      {RUNES.map((g, k) => (
        <motion.span key={g} className="absolute font-pixel text-base text-[#c8a0ff]" style={{ left: `${6 + k * 15}%`, top: '-10%' }} animate={{ y: [0, -70 - (k % 3) * 14], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.8, delay: k * 0.45 }}>{g}</motion.span>
      ))}
    </div>
  );
}

/** A certificate hanging in an item frame: paper, a coloured band for its area, and a glint. */
function Frame({ i, n, name, area, color, placed, active, tip, setTip, onPick, onKey, btnRef }: {
  i: number; n: number; name: string; area: string; color: string; placed: boolean; active: boolean; tip: boolean;
  setTip: (v: boolean) => void; onPick: () => void; onKey: (e: React.KeyboardEvent) => void; btnRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <li className="absolute top-[26%] w-[15%] -translate-x-1/2" style={{ left: frameLeft(i, n) }}>
      <button ref={btnRef} type="button" onClick={onPick} onKeyDown={onKey} disabled={!placed} aria-pressed={active} aria-label={`Certificate ${i + 1}: ${name}, ${area}`}
        onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)} onFocus={() => setTip(true)} onBlur={() => setTip(false)}
        className="group relative mx-auto block aspect-[84/104] w-full border-[5px] border-[#4a2f14] bg-[#8b5a2b] p-[3px] outline-none transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffff55] enabled:hover:-translate-y-1"
        style={{ boxShadow: active ? '0 0 0 3px #ffff55, 0 0 24px 6px #ffff5566, inset 0 0 0 2px #b8864b' : 'inset 0 0 0 2px #b8864b' }}>
        <motion.span className="relative block h-full w-full overflow-hidden border-2 border-black bg-[#efe6c8]" initial={false}
          animate={placed ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0, opacity: 0, rotate: -30 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: placed ? FLIGHT_S - 0.1 : 0 }}>
          <span className="absolute inset-x-0 top-0 block h-[14%]" style={{ background: color }} />
          <span className="absolute inset-x-[10%] top-[26%] block h-[5%] bg-black/30" />
          <span className="absolute left-[10%] right-[24%] top-[38%] block h-[5%] bg-black/30" />
          <span className="absolute inset-x-[10%] top-[50%] block h-[5%] bg-black/30" />
          <span className="absolute bottom-[8%] right-[9%] block aspect-square w-[24%] rounded-full border-2 border-black" style={{ background: color }} />
          <span className="absolute bottom-[6%] left-[10%] font-pixel text-sm text-black/70">{String(i + 1).padStart(2, '0')}</span>
          {placed && <motion.span className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(115deg, transparent 35%, #c8a0ffaa 50%, transparent 65%)' }} animate={{ x: ['-120%', '120%'] }} transition={{ repeat: Infinity, duration: 2.6, ease: 'linear', delay: i * 0.4 }} />}
        </motion.span>
      </button>
      {placed && [0, 1, 2, 3].map((k) => (
        <motion.span key={k} aria-hidden="true" className="pointer-events-none absolute top-1/2 block h-2 w-2 rounded-full bg-[#7bff3a]" style={{ left: `${20 + k * 20}%`, boxShadow: '0 0 8px 2px #7bff3a99' }}
          initial={{ y: 0, opacity: 0 }} animate={{ y: -90 - k * 10, opacity: [0, 1, 0] }} transition={{ duration: 1.2, delay: FLIGHT_S + k * 0.1 }} />
      ))}
      <AnimatePresence>
        {tip && placed && (
          <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} role="presentation"
            className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-[220px] -translate-x-1/2 border-2 border-[#2d0a63] bg-[#100010]/95 px-2 py-1.5 text-left">
            <span className="block font-pixel text-sm leading-tight text-white">{name}</span>
            <span className="block font-pixel text-xs text-[#a8a8a8]">{area}</span>
            <span className="block font-pixel text-xs text-[#5555ff]">Certificate {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Paper that flies from the table to its frame, once, when the frame is filled. */
function Flight({ i, n, color }: { i: number; n: number; color: string }) {
  return (
    <motion.span aria-hidden="true" className="pointer-events-none absolute z-10 block h-7 w-5 -translate-x-1/2 border-2 border-black"
      style={{ background: `linear-gradient(${color} 22%, #efe6c8 22%)`, boxShadow: '0 0 14px 4px #c8a0ffaa' }}
      initial={{ left: '50%', top: '72%', opacity: 1, rotate: 0, scale: 0.8 }}
      animate={{ left: frameLeft(i, n), top: ['72%', '14%', '40%'], opacity: [1, 1, 0], rotate: [0, 200, 360], scale: [0.8, 1.1, 1] }}
      transition={{ duration: FLIGHT_S, ease: 'easeInOut', times: [0, 0.55, 1] }} />
  );
}

/** The certifications, told as an enchanting library: certificates fly into item frames, hover or focus one to read it. */
export function CertificationsRoom() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const [run, setRun] = useState(0);
  const [placed, setPlaced] = useState(0);
  const [active, setActive] = useState(0);
  const [tip, setTip] = useState<number | null>(null);
  const started = useRef(false);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const n = certifications.length;
  const shown = reduce ? n : placed;
  const done = shown === n;

  // Fill the frames once when the room scrolls into view, and again when the visitor presses REFILL.
  useEffect(() => {
    if (reduce) return;
    if (!inView && !started.current) return;
    started.current = true;
    const timers: number[] = [window.setTimeout(() => { setPlaced(0); setActive(0); }, 0)];
    certifications.forEach((_, i) => timers.push(window.setTimeout(() => { setPlaced(i + 1); setActive(i); }, START_MS + i * STEP_MS)));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, run, reduce]);

  const areas = [...new Set(certifications.map((c) => c.area))];
  const current = certifications[active];
  const move = (from: number, d: number) => (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = Math.min(shown - 1, Math.max(0, from + (e.key === 'ArrowRight' ? d : -d)));
    btns.current[next]?.focus();
    setActive(next);
  };
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeading index="07" label="Continued learning" title="Certifications" id="certifications-title" />

        <div ref={ref} className="mt-12">
          <div className="relative aspect-[4/3] min-h-[320px] w-full overflow-hidden border-4 border-black sm:aspect-[16/8]" style={{ background: 'repeating-linear-gradient(90deg,#4a3320 0 48px,#3f2b1a 48px 96px)' }}>
            <Bookshelf />
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 60%, transparent 35%, #000a 100%)' }} aria-hidden="true" />
            <Torch left="3%" />
            <Torch left="96%" />
            <div className="absolute inset-x-0 bottom-0 h-[8%] bg-[#5a8a3a]" style={{ borderTop: '5px solid #6fae4a' }} aria-hidden="true" />
            <Table />

            <p className="label-mono absolute left-2 top-[19%] z-10 bg-black/60 px-2 py-1 text-white">CERTIFICATES · {shown} / {n}</p>
            <div className="absolute left-2 right-2 top-[28%] z-10 hidden" aria-hidden="true" />
            <ul key={run} aria-label="Certificates">
              {certifications.map((c, i) => (
                <Frame key={c.name} i={i} n={n} name={c.name} area={c.area} color={AREA_COLORS[areas.indexOf(c.area) % AREA_COLORS.length]} placed={i < shown} active={i === active && shown > 0}
                  tip={tip === i} setTip={(v) => setTip(v ? i : null)} onPick={() => setActive(i)} onKey={move(i, 1)} btnRef={(el) => { btns.current[i] = el; }} />
              ))}
            </ul>
            {!reduce && certifications.map((c, i) => (i < shown ? <Flight key={`${run}-${i}`} i={i} n={n} color={AREA_COLORS[areas.indexOf(c.area) % AREA_COLORS.length]} /> : null))}

            <div className="absolute bottom-[2%] left-2 right-2 z-10" aria-hidden="true">
              <div className="h-3 border-2 border-black bg-[#1f2a14]"><motion.div className="h-full bg-[#7bd93a]" animate={{ width: `${(shown / n) * 100}%` }} transition={{ duration: 0.5 }} /></div>
            </div>
            <AnimatePresence>
              {done && !reduce && (
                <motion.div key="toast" initial={{ x: 280, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: FLIGHT_S + 0.3, type: 'spring', stiffness: 160, damping: 18 }}
                  className="mc-toast absolute right-2 top-[19%] z-20" role="status">
                  <span className="label-mono block text-[#ffff55]">Advancement Made!</span>
                  <span className="block font-pixel text-sm text-white">All {n} certificates collected</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(0,22rem)]">
            <div className="mc-card p-5 sm:p-6" aria-live="polite">
              <p className="label-mono text-accent-light">{shown > 0 ? `CERTIFICATE ${String(active + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}` : 'THE LIBRARY IS WAITING'}</p>
              {shown > 0 && current && (
                <>
                  <p className="mt-2 flex items-start gap-3 font-pixel text-xl uppercase leading-snug text-white sm:text-2xl"><Award size={22} className="mt-1 shrink-0 text-accent-light" aria-hidden="true" />{current.name}</p>
                  <p className="label-mono mt-2 text-mist-muted">{current.area}</p>
                </>
              )}
              <button type="button" className="label-mono mc-slot mt-5 px-4 py-2 text-white" onClick={() => setRun((r) => r + 1)}>REPLAY THE ENCHANTING</button>
              <p className="label-mono mt-3 text-mist-muted">Hover or focus a frame to read it · ← → to move</p>
            </div>
            <ul className="mc-card grid gap-2 p-5" aria-label="Areas">
              {areas.map((a, k) => (
                <li key={a} className="flex items-center gap-3 text-mist-muted">
                  <span className="block h-4 w-4 border-2 border-black" style={{ background: AREA_COLORS[k % AREA_COLORS.length] }} aria-hidden="true" />
                  <span className="label-mono">{a} · {certifications.filter((c) => c.area === a).length}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
