import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import type { BlockName } from './textures';

/**
 * A small floating island of blocks built from CSS 3D cubes: grass on top, dirt
 * and stone underneath with a diamond ore, a tree, a crafting table and a
 * chest. It turns slowly on its own and can be dragged to spin.
 */

interface Cube {
  x: number;
  y: number; // grows downward
  z: number;
  top: BlockName;
  side: BlockName;
  bottom?: BlockName;
}

function buildIsland(): Cube[] {
  const cubes: Cube[] = [];
  const add = (x: number, y: number, z: number, top: BlockName, side = top, bottom = top) => cubes.push({ x, y, z, top, side, bottom });

  for (let x = 0; x < 3; x++)
    for (let z = 0; z < 3; z++) {
      add(x, 0, z, 'grassTop', 'grassSide', 'dirt');
      add(x, 1, z, 'dirt');
      const ore = x === 2 && z === 2 ? 'diamondOre' : x === 0 && z === 2 ? 'goldOre' : x === 2 && z === 0 ? 'redstoneOre' : 'stone';
      add(x, 2, z, ore);
    }
  for (const [x, z] of [
    [1, 1],
    [0, 1],
    [1, 0],
    [2, 1],
    [1, 2],
  ])
    add(x, 3, z, x === 1 && z === 1 ? 'coalOre' : 'stone');
  add(1, 4, 1, 'stone');

  // Tree
  for (let y = -1; y >= -3; y--) add(0, y, 0, 'logTop', 'logSide');
  for (let x = -1; x <= 1; x++)
    for (let z = -1; z <= 1; z++) {
      if (x === 0 && z === 0) continue;
      add(x, -3, z, 'leaves');
    }
  for (const [x, z] of [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ])
    add(x, -4, z, 'leaves');

  add(2, -1, 0, 'crafting');
  add(2, -1, 2, 'chest');
  return cubes;
}

const CUBES = buildIsland();
const OCCUPIED = new Set(CUBES.map((c) => `${c.x},${c.y},${c.z}`));

const tex = (block: BlockName) => `var(--tex-${block.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)})`;

const FACES = [
  { name: 'front', dir: [0, 0, 1], transform: 'translateZ(calc(var(--cube) / 2))', shade: 0.82 },
  { name: 'back', dir: [0, 0, -1], transform: 'rotateY(180deg) translateZ(calc(var(--cube) / 2))', shade: 0.82 },
  { name: 'right', dir: [1, 0, 0], transform: 'rotateY(90deg) translateZ(calc(var(--cube) / 2))', shade: 0.66 },
  { name: 'left', dir: [-1, 0, 0], transform: 'rotateY(-90deg) translateZ(calc(var(--cube) / 2))', shade: 0.66 },
  { name: 'top', dir: [0, -1, 0], transform: 'rotateX(90deg) translateZ(calc(var(--cube) / 2))', shade: 1 },
  { name: 'bottom', dir: [0, 1, 0], transform: 'rotateX(-90deg) translateZ(calc(var(--cube) / 2))', shade: 0.5 },
] as const;

interface VoxelIslandProps {
  className?: string;
  spin?: boolean;
}

export function VoxelIsland({ className = '', spin = true }: VoxelIslandProps) {
  const [drag, setDrag] = useState(0);
  const start = useRef<{ x: number; angle: number } | null>(null);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    start.current = { x: e.clientX, angle: drag };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (start.current) setDrag(start.current.angle + (e.clientX - start.current.x) * 0.5);
  };
  const onUp = () => {
    start.current = null;
  };

  return (
    <div
      className={`voxel-scene touch-pan-y select-none ${className}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="img"
      aria-label="A small floating island of blocks with a tree, a crafting table and a chest"
    >
      <div className="voxel-tilt" style={{ transform: `rotateX(-24deg) rotateY(${drag}deg)` }}>
        <div className={`voxel-spin ${spin ? 'voxel-spin--on' : ''}`}>
          {CUBES.map((c, i) => (
            <div
              key={i}
              className="voxel-cube"
              style={{ transform: `translate3d(calc(${c.x - 1} * var(--cube)), calc(${c.y} * var(--cube)), calc(${c.z - 1} * var(--cube)))` }}
            >
              {FACES.map((f) => {
                if (OCCUPIED.has(`${c.x + f.dir[0]},${c.y + f.dir[1]},${c.z + f.dir[2]}`) && c.top !== 'leaves') return null;
                const block = f.name === 'top' ? c.top : f.name === 'bottom' ? (c.bottom ?? c.top) : c.side;
                return (
                  <div
                    key={f.name}
                    className="voxel-face"
                    style={{ transform: f.transform, backgroundImage: tex(block), '--shade': f.shade } as CSSProperties}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
