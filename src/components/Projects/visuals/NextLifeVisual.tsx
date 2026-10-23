import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VisualFrame } from './VisualFrame';
import { useCycle } from './useCycle';

// A circular-economy loop. A device token travels the ring, stopping at five
// "next life" routes (repair, reuse, refurbish, donate, recycle). The active
// node lights up and its note swaps in at the centre. Hover or tap a node to
// take over. Demo content only; no analysis is performed.

const ROUTES = [
  { name: 'Repair', note: 'Fix the fault and keep using it' },
  { name: 'Reuse', note: 'Repurpose it for a new job' },
  { name: 'Refurbish', note: 'Restore it and pass it on' },
  { name: 'Donate', note: 'Give it to someone who needs it' },
  { name: 'Recycle', note: 'Recover the materials safely' },
];
const C = 100, RAD = 78;
const pos = (i: number) => { const a = (i / ROUTES.length) * Math.PI * 2 - Math.PI / 2; return [C + Math.cos(a) * RAD, C + Math.sin(a) * RAD] as const; };

export function NextLifeVisual() {
  const { ref, step, setStep, reduce } = useCycle(ROUTES.length, 2200);
  const [held, setHeld] = useState<number | null>(null);
  const idx = held ?? step;
  const [x, y] = pos(idx);
  const route = ROUTES[idx];
  return (
    <VisualFrame title="next_life.analysis" frameRef={ref}>
      <div className="flex h-full flex-col items-center justify-center">
        <svg viewBox="-14 -14 228 228" className="max-h-[21rem] w-full" role="presentation">
          <circle cx={C} cy={C} r={RAD} fill="none" stroke="#7cff6b" strokeOpacity="0.25" strokeDasharray="2 5" />
          {!reduce && (
            <motion.circle cx={C} cy={C} r={RAD} fill="none" stroke="#7cff6b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="14 460" animate={{ rotate: 360 }} style={{ originX: '100px', originY: '100px' }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
          )}
          <circle cx={C} cy={C} r="46" fill="#0b1410" stroke="#fff" strokeOpacity="0.12" />
          {ROUTES.map((r, i) => {
            const [nx, ny] = pos(i); const on = i === idx;
            return (
              <g key={r.name} transform={`translate(${nx} ${ny})`} onMouseEnter={() => { setHeld(i); setStep(i); }} onMouseLeave={() => setHeld(null)} onClick={() => { setHeld(i); setStep(i); }} className="cursor-pointer">
                <motion.rect x="-7" y="-7" width="14" height="14" animate={{ fill: on ? '#ffd447' : '#10201a', scale: on ? 1.25 : 1 }} stroke={on ? '#ffd447' : '#7cff6b'} strokeOpacity={on ? 1 : 0.5} />
                <text y={ny < C ? -14 : 20} textAnchor="middle" fill={on ? '#ffd447' : '#9aa8a0'} style={{ fontFamily: 'VT323, ui-monospace, monospace', fontSize: 9, letterSpacing: 0.5 }}>{r.name.toUpperCase()}</text>
              </g>
            );
          })}
          <motion.rect width="9" height="9" fill="#fff" animate={{ x: x - 4.5, y: y - 4.5 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }} />
          <AnimatePresence mode="wait">
            <motion.g key={idx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: reduce ? 0 : 0.25 }}>
              <text x={C} y={C - 4} textAnchor="middle" fill="#fff" style={{ fontFamily: 'VT323, ui-monospace, monospace', fontSize: 11, letterSpacing: 0.5 }}>{route.name.toUpperCase()}</text>
              <foreignObject x={C - 40} y={C} width="80" height="40"><p className="text-center text-[6.5px] leading-tight text-[#9aa8a0]">{route.note}</p></foreignObject>
            </motion.g>
          </AnimatePresence>
        </svg>
        <p className="label-mono text-mist-muted" aria-hidden="true">old_phone.jpg // demo routes</p>
      </div>
    </VisualFrame>
  );
}
