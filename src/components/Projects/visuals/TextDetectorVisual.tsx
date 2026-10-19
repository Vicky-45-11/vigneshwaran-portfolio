// Abstract illustration of a text-analysis pipeline. Decorative only: it shows
// no scores or statistics because none are published for the project.

const lines = [
  [38, 22, 30],
  [26, 44, 18],
  [52, 28],
  [20, 34, 32],
  [46, 24, 16],
  [30, 40],
  [18, 36, 28],
  [42, 30],
  [24, 20, 38],
  [34, 46],
  [28, 18, 26],
  [40, 24],
];

// Token positions [line, segment] that get highlighted as "patterns".
const highlighted = new Set(['0-1', '1-1', '3-2', '4-0', '7-1', '9-0', '10-2']);

const stages = ['Tokenize', 'Patterns', 'Classify'];

export function TextDetectorVisual() {
  return (
    <div className="relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-[1.25rem] border border-line bg-ink p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="label-mono text-[0.625rem] text-mist-muted">text_input.txt</span>
        <ol className="flex items-center gap-2">
          {stages.map((stage, i) => (
            <li key={stage} className="label-mono flex items-center gap-1.5 text-[0.6rem] text-mist-dim">
              <span className={`h-1.5 w-1.5 rounded-full ${i === 1 ? 'bg-accent-cyan' : 'bg-accent-light/60'}`} />
              <span className="hidden sm:inline">{stage}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-xl border border-line bg-ink-800 p-4">
        <div className="flex h-full flex-col justify-between gap-3">
          {lines.map((segments, l) => (
            <div key={l} className="flex gap-2">
              {segments.map((w, s) => (
                <span
                  key={s}
                  style={{ width: `${w}%` }}
                  className={`h-2.5 rounded-full ${
                    highlighted.has(`${l}-${s}`) ? 'bg-accent/70 shadow-[0_0_12px_rgba(59,130,246,0.6)]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="animate-scan absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-accent-cyan/15 to-transparent" />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <svg viewBox="0 0 160 60" className="h-12 w-full text-accent-light" fill="none">
          {[10, 30, 50].map((y1) =>
            [15, 45].map((y2) => (
              <line key={`${y1}-${y2}`} x1="8" y1={y1} x2="152" y2={y2} stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
            )),
          )}
          {[10, 30, 50].map((y) => (
            <circle key={y} cx="8" cy={y} r="4" fill="currentColor" fillOpacity="0.6" />
          ))}
          {[15, 45].map((y) => (
            <circle key={y} cx="152" cy={y} r="5" fill="#22D3EE" fillOpacity="0.8" />
          ))}
        </svg>
        <span className="label-mono text-[0.6rem] text-mist-dim">→</span>
        <div className="flex flex-col gap-2">
          <span className="label-mono rounded-full border border-line px-3 py-1.5 text-center text-[0.6rem] text-mist">Human-written</span>
          <span className="label-mono rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-1.5 text-center text-[0.6rem] text-accent-cyan">
            AI-generated
          </span>
        </div>
      </div>
    </div>
  );
}
