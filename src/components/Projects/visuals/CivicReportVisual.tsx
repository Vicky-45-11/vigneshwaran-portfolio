import { AnimatePresence, motion } from 'framer-motion';
import { VisualFrame } from './VisualFrame';
import { useCycle } from './useCycle';

// Civic-report panel on a street-grid map. A radar sweep rotates, reports drop
// onto the map one by one with a ripple, similar pins cluster into a ring, and a
// ticket card moves its status from Reported to Resolved. Sample data only.

const PINS = [
  { x: 18, y: 28, kind: 'Pothole' },
  { x: 62, y: 20, kind: 'Streetlight' },
  { x: 44, y: 60, kind: 'Water leak' },
  { x: 80, y: 52, kind: 'Overflowing bin' },
  { x: 49, y: 56, kind: 'Water leak' },
];
const STAGES = ['Reported', 'Reviewed', 'Assigned', 'Resolved'];

export function CivicReportVisual() {
  const { ref, step, reduce } = useCycle(PINS.length * 4 + 4, 900);
  const shown = Math.min(PINS.length, Math.floor(step / 3) + 1);
  const stage = Math.min(STAGES.length - 1, Math.max(0, step - 8) % 5);
  const merged = shown >= PINS.length;
  const focus = PINS[2];
  return (
    <VisualFrame title="issue_map.live" frameRef={ref}>
      <div className="flex h-full flex-col gap-3">
        <div className="relative min-h-[11rem] flex-1 overflow-hidden border border-line bg-[#0c1218]" aria-hidden="true">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((v) => (
              <g key={v}><line x1={v} y1="0" x2={v} y2="100" stroke="#fff" strokeOpacity="0.05" /><line x1="0" y1={v} x2="100" y2={v} stroke="#fff" strokeOpacity="0.05" /></g>
            ))}
            <polyline points="0,46 34,46 34,70 70,70 70,0" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="1.6" />
            <polyline points="0,18 22,18 22,100" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="1" />
            <polyline points="100,36 58,36 58,100" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="1" />
          </svg>
          {!reduce && (
            <motion.div
              className="absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2"
              style={{ background: 'conic-gradient(from 0deg, rgba(124,255,107,0) 0deg, rgba(124,255,107,0.18) 40deg, rgba(124,255,107,0) 41deg)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
          )}
          <AnimatePresence>
            {PINS.slice(0, shown).map((p, i) => {
              const isFocus = i === 2 || i === 4;
              return (
                <motion.span
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  initial={{ y: -40, opacity: 0, scale: 1.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 14 }}
                >
                  <span className={`block h-3 w-3 ${isFocus && merged ? 'bg-[#ffd447]' : 'bg-accent-light'}`} />
                  {!reduce && <span className="absolute inset-0 animate-ping bg-accent-light/50" style={{ animationDuration: '2.4s', animationDelay: `${i * 0.3}s` }} />}
                </motion.span>
              );
            })}
          </AnimatePresence>
          {merged && (
            <motion.span
              className="absolute -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-[#ffd447]"
              style={{ left: '46.5%', top: '58%', width: 46, height: 30 }}
              initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            />
          )}
          <span className="label-mono absolute bottom-2 left-2 text-[0.6rem] text-mist-muted">sample data</span>
          {merged && <span className="label-mono absolute right-2 top-2 border border-[#ffd447] px-1.5 py-0.5 text-[0.58rem] text-[#ffd447]">possible duplicate</span>}
        </div>
        <div className="border border-line p-2">
          <p className="label-mono mb-1.5 flex justify-between text-white"><span>{focus.kind}</span><span className="text-mist-muted">#{String(shown).padStart(3, '0')}</span></p>
          <div className="grid grid-cols-4 gap-1">
            {STAGES.map((s, i) => (
              <div key={s} className="relative">
                <div className="h-1.5 bg-line" />
                <motion.div className="absolute inset-y-0 left-0 bg-accent-light" initial={false} animate={{ width: merged && i <= stage ? '100%' : '0%' }} transition={{ duration: reduce ? 0 : 0.5 }} />
                <span className={`label-mono mt-1 block text-[0.55rem] ${merged && i === stage ? 'text-accent-light' : 'text-mist-muted'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
