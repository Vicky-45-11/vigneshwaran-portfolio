import { VisualFrame } from './VisualFrame';
import { useCycle } from './useCycle';

// Decorative report-tracking panel: a street-grid map with issue pins and a
// report that moves through Reported, Reviewed and Resolved. Sample content only.

const STAGES = ['Reported', 'Reviewed', 'Assigned', 'Resolved'];
const PINS = [
  { x: 22, y: 30, kind: 'Pothole' },
  { x: 58, y: 22, kind: 'Streetlight' },
  { x: 40, y: 62, kind: 'Water leak' },
  { x: 76, y: 55, kind: 'Overflowing bin' },
];

export function CivicReportVisual() {
  const { ref, step, reduce } = useCycle(STAGES.length, 1500);
  const pin = PINS[2];
  return (
    <VisualFrame title="issue_map.live" frameRef={ref}>
      <div className="flex h-full flex-col gap-4">
        <div
          className="relative min-h-[11rem] flex-1 border border-line"
          style={{
            backgroundColor: '#0c1218',
            backgroundImage:
              'linear-gradient(#ffffff10 1px, transparent 1px), linear-gradient(90deg, #ffffff10 1px, transparent 1px)',
            backgroundSize: '12.5% 16.6%',
          }}
          aria-hidden="true"
        >
          <span className="absolute left-0 top-[46%] h-[6px] w-full bg-[#ffffff14]" />
          <span className="absolute left-[34%] top-0 h-full w-[6px] bg-[#ffffff14]" />
          {PINS.map((p) => (
            <span key={p.kind} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <span className={`block h-3 w-3 ${p === pin ? 'bg-[#ffd447]' : 'bg-accent-light'}`} />
              {p === pin && !reduce && <span className="absolute inset-0 animate-ping bg-[#ffd447]/60" />}
            </span>
          ))}
          <span className="label-mono absolute bottom-2 left-2 text-[0.6rem] text-mist-muted">sample data</span>
        </div>
        <ol className="grid grid-cols-4 gap-1.5" aria-hidden="true">
          {STAGES.map((s, i) => (
            <li key={s} className={`label-mono border px-1.5 py-1 text-center text-[0.58rem] transition-colors duration-300 ${i === step ? 'border-accent-light text-accent-light' : i < step ? 'border-line text-white' : 'border-line text-mist-muted'}`}>
              {s}
            </li>
          ))}
        </ol>
        <p className="label-mono text-mist-muted" aria-hidden="true">{pin.kind} // {STAGES[step]}</p>
      </div>
    </VisualFrame>
  );
}
