import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { projects } from '../../data/portfolio';
import { openSpotlight } from './spotlightEvents';

type Tab = 'eggs' | 'map' | 'redstone' | 'boss' | 'cart';
const TABS: [Tab, string][] = [['eggs', 'SPAWN EGGS'], ['map', 'MAP ROOM'], ['redstone', 'REDSTONE'], ['boss', 'BOSS STATS'], ['cart', 'MINECART']];
const COLORS = ['#38e8ff', '#9a6bff', '#5dff9a', '#4aa8ff', '#ff9f3d', '#ff3da8', '#ffd23f'];
// Decorative pin positions on the pixel map, in a 600 x 300 box.
const PINS: [number, number][] = [[90, 210], [170, 90], [270, 200], [350, 80], [430, 190], [510, 90], [550, 230]];
const RIDE_STEP_MS = 3200;

// Technologies used by more than one project, and which projects share them. Straight from the portfolio data.
function sharedTech() {
  const map = new Map<string, number[]>();
  projects.forEach((p, i) => p.technologies.forEach((t) => map.set(t, [...(map.get(t) ?? []), i])));
  return [...map.entries()].filter(([, v]) => v.length > 1);
}

function Egg({ i, found, onPick }: { i: number; found: boolean; onPick: () => void }) {
  const p = projects[i];
  return (
    <li>
      <button type="button" onClick={onPick} className="group flex w-full flex-col items-center gap-2 p-2" aria-label={found ? `${p.title}, discovered` : `Undiscovered project ${p.number}`}>
        <span
          className="relative block h-24 w-[4.5rem] rounded-[50%_50%_46%_46%/62%_62%_38%_38%] border-[3px] border-black transition-transform group-hover:-translate-y-1"
          style={{ background: found ? COLORS[i % COLORS.length] : '#2a2a30', filter: found ? 'none' : 'grayscale(1) brightness(0.55)' }}
        >
          {[[22, 26], [52, 40], [30, 60], [58, 66]].map(([x, y], k) => (
            <span key={k} className="absolute block h-3 w-3 bg-black/45" style={{ left: x, top: y }} />
          ))}
          {!found && <span className="absolute inset-0 flex items-center justify-center font-pixel text-2xl text-white/70">?</span>}
        </span>
        <span className="label-mono text-center text-white">{found ? p.title : `Project ${p.number}`}</span>
      </button>
    </li>
  );
}

function Eggs({ found, discover }: { found: Set<number>; discover: (i: number) => void }) {
  return (
    <div>
      <p className="label-mono text-[#ffff55]">COLLECTION · {found.size} / {projects.length} DISCOVERED</p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {projects.map((_, i) => <Egg key={i} i={i} found={found.has(i)} onPick={() => { discover(i); openSpotlight(i); }} />)}
      </ul>
    </div>
  );
}

function MapRoom({ discover }: { discover: (i: number) => void }) {
  return (
    <div className="relative mx-auto aspect-[2/1] w-full max-w-4xl overflow-hidden border-4 border-black bg-[#6fae4a]" style={{ backgroundImage: 'linear-gradient(#0000 49%, #0002 50%), linear-gradient(90deg, #0000 49%, #0002 50%)', backgroundSize: '24px 24px' }}>
      <svg viewBox="0 0 600 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M0 150 C100 110 160 190 260 150 S420 110 600 170" fill="none" stroke="#3b82c4" strokeWidth="26" opacity="0.85" />
        <path d={PINS.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke="#8b5a2b" strokeWidth="5" strokeDasharray="10 8" />
      </svg>
      {projects.map((p, i) => (
        <button key={p.id} type="button" onClick={() => { discover(i); openSpotlight(i); }} aria-label={`Map pin ${p.number}: ${p.title}`}
          className="group absolute -translate-x-1/2 -translate-y-full" style={{ left: `${(PINS[i][0] / 600) * 100}%`, top: `${(PINS[i][1] / 300) * 100}%` }}>
          <span className="block border-[3px] border-black px-2 py-1 font-pixel text-sm text-black transition-transform group-hover:-translate-y-1" style={{ background: COLORS[i % COLORS.length] }}>{p.number}</span>
          <span className="mx-auto block h-3 w-1 bg-black" />
          <span className="pointer-events-none absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap bg-black/85 px-2 py-1 font-pixel text-xs text-white group-hover:block group-focus-visible:block">{p.title}</span>
        </button>
      ))}
    </div>
  );
}

function Redstone() {
  const shared = useMemo(() => sharedTech(), []);
  const [lit, setLit] = useState<string | null>(null);
  const cx = 300, cy = 150, r = 105;
  const pos = projects.map((_, i) => [cx + Math.cos((i / projects.length) * Math.PI * 2 - Math.PI / 2) * r * 1.5, cy + Math.sin((i / projects.length) * Math.PI * 2 - Math.PI / 2) * r] as const);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <svg viewBox="0 0 600 300" className="w-full border-4 border-black bg-[#161618]" role="img" aria-label="Projects connected by shared technologies">
        {shared.flatMap(([tech, ids]) => ids.flatMap((a, k) => ids.slice(k + 1).map((b) => {
          const on = lit === tech;
          return <line key={`${tech}-${a}-${b}`} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} stroke={on ? '#ff3b30' : '#5a1a16'} strokeWidth={on ? 5 : 3} style={{ filter: on ? 'drop-shadow(0 0 6px #ff3b30)' : 'none', transition: 'stroke 200ms' }} />;
        })))}
        {projects.map((p, i) => {
          const hit = lit ? (shared.find(([t]) => t === lit)?.[1] ?? []).includes(i) : false;
          return (
            <g key={p.id}>
              <rect x={pos[i][0] - 18} y={pos[i][1] - 18} width="36" height="36" fill={hit ? '#ff3b30' : '#3a3a40'} stroke="#000" strokeWidth="3" />
              <text x={pos[i][0]} y={pos[i][1] + 6} textAnchor="middle" fontSize="16" fill="#fff" style={{ fontFamily: 'monospace', fontWeight: 700 }}>{p.number}</text>
            </g>
          );
        })}
      </svg>
      <div>
        <p className="label-mono text-[#ffff55]">SHARED TECH · HOVER OR FOCUS TO POWER THE WIRES</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {shared.map(([tech, ids]) => (
            <li key={tech}>
              <button type="button" className={`label-mono mc-slot px-3 py-2 text-white ${lit === tech ? 'mc-slot--active' : ''}`}
                onMouseEnter={() => setLit(tech)} onMouseLeave={() => setLit(null)} onFocus={() => setLit(tech)} onBlur={() => setLit(null)}>
                {tech} · {ids.map((n) => projects[n].number).join(' + ')}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Bars show only what is in the data: how many technologies are listed and whether a public repository is linked.
function Boss() {
  const max = Math.max(...projects.map((p) => p.technologies.length), 1);
  return (
    <div>
      <p className="label-mono text-[#ffff55]">BOSS STATS · FROM THE LISTED DATA, NOT A SCORE</p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {projects.map((p, i) => (
          <li key={p.id} className="mc-card p-4">
            <p className="font-pixel text-lg text-white">{p.number} {p.title}</p>
            {[['STACK', p.technologies.length / max, `${p.technologies.length} listed`], ['SOURCE', p.sourceUrl ? 1 : 0, p.sourceUrl ? 'public repo' : 'link coming']].map(([label, v, text]) => (
              <div key={String(label)} className="mt-2 flex items-center gap-3">
                <span className="label-mono w-16 text-mist-muted">{label}</span>
                <span className="relative h-4 flex-1 border-2 border-black bg-[#3a1010]">
                  <motion.span className="absolute inset-y-0 left-0 block" style={{ background: COLORS[i % COLORS.length] }}
                    initial={{ width: 0 }} whileInView={{ width: `${Math.max(0.04, Number(v)) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.08 * i }} />
                </span>
                <span className="label-mono w-24 text-right text-white">{text}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Minecart({ discover }: { discover: (i: number) => void }) {
  const [at, setAt] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  const stop = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null; setAt(null);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  };
  const ride = () => {
    let i = 0;
    setAt(0); discover(0); openSpotlight(0);
    timer.current = window.setInterval(() => {
      i += 1;
      if (i >= projects.length) { stop(); return; }
      setAt(i); discover(i); openSpotlight(i);
    }, RIDE_STEP_MS);
  };
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);
  const riding = at !== null;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={riding ? stop : ride} className="mc-btn min-h-11 px-5 text-sm">{riding ? 'STOP THE RIDE' : 'RIDE THE MINECART'}</button>
        <p className="label-mono text-mist-muted">A short automatic tour of every project. Takes about {Math.round((projects.length * RIDE_STEP_MS) / 1000)} seconds.</p>
      </div>
      <div className="relative mt-8 h-24" aria-hidden="true">
        <div className="absolute inset-x-0 top-14 h-2 bg-[#6b4b2a]" />
        {projects.map((p, i) => <span key={p.id} className="absolute top-10 h-6 w-2 bg-[#3b2a18]" style={{ left: `calc(${(i / (projects.length - 1)) * 100}% - 4px)` }}><span className="label-mono absolute -top-6 -translate-x-1/3 text-white">{p.number}</span></span>)}
        <motion.span className="absolute top-3 block h-10 w-16 border-[3px] border-black bg-[#9a9aa2]" animate={{ left: `calc(${((at ?? 0) / (projects.length - 1)) * 100}% - 2rem)` }} transition={{ duration: 1.1, ease: 'easeInOut' }}>
          <span className="absolute -bottom-3 left-1 h-4 w-4 rounded-full border-2 border-black bg-[#444]" /><span className="absolute -bottom-3 right-1 h-4 w-4 rounded-full border-2 border-black bg-[#444]" />
        </motion.span>
      </div>
    </div>
  );
}

/** A second way to explore the projects: collect them, find them on a map, wire them up, size them up, or ride past them. */
export function ProjectLab() {
  const [tab, setTab] = useState<Tab>('eggs');
  const [found, setFound] = useState<Set<number>>(() => new Set());
  const discover = (i: number) => setFound((s) => (s.has(i) ? s : new Set(s).add(i)));
  return (
    <section id="project-lab" aria-labelledby="lab-title" className="relative z-10 py-20 sm:py-28">
      <div className="container-editorial">
        <SectionHeading index="04.5" label="Explore the work" title="Project lab" id="lab-title" size="lg" />
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Ways to explore projects">
          {TABS.map(([id, label]) => (
            <button key={id} type="button" role="tab" id={`lab-tab-${id}`} aria-selected={tab === id} aria-controls="lab-panel" onClick={() => setTab(id)}
              className={`label-mono mc-slot px-4 py-2 text-white ${tab === id ? 'mc-slot--active' : ''}`}>{label}</button>
          ))}
        </div>
        <div id="lab-panel" role="tabpanel" aria-labelledby={`lab-tab-${tab}`} className="mc-card mt-6 p-5 sm:p-8">
          {tab === 'eggs' && <Eggs found={found} discover={discover} />}
          {tab === 'map' && <MapRoom discover={discover} />}
          {tab === 'redstone' && <Redstone />}
          {tab === 'boss' && <Boss />}
          {tab === 'cart' && <Minecart discover={discover} />}
        </div>
      </div>
    </section>
  );
}
