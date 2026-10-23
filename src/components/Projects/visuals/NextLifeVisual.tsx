import { VisualFrame } from './VisualFrame';
import { useCycle } from './useCycle';

// Decorative panel for the e-waste project: a device card and the five
// "next life" routes taking turns as the suggested one. Demo content only.

const ROUTES = [
  { name: 'Repair', note: 'Fix the fault and keep using it' },
  { name: 'Reuse', note: 'Repurpose it for a new job' },
  { name: 'Refurbish', note: 'Restore and pass it on' },
  { name: 'Donate', note: 'Give it to someone who needs it' },
  { name: 'Recycle', note: 'Recover the materials safely' },
];

export function NextLifeVisual() {
  const { ref, step, reduce } = useCycle(ROUTES.length, 1800);
  return (
    <VisualFrame title="next_life.analysis" frameRef={ref}>
      <div className="flex h-full flex-col justify-center gap-2.5 sm:gap-4">
        <div className="flex items-center gap-3 border border-line p-2 sm:gap-4 sm:p-3" aria-hidden="true">
          <span className="relative block h-10 w-7 sm:h-14 sm:w-9 border-2 border-white/70">
            <span className="absolute inset-1 bg-accent-light/30" />
            <span className="absolute bottom-0.5 left-1/2 h-0.5 w-2 -translate-x-1/2 bg-white/70" />
          </span>
          <div>
            <p className="label-mono text-white">old_phone.jpg</p>
            <p className="label-mono text-mist-muted">cracked screen</p>
          </div>
        </div>
        <ul className="flex flex-col gap-1.5 sm:gap-2" aria-hidden="true">
          {ROUTES.map((r, i) => (
            <li key={r.name} className={`flex items-center justify-between gap-3 border px-3 py-1.5 sm:py-2 ${reduce ? '' : 'transition-colors duration-300'} ${i === step ? 'border-accent-light bg-accent-light/10' : 'border-line'}`}>
              <span className={`label-mono ${i === step ? 'text-accent-light' : 'text-white'}`}>{r.name}</span>
              <span className="hidden text-sm text-mist-muted sm:block">{r.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </VisualFrame>
  );
}
