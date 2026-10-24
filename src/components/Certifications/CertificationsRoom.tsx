import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { certifications } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// One item frame per certificate, filled one after another. The names and areas come straight from the portfolio data.
const STEP_MS = 850;
const AREA_COLORS = ['#38e8ff', '#9a6bff', '#5dff9a', '#ff9f3d', '#ff3da8', '#ffd23f'];

/** A certificate hanging in an item frame: paper, a coloured band for its area, and an enchantment glint. */
function Frame({ i, name, area, color, placed, active, onPick }: { i: number; name: string; area: string; color: string; placed: boolean; active: boolean; onPick: () => void }) {
  return (
    <li className="relative flex flex-col items-center">
      <button type="button" onClick={onPick} disabled={!placed} aria-pressed={active} aria-label={`Certificate ${i + 1}: ${name}, ${area}`}
        className="group relative block h-[104px] w-[84px] border-[5px] border-[#4a2f14] bg-[#8b5a2b] p-1 shadow-[inset_0_0_0_2px_#b8864b] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffff55]"
        style={{ boxShadow: active ? '0 0 0 3px #ffff55, inset 0 0 0 2px #b8864b' : undefined }}>
        <motion.span className="relative block h-full w-full overflow-hidden border-2 border-black bg-[#efe6c8]" initial={false}
          animate={placed ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0, opacity: 0, rotate: -30 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}>
          <span className="absolute inset-x-0 top-0 block h-3.5" style={{ background: color }} />
          <span className="absolute left-1.5 right-1.5 top-6 block h-1 bg-black/30" />
          <span className="absolute left-1.5 right-4 top-9 block h-1 bg-black/30" />
          <span className="absolute left-1.5 right-1.5 top-12 block h-1 bg-black/30" />
          <span className="absolute bottom-1.5 right-1.5 block h-5 w-5 rounded-full border-2 border-black" style={{ background: color }} />
          <span className="absolute bottom-1 left-1.5 font-pixel text-sm text-black/70">{String(i + 1).padStart(2, '0')}</span>
          {placed && <motion.span className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(115deg, transparent 35%, #c8a0ff99 50%, transparent 65%)' }} animate={{ x: ['-120%', '120%'] }} transition={{ repeat: Infinity, duration: 2.6, ease: 'linear', delay: i * 0.4 }} />}
        </motion.span>
      </button>
      {placed && [0, 1, 2].map((k) => (
        <motion.span key={k} aria-hidden="true" className="pointer-events-none absolute bottom-6 block h-2 w-2 rounded-full bg-[#7bff3a]" style={{ left: 18 + k * 18, boxShadow: '0 0 8px 2px #7bff3a99' }}
          initial={{ y: 0, opacity: 1 }} animate={{ y: -70 - k * 10, opacity: 0 }} transition={{ duration: 1.1, delay: k * 0.12 }} />
      ))}
      <span className="mt-1 block h-3 w-14 border-2 border-black bg-[#7d7d85]" aria-hidden="true" />
    </li>
  );
}

/** The certifications, told as a trophy room: item frames fill up one by one, click a frame to read the certificate. */
export function CertificationsRoom() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const [run, setRun] = useState(0);
  const [placed, setPlaced] = useState(0);
  const [active, setActive] = useState(0);
  const started = useRef(false);
  const shown = reduce ? certifications.length : placed;

  // Fill the frames once when the room scrolls into view, and again when the visitor presses REFILL.
  useEffect(() => {
    if (reduce) return;
    if (!inView && !started.current) return;
    started.current = true;
    const timers: number[] = [window.setTimeout(() => { setPlaced(0); setActive(0); }, 0)];
    certifications.forEach((_, i) => timers.push(window.setTimeout(() => { setPlaced(i + 1); setActive(i); }, 500 + i * STEP_MS)));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, run, reduce]);

  const areas = [...new Set(certifications.map((c) => c.area))];
  const current = certifications[active];
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeading index="07" label="Continued learning" title="Certifications" id="certifications-title" />

        <div ref={ref} className="mt-12">
          <div className="relative border-4 border-black px-3 pb-6 pt-8 sm:px-8" style={{ background: 'repeating-linear-gradient(90deg,#4a3320 0 48px,#3f2b1a 48px 96px)' }}>
            <div className="absolute inset-x-0 top-0 h-3 bg-[#2a1c10]" aria-hidden="true" />
            <p className="label-mono absolute left-3 top-4 bg-black/60 px-2 py-1 text-white">CERTIFICATES COLLECTED · {shown} / {certifications.length}</p>
            <ul key={run} className="mt-8 flex flex-wrap items-end justify-center gap-x-4 gap-y-8 sm:gap-x-8" aria-label="Certificates">
              {certifications.map((c, i) => (
                <Frame key={c.name} i={i} name={c.name} area={c.area} color={AREA_COLORS[areas.indexOf(c.area) % AREA_COLORS.length]} placed={i < shown} active={i === active && shown > 0} onPick={() => setActive(i)} />
              ))}
            </ul>
            <div className="absolute inset-x-0 bottom-0 h-3 bg-[#5a8a3a]" aria-hidden="true" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(0,22rem)]">
            <div className="mc-card p-5 sm:p-6" aria-live="polite">
              <p className="label-mono text-accent-light">{shown > 0 ? `CERTIFICATE ${String(active + 1).padStart(2, '0')} / ${String(certifications.length).padStart(2, '0')}` : 'THE ROOM IS EMPTY'}</p>
              {shown > 0 && current && (
                <>
                  <p className="mt-2 flex items-start gap-3 font-pixel text-xl uppercase leading-snug text-white sm:text-2xl"><Award size={22} className="mt-1 shrink-0 text-accent-light" aria-hidden="true" />{current.name}</p>
                  <p className="label-mono mt-2 text-mist-muted">{current.area}</p>
                </>
              )}
              <button type="button" className="label-mono mc-slot mt-5 px-4 py-2 text-white" onClick={() => setRun((n) => n + 1)}>REFILL THE FRAMES</button>
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
