import { useEffect, useRef, useState } from 'react';
import { Hammer, Pickaxe, RotateCcw } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

// A tiny side-view block world: pick a block, then click or drag to build, or
// switch to the pickaxe to break. The count of blocks you have placed is kept
// in this browser only.

const COLS = 16;
const ROWS = 8;
const STORE = 'vs_blocks_placed';

type Block = 'air' | 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves' | 'diamond' | 'glass';

const PALETTE: { id: Exclude<Block, 'air'>; label: string }[] = [
  { id: 'grass', label: 'Grass' },
  { id: 'dirt', label: 'Dirt' },
  { id: 'stone', label: 'Stone' },
  { id: 'wood', label: 'Wood' },
  { id: 'leaves', label: 'Leaves' },
  { id: 'glass', label: 'Glass' },
  { id: 'diamond', label: 'Diamond' },
];

const STYLE: Record<Exclude<Block, 'air'>, string> = {
  grass: 'bg-[#5da83a] shadow-[inset_0_5px_0_#7dd14f,inset_0_-3px_0_#3f7a24]',
  dirt: 'bg-[#8a5a33] shadow-[inset_0_0_0_2px_#6e4524,inset_2px_2px_0_#a8723f]',
  stone: 'bg-[#808080] shadow-[inset_0_0_0_2px_#5f5f5f,inset_2px_2px_0_#9c9c9c]',
  wood: 'bg-[#7a5230] shadow-[inset_3px_0_0_#5e3d20,inset_-3px_0_0_#5e3d20]',
  leaves: 'bg-[#2f7a2a] shadow-[inset_0_0_0_2px_#1f5a1c,inset_2px_2px_0_#46a23c]',
  glass: 'bg-[#bfe9f5]/40 shadow-[inset_0_0_0_2px_#d8f6ff]',
  diamond: 'bg-[#2fc7c0] shadow-[inset_0_0_0_2px_#128a85,inset_2px_2px_0_#7df2ec]',
};

function startWorld(): Block[] {
  const g: Block[] = Array(COLS * ROWS).fill('air');
  const set = (x: number, y: number, b: Block) => (g[y * COLS + x] = b);
  for (let x = 0; x < COLS; x++) {
    set(x, ROWS - 2, 'grass');
    set(x, ROWS - 1, 'dirt');
  }
  [4, 5].forEach((y) => set(3, y, 'wood'));
  set(3, 3, 'wood');
  for (const [x, y] of [[2, 2], [3, 2], [4, 2], [2, 3], [4, 3], [3, 1]]) set(x, y, 'leaves');
  set(11, ROWS - 3, 'stone');
  set(12, ROWS - 3, 'stone');
  set(12, ROWS - 4, 'stone');
  set(13, ROWS - 3, 'diamond');
  return g;
}

function readCount() {
  try {
    return Number(localStorage.getItem(STORE)) || 0;
  } catch {
    return 0;
  }
}

export function BlockPlayground() {
  const [world, setWorld] = useState<Block[]>(startWorld);
  const [pick, setPick] = useState<Exclude<Block, 'air'>>('stone');
  const [mode, setMode] = useState<'build' | 'break'>('build');
  const [placed, setPlaced] = useState(readCount);
  const down = useRef(false);
  const worldRef = useRef(world);

  useEffect(() => {
    try {
      localStorage.setItem(STORE, String(placed));
    } catch {
      // Storage can be blocked; the counter just resets on reload.
    }
  }, [placed]);

  const apply = (i: number, breakIt: boolean) => {
    const removing = breakIt || mode === 'break';
    const w = worldRef.current;
    if (removing ? w[i] === 'air' : w[i] === pick) return;
    const n = w.slice();
    n[i] = removing ? 'air' : pick;
    worldRef.current = n;
    setWorld(n);
    if (!removing) setPlaced((p) => p + 1);
  };

  const reset = () => {
    const fresh = startWorld();
    worldRef.current = fresh;
    setWorld(fresh);
  };

  const cellAt = (e: React.PointerEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const idx = el?.dataset.cell;
    return idx === undefined ? null : Number(idx);
  };

  return (
    <section aria-labelledby="blocks-title" className="relative z-10 pb-24 sm:pb-32">
      <div className="container-editorial">
        <SectionHeading index="08.7" label="Playground" title="Build a block" id="blocks-title" size="lg" />

        <div className="mc-card mt-10 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" aria-pressed={mode === 'build'} onClick={() => setMode('build')} className={`mc-btn inline-flex min-h-11 items-center gap-2 px-3 text-sm ${mode === 'build' ? 'mc-btn--pressed' : ''}`}>
              <Hammer size={16} aria-hidden="true" /> Build
            </button>
            <button type="button" aria-pressed={mode === 'break'} onClick={() => setMode('break')} className={`mc-btn inline-flex min-h-11 items-center gap-2 px-3 text-sm ${mode === 'break' ? 'mc-btn--pressed' : ''}`}>
              <Pickaxe size={16} aria-hidden="true" /> Break
            </button>
            <span className="mx-1 hidden h-8 w-[3px] bg-white/20 sm:block" aria-hidden="true" />
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Block to place">
              {PALETTE.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={p.label}
                  aria-pressed={pick === p.id && mode === 'build'}
                  title={p.label}
                  onClick={() => {
                    setPick(p.id);
                    setMode('build');
                  }}
                  className={`mc-slot h-11 w-11 p-1.5 ${pick === p.id && mode === 'build' ? 'mc-slot--active' : ''}`}
                >
                  <span className={`block h-full w-full ${STYLE[p.id]}`} />
                </button>
              ))}
            </div>
            <button type="button" onClick={reset} className="mc-btn ml-auto inline-flex min-h-11 items-center gap-2 px-3 text-sm">
              <RotateCcw size={16} aria-hidden="true" /> Reset
            </button>
          </div>

          <div
            className="mt-4 grid touch-none select-none gap-0 overflow-hidden border-[3px] border-black bg-gradient-to-b from-[#6fb7e8] to-[#bfe3f5]"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => {
              down.current = true;
              const i = cellAt(e);
              if (i !== null) apply(i, e.button === 2);
            }}
            onPointerMove={(e) => {
              if (!down.current) return;
              const i = cellAt(e);
              if (i !== null) apply(i, e.buttons === 2);
            }}
            onPointerUp={() => (down.current = false)}
            onPointerLeave={() => (down.current = false)}
          >
            {world.map((b, i) => (
              <div key={i} data-cell={i} className={`aspect-square border border-black/5 ${b === 'air' ? 'hover:bg-white/25' : STYLE[b]}`} />
            ))}
          </div>

          <p className="label-mono mt-3 flex flex-wrap items-center justify-between gap-2 text-mist-muted">
            <span>Click or drag to {mode}. Right-click breaks.</span>
            <span className="text-[#ffff55]">Blocks placed by you: {placed}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
