import { motion } from 'framer-motion';
import { VisualFrame } from './VisualFrame';
import { useCycle } from './useCycle';

// Decorative illustration of an interactive globe: drifting meridians, a few
// place markers that take turns lighting up, and a small orbiting satellite.
// The marker positions are illustrative, not real coordinates.

const PLACES = [
  { name: 'Himalaya', x: 0.28, y: -0.22 },
  { name: 'Amazon Basin', x: -0.45, y: 0.22 },
  { name: 'Sahara', x: -0.08, y: -0.02 },
  { name: 'Great Barrier Reef', x: 0.5, y: 0.35 },
  { name: 'Antarctica', x: 0.05, y: 0.62 },
];

export function GeoVerseVisual() {
  const { ref, step, reduce } = useCycle(PLACES.length, 1900);
  const R = 92;
  const active = PLACES[step];
  return (
    <VisualFrame title="world_explorer.glsl" frameRef={ref}>
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <svg viewBox="-130 -130 260 260" className="h-full max-h-[22rem] w-full" role="presentation">
          <defs>
            <radialGradient id="gv-sphere" cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#2f5d3a" />
              <stop offset="1" stopColor="#0b1410" />
            </radialGradient>
            <clipPath id="gv-clip"><circle r={R} /></clipPath>
          </defs>
          <circle r={R + 8} fill="none" stroke="#7cff6b" strokeOpacity="0.18" />
          <circle r={R} fill="url(#gv-sphere)" />
          <g clipPath="url(#gv-clip)" fill="none" stroke="#7cff6b" strokeOpacity="0.28">
            {[-60, -30, 0, 30, 60].map((lat) => (
              <ellipse key={lat} rx={R} ry={R * Math.cos((lat * Math.PI) / 180) * 0.18} cy={R * Math.sin((lat * Math.PI) / 180)} />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <motion.ellipse
                key={i}
                ry={R}
                rx={R * 0.9}
                initial={{ rx: R * (0.15 + i * 0.25) }}
                animate={reduce ? undefined : { rx: [R * (0.15 + i * 0.25), R * 0.02, R * (0.15 + i * 0.25)] }}
                transition={{ duration: 9 + i, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </g>
          {PLACES.map((p, i) => (
            <g key={p.name} transform={`translate(${p.x * R} ${p.y * R})`}>
              {i === step && <circle r="11" fill="none" stroke="#ffd447" strokeWidth="1.5" className={reduce ? '' : 'animate-ping'} style={{ transformOrigin: 'center' }} />}
              <rect x="-3" y="-3" width="6" height="6" fill={i === step ? '#ffd447' : '#7cff6b'} />
            </g>
          ))}
          <motion.g animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}>
            <ellipse rx={R + 26} ry={R * 0.38} fill="none" stroke="#fff" strokeOpacity="0.15" strokeDasharray="3 5" transform="rotate(-24)" />
            <rect x={R + 22} y="-3" width="6" height="6" fill="#fff" transform="rotate(-24)" />
          </motion.g>
        </svg>
        <p className="label-mono text-center text-accent-light" aria-hidden="true">
          focus // {active.name}
        </p>
      </div>
    </VisualFrame>
  );
}
