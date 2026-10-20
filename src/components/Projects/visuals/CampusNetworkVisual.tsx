// Abstract network of students, interests, skills and projects. Decorative only.

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

const STYLE: Record<Kind, string> = {
  student: 'fill-[#D7E2EA]',
  interest: 'fill-[#22D3EE]',
  skill: 'fill-[#60A5FA]',
  project: 'fill-[#3B82F6]',
};

const legend: { kind: Kind; label: string }[] = [
  { kind: 'student', label: 'Students' },
  { kind: 'interest', label: 'Interests' },
  { kind: 'skill', label: 'Skills' },
  { kind: 'project', label: 'Projects' },
];

export function CampusNetworkVisual() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden border border-line bg-ink p-5 sm:p-6">
      <div className="relative flex-1">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
          {edges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="#60A5FA"
              strokeOpacity={a === 0 ? 0.45 : 0.2}
              strokeWidth="0.35"
              strokeDasharray={a === 0 ? '1.5 1.5' : undefined}
              className={a === 0 ? 'animate-dash' : undefined}
            />
          ))}
          <circle cx="50" cy="50" r="11" fill="#3B82F6" fillOpacity="0.08" />
          {nodes.map((node, i) => (
            <g key={i}>
              <circle cx={node.x} cy={node.y} r={i === 0 ? 4.5 : 2.6} className={STYLE[node.kind]} />
              <text
                x={node.x}
                y={node.y + (i === 0 ? 9 : 6.5)}
                textAnchor="middle"
                className="fill-[#9CA3AF] font-mono"
                style={{ fontSize: 3 }}
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {legend.map((item) => (
          <li key={item.kind} className="label-mono flex items-center gap-2 text-[0.6rem] text-mist-muted">
            <svg width="8" height="8" aria-hidden="true">
              <circle cx="4" cy="4" r="4" className={STYLE[item.kind]} />
            </svg>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
