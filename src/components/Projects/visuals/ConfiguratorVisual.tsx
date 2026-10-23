import { motion } from 'framer-motion';
import { VisualFrame } from './VisualFrame';
import { useCycle } from './useCycle';

// Decorative configurator: an original stylised side-on coupe silhouette (not a
// BMW model or asset) whose paint changes with the swatches. Click a swatch or
// let it cycle.

const PAINTS = [
  { name: 'Midnight', body: '#1b2433' },
  { name: 'Signal Red', body: '#b3261e' },
  { name: 'Arctic', body: '#d7dde6' },
  { name: 'Racing Green', body: '#1f5a3a' },
];

export function ConfiguratorVisual() {
  const { ref, step, setStep, reduce } = useCycle(PAINTS.length, 2200);
  const idx = step;
  const paint = PAINTS[idx];
  return (
    <VisualFrame title="configurator.scene" frameRef={ref}>
      <div className="flex h-full flex-col justify-between gap-4">
        <svg viewBox="0 0 400 160" className="w-full flex-1" role="presentation">
          <ellipse cx="200" cy="140" rx="170" ry="9" fill="#000" opacity="0.45" />
          <motion.path
            d="M22 112 C22 96 40 90 70 86 L120 62 C140 48 190 42 236 44 C276 46 304 66 330 82 C360 88 380 94 380 112 L380 120 L22 120 Z"
            animate={{ fill: paint.body }}
            transition={{ duration: reduce ? 0 : 0.6 }}
            stroke="#fff"
            strokeOpacity="0.25"
          />
          <path d="M130 66 C150 54 190 50 230 52 C262 54 282 68 300 80 L136 80 Z" fill="#0a0f14" opacity="0.85" />
          <line x1="212" y1="52" x2="212" y2="80" stroke="#fff" strokeOpacity="0.2" />
          {[100, 300].map((cx) => (
            <g key={cx} transform={`translate(${cx} 120)`}>
              <circle r="26" fill="#0b0b0f" stroke="#fff" strokeOpacity="0.3" />
              <motion.g animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                <circle r="14" fill="#2a2d36" />
                {[0, 72, 144, 216, 288].map((a) => (
                  <line key={a} y2="-13" stroke="#aeb4c0" strokeWidth="2" transform={`rotate(${a})`} />
                ))}
              </motion.g>
            </g>
          ))}
          <rect x="360" y="98" width="16" height="5" fill="#fff" opacity="0.8" />
          <rect x="24" y="96" width="14" height="5" fill="#ff5f56" opacity="0.85" />
        </svg>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ul className="flex gap-2" aria-label="Paint swatches">
            {PAINTS.map((p, i) => (
              <li key={p.name}>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => { setStep(i); }}
                  aria-label={p.name}
                  className={`h-7 w-7 border-2 transition-transform hover:scale-110 ${i === idx ? 'border-white' : 'border-line'}`}
                  style={{ backgroundColor: p.body }}
                />
              </li>
            ))}
          </ul>
          <span className="label-mono text-accent-light">paint // {paint.name}</span>
        </div>
      </div>
    </VisualFrame>
  );
}
