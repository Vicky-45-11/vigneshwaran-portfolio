import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';

// Living network of students, interests, skills and projects. Nodes drift,
// lean away from the pointer and light up their links on hover; every few
// seconds two students "match" around the idea. Decorative only: no real
// users or numbers are shown.

type Kind = 'student' | 'interest' | 'skill' | 'project';

const nodes: { x: number; y: number; kind: Kind; label: string }[] = [
  { x: 50, y: 50, kind: 'project', label: 'Startup idea' },
  { x: 18, y: 24, kind: 'student', label: 'Student' },
  { x: 82, y: 22, kind: 'student', label: 'Student' },
  { x: 16, y: 76, kind: 'student', label: 'Student' },
  { x: 84, y: 78, kind: 'student', label: 'Student' },
  { x: 50, y: 12, kind: 'interest', label: 'AI' },
  { x: 50, y: 88, kind: 'skill', label: 'Design' },
  { x: 8, y: 50, kind: 'skill', label: 'Backend' },
  { x: 92, y: 50, kind: 'interest', label: 'Product' },
];

const edges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 5], [2, 5], [3, 6], [4, 6],
  [1, 7], [3, 7], [2, 8], [4, 8],
];

const COLOR: Record<Kind, string> = {
  student: '#D7E2EA',
  interest: '#22D3EE',
  skill: '#60A5FA',
  project: '#3B82F6',
};

const legend: { kind: Kind; label: string }[] = [
  { kind: 'student', label: 'Students' },
  { kind: 'interest', label: 'Interests' },
  { kind: 'skill', label: 'Skills' },
  { kind: 'project', label: 'Projects' },
];

// Student pairs that take turns matching, with what they share.
const MATCHES: { a: number; b: number; via: number; text: string }[] = [
  { a: 1, b: 2, via: 5, text: 'Shared interest: AI' },
  { a: 3, b: 4, via: 6, text: 'Shared skill: Design' },
  { a: 2, b: 4, via: 8, text: 'Shared interest: Product' },
  { a: 1, b: 3, via: 7, text: 'Shared skill: Backend' },
];

const linked = (i: number) => new Set(edges.flatMap(([a, b]) => (a === i ? [b] : b === i ? [a] : [])).concat(i));

export function CampusNetworkVisual() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const nodeEls = useRef<(SVGGElement | null)[]>([]);
  const edgeEls = useRef<(SVGLineElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const inView = useInView(root, { margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const [hover, setHoverState] = useState<number | null>(null);
  const hoverRef = useRef<number | null>(null);
  const setHover = (i: number | null) => {
    hoverRef.current = i;
    setHoverState(i);
  };
  const [legendKind, setLegendKind] = useState<Kind | null>(null);
  const [match, setMatch] = useState(0);

  // Drift each node on its own slow orbit and push it gently away from the pointer.
  useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    const offsets = nodes.map(() => ({ x: 0, y: 0 }));
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      nodes.forEach((n, i) => {
        const amp = i === 0 ? 0.6 : 1.6;
        let tx = Math.sin(t * 0.6 + i * 1.7) * amp;
        let ty = Math.cos(t * 0.5 + i * 2.3) * amp;
        const p = pointer.current;
        // The hovered node holds still so it stays under the pointer.
        if (p && hoverRef.current !== i) {
          const dx = n.x - p.x;
          const dy = n.y - p.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 22) {
            const push = ((22 - d) / 22) * 5;
            tx += (dx / d) * push;
            ty += (dy / d) * push;
          }
        }
        offsets[i].x += (tx - offsets[i].x) * 0.08;
        offsets[i].y += (ty - offsets[i].y) * 0.08;
        nodeEls.current[i]?.setAttribute('transform', `translate(${offsets[i].x.toFixed(2)} ${offsets[i].y.toFixed(2)})`);
      });
      edges.forEach(([a, b], k) => {
        const el = edgeEls.current[k];
        if (!el) return;
        el.setAttribute('x1', (nodes[a].x + offsets[a].x).toFixed(2));
        el.setAttribute('y1', (nodes[a].y + offsets[a].y).toFixed(2));
        el.setAttribute('x2', (nodes[b].x + offsets[b].x).toFixed(2));
        el.setAttribute('y2', (nodes[b].y + offsets[b].y).toFixed(2));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  // Cycle through the example matches.
  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setMatch((m) => (m + 1) % MATCHES.length), 3200);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  const m = MATCHES[match];
  const focus = hover !== null ? linked(hover) : null;
  const isDim = (i: number) =>
    (focus !== null && !focus.has(i)) || (legendKind !== null && nodes[i].kind !== legendKind);
  const edgeOn = (a: number, b: number) =>
    (hover !== null && (a === hover || b === hover)) || (hover === null && !reduce && (a === m.via || b === m.via) && (a === m.a || a === m.b || b === m.a || b === m.b));

  return (
    <div ref={root} className="relative flex h-full w-full flex-col overflow-hidden border border-line bg-ink p-5 sm:p-6">
      {/* faint block grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <div className="relative flex items-center justify-between">
        <span className="label-mono text-mist-muted">campus_graph</span>
        <span className="label-mono flex items-center gap-1.5 text-[0.6rem] text-accent-light">
          <span className="h-1.5 w-1.5 animate-pulse bg-accent-light" />
          live preview
        </span>
      </div>

      <div className="relative flex-1">
        <svg
          ref={svg}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full overflow-visible"
          onPointerMove={(e) => {
            if (e.pointerType !== 'mouse' || !svg.current) return;
            const pt = svg.current.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            const ctm = svg.current.getScreenCTM();
            if (!ctm) return;
            const p = pt.matrixTransform(ctm.inverse());
            pointer.current = { x: p.x, y: p.y };
          }}
          onPointerLeave={() => {
            pointer.current = null;
            setHover(null);
          }}
        >
          <defs>
            <radialGradient id="cn-core">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ripples from the idea at the centre */}
          <circle cx="50" cy="50" r="13" fill="url(#cn-core)" />
          {!reduce &&
            [0, 1, 2].map((k) => (
              <motion.circle
                key={k}
                cx="50"
                cy="50"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="0.3"
                initial={{ r: 5, opacity: 0.6 }}
                animate={{ r: 24, opacity: 0 }}
                transition={{ duration: 3.6, repeat: Infinity, delay: k * 1.2, ease: 'easeOut' }}
              />
            ))}

          {edges.map(([a, b], k) => {
            const on = edgeOn(a, b);
            const dim = focus !== null && !on;
            return (
              <line
                key={`${a}-${b}`}
                ref={(el) => {
                  edgeEls.current[k] = el;
                }}
                x1={nodes[a].x}
                y1={nodes[a].y}
                x2={nodes[b].x}
                y2={nodes[b].y}
                stroke={on ? '#7DDC5B' : '#60A5FA'}
                strokeOpacity={on ? 0.9 : dim ? 0.06 : a === 0 ? 0.45 : 0.2}
                strokeWidth={on ? 0.6 : 0.35}
                strokeDasharray={a === 0 ? '1.5 1.5' : undefined}
                className={`transition-[stroke,stroke-opacity,stroke-width] duration-300 ${a === 0 ? 'animate-dash' : ''}`}
              />
            );
          })}

          {/* Signals travelling into the idea */}
          {!reduce &&
            [1, 2, 3, 4].map((s, k) => (
              <motion.circle
                key={s}
                r="0.9"
                fill="#7DDC5B"
                initial={{ cx: nodes[s].x, cy: nodes[s].y, opacity: 0 }}
                animate={{ cx: [nodes[s].x, 50], cy: [nodes[s].y, 50], opacity: [0, 1, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: k * 0.55, ease: 'easeIn' }}
              />
            ))}

          {nodes.map((node, i) => {
            const isMatch = hover === null && !reduce && (i === m.a || i === m.b);
            const big = i === 0 ? 4.5 : 2.6;
            return (
              <g
                key={i}
                ref={(el) => {
                  nodeEls.current[i] = el;
                }}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                className="cursor-pointer"
                style={{ opacity: isDim(i) ? 0.2 : 1, transition: 'opacity 300ms' }}
              >
                <circle cx={node.x} cy={node.y} r={big + 3} fill="transparent" />
                {(isMatch || hover === i) && (
                  <circle cx={node.x} cy={node.y} r={big + 1.8} fill="none" stroke="#7DDC5B" strokeWidth="0.4">
                    {!reduce && <animate attributeName="r" values={`${big + 1};${big + 2.6};${big + 1}`} dur="1.4s" repeatCount="indefinite" />}
                  </circle>
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={hover === i ? big * 1.35 : big}
                  fill={COLOR[node.kind]}
                  style={{ transition: 'r 250ms' }}
                />
                {i === 0 && <rect x="48.4" y="48.4" width="3.2" height="3.2" fill="#0C0C0C" fillOpacity="0.35" />}
                <text
                  x={node.x}
                  y={node.y + (i === 0 ? 9 : 6.5)}
                  textAnchor="middle"
                  className="font-mono"
                  fill={hover === i || isMatch ? '#7DDC5B' : '#9CA3AF'}
                  style={{ fontSize: hover === i ? 3.6 : 3, transition: 'font-size 200ms' }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Match toast, like an in-game advancement */}
        <AnimatePresence mode="wait">
          {!reduce && hover === null && inView && (
            <motion.div
              key={match}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute bottom-1 left-0 border-2 border-black bg-[#212121] px-3 py-1.5 shadow-[inset_0_0_0_2px_#555]"
            >
              <p className="font-pixel text-[0.7rem] leading-tight text-[#ffff55]">Match found!</p>
              <p className="font-pixel text-[0.65rem] leading-tight text-white">{m.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ul className="relative mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {legend.map((item) => (
          <li
            key={item.kind}
            onPointerEnter={() => setLegendKind(item.kind)}
            onPointerLeave={() => setLegendKind(null)}
            className={`label-mono flex cursor-default items-center gap-2 text-[0.6rem] transition-colors ${
              legendKind === item.kind ? 'text-white' : 'text-mist-muted'
            }`}
          >
            <svg width="8" height="8" aria-hidden="true">
              <circle cx="4" cy="4" r="4" fill={COLOR[item.kind]} />
            </svg>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
