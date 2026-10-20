/**
 * 16×16 pixel-art block textures, drawn procedurally at runtime (no image
 * assets). Each texture is seeded so it looks the same on every visit.
 */

export type BlockName =
  | 'grassTop'
  | 'grassSide'
  | 'dirt'
  | 'stone'
  | 'cobble'
  | 'deepslate'
  | 'bedrock'
  | 'coalOre'
  | 'ironOre'
  | 'goldOre'
  | 'diamondOre'
  | 'emeraldOre'
  | 'redstoneOre'
  | 'lapisOre'
  | 'logSide'
  | 'logTop'
  | 'leaves'
  | 'planks'
  | 'bookshelf'
  | 'chest'
  | 'lava'
  | 'glowstone'
  | 'crafting'
  | 'tnt'
  | 'netherrack'
  | 'quartzOre'
  | 'netherGoldOre'
  | 'obsidian'
  | 'endStone'
  | 'purpur';

const SIZE = 16;

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

type Px = (x: number, y: number, color: string) => void;

const pick = (r: () => number, colors: string[]) => colors[Math.floor(r() * colors.length)];

const STONE = ['#7f7f7f', '#878787', '#747474', '#6c6c6c', '#8f8f8f', '#7a7a7a'];
const DIRT = ['#79553a', '#86603f', '#6b4a32', '#5d3f2a', '#966c4a'];
const GRASS = ['#5d9c34', '#6aae3c', '#79bd48', '#4f8a2b', '#629f37'];
const PLANKS = ['#b08a52', '#a37f49', '#bb955c', '#9c7744'];

function fillNoise(px: Px, r: () => number, colors: string[]) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) px(x, y, pick(r, colors));
}

function ore(px: Px, r: () => number, colors: string[], base = STONE) {
  fillNoise(px, r, base);
  const clusters = 4 + Math.floor(r() * 2);
  for (let c = 0; c < clusters; c++) {
    const cx = 2 + Math.floor(r() * 11);
    const cy = 2 + Math.floor(r() * 11);
    const cells = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [r() > 0.5 ? 2 : -1, 0],
      [0, r() > 0.5 ? 2 : -1],
    ];
    for (const [dx, dy] of cells) if (r() > 0.15) px(cx + dx, cy + dy, pick(r, colors));
  }
}

function planks(px: Px, r: () => number) {
  for (let y = 0; y < SIZE; y++) {
    const seam = y % 4 === 3;
    const offset = Math.floor(y / 4) % 2 ? 8 : 0;
    for (let x = 0; x < SIZE; x++) {
      if (seam) px(x, y, '#6e5432');
      else if ((x + offset) % 16 === 0) px(x, y, '#7d6039');
      else px(x, y, pick(r, PLANKS));
    }
  }
}

const NETHERRACK = ['#6f2b2b', '#7d3434', '#5e2222', '#8a3b3b', '#672727'];

const DRAW: Record<BlockName, (px: Px, r: () => number) => void> = {
  grassTop: (px, r) => fillNoise(px, r, GRASS),
  grassSide: (px, r) => {
    fillNoise(px, r, DIRT);
    for (let x = 0; x < SIZE; x++) {
      const depth = 3 + (r() > 0.5 ? 1 : 0) + (r() > 0.8 ? 1 : 0);
      for (let y = 0; y < depth; y++) px(x, y, pick(r, GRASS));
    }
  },
  dirt: (px, r) => fillNoise(px, r, DIRT),
  stone: (px, r) => {
    fillNoise(px, r, STONE);
    for (let i = 0; i < 7; i++) {
      const x = Math.floor(r() * 14);
      const y = Math.floor(r() * 16);
      px(x, y, '#5f5f5f');
      px(x + 1, y, '#5f5f5f');
    }
  },
  cobble: (px, r) => {
    fillNoise(px, r, ['#6b6b6b', '#7a7a7a', '#878787', '#5a5a5a']);
    for (let y = 0; y < SIZE; y += 4) for (let x = 0; x < SIZE; x++) if (r() > 0.4) px(x, y, '#3f3f3f');
  },
  deepslate: (px, r) => {
    for (let y = 0; y < SIZE; y++) {
      const row = y % 3 === 0 ? ['#3a3a40', '#424249'] : ['#4d4d55', '#56565e', '#48484f', '#5e5e66'];
      for (let x = 0; x < SIZE; x++) px(x, y, pick(r, row));
    }
  },
  bedrock: (px, r) => fillNoise(px, r, ['#2b2b2b', '#565656', '#1b1b1b', '#777777', '#3b3b3b']),
  coalOre: (px, r) => ore(px, r, ['#1e1e1e', '#2d2d2d', '#111111']),
  ironOre: (px, r) => ore(px, r, ['#d8af93', '#e5c4ae', '#b98a6e']),
  goldOre: (px, r) => ore(px, r, ['#fcee4b', '#ffd83d', '#e6b422']),
  diamondOre: (px, r) => ore(px, r, ['#5decf5', '#a1fbe8', '#2bc7cf']),
  emeraldOre: (px, r) => ore(px, r, ['#17dd62', '#41f384', '#0a9e3f']),
  redstoneOre: (px, r) => ore(px, r, ['#ff2a2a', '#c40000', '#ff6060']),
  lapisOre: (px, r) => ore(px, r, ['#2f53c9', '#1d3fa6', '#4e74e8']),
  logSide: (px, r) => {
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++) px(x, y, x % 4 === 0 ? '#4b3820' : pick(r, ['#6b5130', '#5a4426', '#76593a']));
  },
  logTop: (px, r) => {
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++) {
        const d = Math.max(Math.abs(x - 7.5), Math.abs(y - 7.5));
        if (d > 6.5) px(x, y, '#5a4426');
        else px(x, y, Math.floor(d) % 2 ? '#b59157' : pick(r, ['#9e7a46', '#a8844e']));
      }
  },
  leaves: (px, r) => {
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++) px(x, y, r() > 0.12 ? pick(r, ['#3f7a22', '#2f6619', '#4e8d2b', '#36701d']) : '#1f4410');
  },
  planks,
  bookshelf: (px, r) => {
    planks(px, r);
    const spines = ['#a3312f', '#2f5ea3', '#3a8c3f', '#c9a227', '#7b3fa0', '#d0d0d0'];
    for (const top of [2, 9]) {
      for (let x = 1; x < 15; x++) {
        const color = x % 3 === 0 ? '#3b2a17' : spines[Math.floor(r() * spines.length)];
        for (let y = top; y < top + 5; y++) px(x, y, color);
      }
    }
  },
  chest: (px, r) => {
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++) {
        const edge = x === 0 || y === 0 || x === 15 || y === 15 || y === 6;
        px(x, y, edge ? '#3b2a17' : pick(r, ['#a06a2c', '#b07734', '#94612a']));
      }
    for (let y = 5; y < 9; y++) for (let x = 7; x < 9; x++) px(x, y, y === 5 ? '#d9d9d9' : '#9e9e9e');
  },
  lava: (px, r) => fillNoise(px, r, ['#d4500f', '#f5a22a', '#ff7a1a', '#e8631a', '#ffc04a']),
  glowstone: (px, r) => fillNoise(px, r, ['#f6d26b', '#c99a3b', '#ffe9a3', '#a87b2e']),
  crafting: (px, r) => {
    planks(px, r);
    for (let x = 0; x < SIZE; x++) {
      px(x, 0, '#3b2a17');
      px(x, 15, '#3b2a17');
    }
    for (let y = 3; y < 13; y++) {
      px(3, y, '#5c5c5c');
      px(12, y, '#5c5c5c');
    }
    for (let x = 3; x < 13; x++) px(x, 3, '#7a7a7a');
  },
  tnt: (px, r) => {
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++) {
        if (y >= 5 && y <= 10) px(x, y, y === 5 || y === 10 ? '#3b3b3b' : '#e6e6e6');
        else px(x, y, x % 4 === 0 ? '#8c1c12' : pick(r, ['#d63b22', '#c22f1b']));
      }
    // "TNT" lettering, simplified to three dark bars
    for (const x0 of [2, 7, 12]) for (let y = 6; y < 10; y++) px(x0, y, '#2b2b2b');
  },
  netherrack: (px, r) => fillNoise(px, r, NETHERRACK),
  quartzOre: (px, r) => ore(px, r, ['#e9e3da', '#d4ccc0', '#f7f3ee'], NETHERRACK),
  netherGoldOre: (px, r) => ore(px, r, ['#fcee4b', '#e6b422'], NETHERRACK),
  obsidian: (px, r) => fillNoise(px, r, ['#14101f', '#1d1530', '#0d0a16', '#2a1f45', '#130e22']),
  endStone: (px, r) => fillNoise(px, r, ['#dbdea0', '#e5e8b0', '#cfd192', '#c3c585', '#edf0bd']),
  purpur: (px, r) => {
    fillNoise(px, r, ['#a77ba7', '#b386b3', '#9a6f9a']);
    for (let i = 0; i < SIZE; i++) {
      px(i, 0, '#7d557d');
      px(0, i, '#7d557d');
      px(i, 8, '#7d557d');
      px(8, i, '#7d557d');
    }
  },
};

const canvases = new Map<BlockName, HTMLCanvasElement>();
const urls = new Map<BlockName, string>();

export function blockCanvas(name: BlockName): HTMLCanvasElement {
  const cached = canvases.get(name);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const px: Px = (x, y, color) => {
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    };
    let seed = 0;
    for (const ch of name) seed = (seed * 31 + ch.charCodeAt(0)) | 0;
    DRAW[name](px, rng(seed));
  }
  canvases.set(name, canvas);
  return canvas;
}

export function blockUrl(name: BlockName): string {
  const cached = urls.get(name);
  if (cached) return cached;
  const url = blockCanvas(name).toDataURL();
  urls.set(name, url);
  return url;
}

/** The main pixel colours of a block, for particles. */
export function blockColors(name: BlockName, count = 6): string[] {
  const ctx = blockCanvas(name).getContext('2d');
  if (!ctx) return ['#7f7f7f'];
  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const p = ((i * 37) % (SIZE * SIZE)) * 4;
    out.push(`rgb(${data[p]}, ${data[p + 1]}, ${data[p + 2]})`);
  }
  return out;
}

/** Expose every texture as a CSS custom property, e.g. var(--tex-stone). */
export function installBlockTextures() {
  const root = document.documentElement;
  (Object.keys(DRAW) as BlockName[]).forEach((name) => {
    const kebab = name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    root.style.setProperty(`--tex-${kebab}`, `url(${blockUrl(name)})`);
  });
}
