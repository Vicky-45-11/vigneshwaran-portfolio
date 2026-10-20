import type { BlockName } from './textures';

/**
 * A procedurally generated slice of a block world, one screen wide and many
 * screens deep. Scrolling the page travels down through it: sky and surface,
 * caves, deepslate, bedrock, the Nether, then The End.
 */

export type Cell = BlockName | 'sky' | 'cave' | 'nether' | 'void';

export interface Emissive {
  col: number;
  row: number;
  kind: 'lava' | 'glowstone' | 'torch' | 'portal' | 'crystal';
}

export interface World {
  cols: number;
  rows: number;
  cells: Cell[][];
  emissive: Emissive[];
  /** Row of the grass block in each column. */
  surface: number[];
  /** Open cave cells where bats can fly, as [col, row]. */
  caveSpots: [number, number][];
}

/** Row where each zone starts. */
export const ZONES = {
  surface: 22,
  deepslate: 112,
  bedrock: 150,
  nether: 154,
  netherFloor: 186,
  end: 192,
  bottom: 226,
} as const;

export const WORLD_ROWS = ZONES.bottom;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Smooth 2D value noise for caves.
function makeNoise(seed: number) {
  const r = rng(seed);
  const perm = Array.from({ length: 256 }, () => r());
  const at = (x: number, y: number) => perm[(((x * 73856093) ^ (y * 19349663)) >>> 0) % 256];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = smooth(x - x0);
    const fy = smooth(y - y0);
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * fx;
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * fx;
    return a + (b - a) * fy;
  };
}

export function generateWorld(cols: number): World {
  const r = rng(1729);
  const noise = makeNoise(42);
  const rows = WORLD_ROWS;
  const cells: Cell[][] = Array.from({ length: rows }, () => Array<Cell>(cols).fill('stone'));
  const emissive: Emissive[] = [];
  const set = (row: number, col: number, cell: Cell) => {
    if (row >= 0 && row < rows && col >= 0 && col < cols) cells[row][col] = cell;
  };

  // --- Overworld surface
  const surface: number[] = [];
  for (let c = 0; c < cols; c++) {
    surface[c] = ZONES.surface + Math.round(2.2 * Math.sin(c * 0.33) + 1.4 * Math.sin(c * 0.12 + 1.7));
  }
  for (let c = 0; c < cols; c++) {
    for (let row = 0; row < ZONES.deepslate; row++) {
      const s = surface[c];
      if (row < s) set(row, c, 'sky');
      else if (row === s) set(row, c, 'grassSide');
      else if (row <= s + 3) set(row, c, 'dirt');
      else {
        const depth = (row - s) / (ZONES.deepslate - s);
        const cave = noise(c * 0.16, row * 0.22) > 0.62 - depth * 0.05 && row > s + 6;
        if (cave) set(row, c, 'cave');
        else {
          const roll = r();
          if (roll < 0.035) set(row, c, 'coalOre');
          else if (roll < 0.055) set(row, c, 'ironOre');
          else if (depth > 0.35 && roll < 0.068) set(row, c, 'goldOre');
          else if (depth > 0.5 && roll < 0.08) set(row, c, 'redstoneOre');
          else if (depth > 0.55 && roll < 0.09) set(row, c, 'lapisOre');
          else if (depth > 0.7 && roll < 0.095) set(row, c, 'emeraldOre');
          else if (roll < 0.14) set(row, c, 'cobble');
          else set(row, c, 'stone');
        }
      }
    }
  }

  // Trees on the surface
  for (let c = 2; c < cols - 2; c += 6 + Math.floor(r() * 6)) {
    const base = surface[c] - 1;
    const height = 4 + Math.floor(r() * 2);
    for (let i = 0; i < height; i++) set(base - i, c, 'logSide');
    const top = base - height + 1;
    for (let dy = -2; dy <= 1; dy++)
      for (let dx = -2; dx <= 2; dx++) {
        if (Math.abs(dx) === 2 && (dy === -2 || r() > 0.6)) continue;
        if (dx === 0 && dy >= 0) continue;
        set(top + dy, c + dx, 'leaves');
      }
  }

  // --- Deepslate with diamonds
  for (let c = 0; c < cols; c++) {
    for (let row = ZONES.deepslate; row < ZONES.bedrock; row++) {
      const blend = row < ZONES.deepslate + 3 && r() > (row - ZONES.deepslate) / 3;
      const cave = noise(c * 0.14 + 40, row * 0.2) > 0.6;
      if (cave) set(row, c, 'cave');
      else if (r() < 0.03) set(row, c, 'diamondOre');
      else if (r() < 0.025) set(row, c, 'redstoneOre');
      else if (r() < 0.02) set(row, c, 'goldOre');
      else set(row, c, blend ? 'stone' : 'deepslate');
    }
  }

  // --- Bedrock band, then the Nether
  for (let c = 0; c < cols; c++) {
    for (let row = ZONES.bedrock; row < ZONES.nether; row++) set(row, c, r() > 0.45 ? 'bedrock' : 'deepslate');
    const ceiling = ZONES.nether + 3 + Math.round(1.5 * Math.sin(c * 0.4) + r());
    const floor = ZONES.netherFloor - 4 + Math.round(2 * Math.sin(c * 0.27 + 2));
    for (let row = ZONES.nether; row < ZONES.end; row++) {
      if (row < ceiling || row > floor) {
        const roll = r();
        set(row, c, roll < 0.05 ? 'quartzOre' : roll < 0.08 ? 'netherGoldOre' : 'netherrack');
      } else set(row, c, 'nether');
    }
    // Glowstone hanging from the ceiling
    if (r() < 0.18) {
      const len = 1 + Math.floor(r() * 2);
      for (let i = 0; i < len; i++) {
        set(ceiling + i, c, 'glowstone');
        emissive.push({ col: c, row: ceiling + i, kind: 'glowstone' });
      }
    }
  }
  // Lava sea in the low parts of the Nether floor
  const lavaLevel = ZONES.netherFloor - 4;
  for (let c = 0; c < cols; c++)
    for (let row = lavaLevel; row < ZONES.end; row++)
      if (cells[row][c] === 'nether') {
        set(row, c, 'lava');
        emissive.push({ col: c, row, kind: 'lava' });
      }
  // A Nether portal
  const pc = Math.max(1, Math.floor(cols * 0.68));
  const pFloor = ZONES.nether + 15;
  for (let dx = 0; dx < 4; dx++)
    for (let dy = 0; dy < 5; dy++) {
      const frame = dx === 0 || dx === 3 || dy === 0 || dy === 4;
      set(pFloor - dy, pc + dx, frame ? 'obsidian' : 'nether');
      if (!frame) emissive.push({ col: pc + dx, row: pFloor - dy, kind: 'portal' });
    }

  // --- The End: void, floating end stone islands, obsidian pillars
  for (let c = 0; c < cols; c++) for (let row = ZONES.end; row < rows; row++) set(row, c, 'void');
  const islands = Math.max(2, Math.round(cols / 14));
  for (let i = 0; i < islands; i++) {
    const cx = Math.floor(((i + 0.5) / islands) * cols + (r() - 0.5) * 6);
    const cy = ZONES.end + 8 + Math.floor(r() * (rows - ZONES.end - 14));
    const w = 3 + Math.floor(r() * 4);
    for (let dy = 0; dy < 4; dy++) {
      const half = Math.max(1, w - dy * 1.4);
      for (let dx = -Math.floor(half); dx <= Math.floor(half); dx++) set(cy + dy, cx + dx, 'endStone');
    }
    if (i % 2 === 0) {
      const h = 4 + Math.floor(r() * 4);
      for (let k = 1; k <= h; k++) {
        set(cy - k, cx, 'obsidian');
        set(cy - k, cx + 1, 'obsidian');
      }
      emissive.push({ col: cx, row: cy - h - 1, kind: 'crystal' });
    } else if (r() > 0.4) {
      for (let k = 1; k <= 3; k++) for (let dx = 0; dx < 2; dx++) set(cy - k, cx + dx, 'purpur');
    }
  }

  // Torches on cave floors in the overworld
  for (let c = 0; c < cols; c++)
    for (let row = ZONES.surface + 8; row < ZONES.bedrock - 1; row++)
      if (cells[row][c] === 'cave' && cells[row + 1][c] !== 'cave' && r() < 0.06) emissive.push({ col: c, row, kind: 'torch' });

  // Small lava pools at the bottom of deep caves
  for (let c = 0; c < cols; c++)
    for (let row = ZONES.deepslate + 10; row < ZONES.bedrock - 1; row++)
      if (cells[row][c] === 'cave' && cells[row + 1][c] !== 'cave' && r() < 0.1) {
        set(row, c, 'lava');
        emissive.push({ col: c, row, kind: 'lava' });
      }

  const caveSpots: [number, number][] = [];
  for (let row = ZONES.surface + 10; row < ZONES.bedrock; row += 3)
    for (let c = 0; c < cols; c += 2) if (cells[row][c] === 'cave') caveSpots.push([c, row]);

  return { cols, rows, cells, emissive, surface, caveSpots };
}

/** How dark the terrain is drawn at a given row, so text on top stays readable. */
export function rowShade(row: number): number {
  if (row < ZONES.surface + 2) return 0;
  if (row < ZONES.surface + 10) return ((row - ZONES.surface - 2) / 8) * 0.62;
  if (row < ZONES.nether) return 0.64;
  if (row < ZONES.end) return 0.58;
  return 0.45;
}
