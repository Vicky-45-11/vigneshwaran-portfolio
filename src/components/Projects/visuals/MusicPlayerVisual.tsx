import { Pause, Search, SkipBack, SkipForward } from 'lucide-react';

// Original abstract artwork built from CSS gradients. No third-party branding.
const covers = [
  'linear-gradient(135deg, #0B1F3A 0%, #2563EB 55%, #22D3EE 100%)',
  'radial-gradient(circle at 30% 30%, #60A5FA, #0B1F3A 70%)',
  'conic-gradient(from 200deg, #111111, #3B82F6, #D7E2EA, #111111)',
  'linear-gradient(200deg, #22D3EE 0%, #0C0C0C 80%)',
];

const bars = [0.5, 0.8, 0.35, 0.95, 0.6, 0.75, 0.4, 0.9, 0.55, 0.7];

export function MusicPlayerVisual() {
  return (
    <div className="relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-[1.25rem] border border-line bg-ink p-5 sm:p-6">
      <div className="flex items-center gap-2 rounded-full border border-line bg-ink-800 px-4 py-2 text-mist-dim">
        <Search size={14} aria-hidden="true" />
        <span className="h-2 w-28 rounded-full bg-white/10" />
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
        {covers.map((bg, i) => (
          <div key={i} className={`flex flex-col gap-2 ${i > 1 ? 'hidden sm:flex' : ''}`}>
            <div className="aspect-square rounded-xl" style={{ background: bg }} />
            <span className="h-2 w-3/4 rounded-full bg-white/15" />
            <span className="h-2 w-1/2 rounded-full bg-white/[0.07]" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-line bg-ink-800 p-3 sm:p-4">
        <div className="h-12 w-12 shrink-0 rounded-lg" style={{ background: covers[0] }} />
        <div className="min-w-0 flex-1">
          <span className="block h-2 w-24 rounded-full bg-white/25" />
          <div className="mt-3 h-1 rounded-full bg-white/10">
            <div className="h-full w-2/5 rounded-full bg-accent-light" />
          </div>
        </div>
        <div className="flex h-8 items-end gap-[3px]" aria-hidden="true">
          {bars.map((h, i) => (
            <span
              key={i}
              className="eq-bar w-[3px] rounded-full bg-accent-cyan/80"
              style={{ height: `${h * 100}%`, animationDelay: `${i * -0.13}s` }}
            />
          ))}
        </div>
        <div className="hidden items-center gap-2 text-mist sm:flex">
          <SkipBack size={16} />
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-ink">
            <Pause size={16} />
          </span>
          <SkipForward size={16} />
        </div>
      </div>
    </div>
  );
}
