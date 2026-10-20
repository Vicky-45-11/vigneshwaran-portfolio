/**
 * Original pixel animals drawn with rectangles: a pig, a sheep and a chicken
 * that wander the surface, and bats that flutter in the caves.
 */

export type MobKind = 'pig' | 'sheep' | 'chicken';

export interface Mob {
  kind: MobKind;
  x: number; // in columns
  dir: 1 | -1;
  speed: number;
  walking: boolean;
  nextChange: number; // seconds
}

export interface Bat {
  col: number;
  row: number;
  phase: number;
}

type Ctx = CanvasRenderingContext2D;

/** Draw a mob standing with its feet at (x, yBottom); b is the block size in px. */
export function drawMob(ctx: Ctx, mob: Mob, x: number, yBottom: number, b: number, t: number) {
  const swing = mob.walking ? Math.sin(t * 10 + mob.x) * b * 0.06 : 0;
  const flip = mob.dir;
  // All shapes are described facing right, relative to the mob's centre.
  const rect = (dx: number, dy: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    const left = flip === 1 ? x + dx * b : x - (dx + w) * b;
    ctx.fillRect(Math.round(left), Math.round(yBottom - (dy + h) * b), Math.ceil(w * b), Math.ceil(h * b));
  };
  const legs = (xs: number[], h: number, w: number, color: string) => {
    xs.forEach((lx, i) => {
      const off = (i % 2 ? 1 : -1) * swing;
      ctx.fillStyle = color;
      const left = flip === 1 ? x + lx * b + off : x - (lx + w) * b - off;
      ctx.fillRect(Math.round(left), Math.round(yBottom - h * b), Math.ceil(w * b), Math.ceil(h * b));
    });
  };

  if (mob.kind === 'pig') {
    legs([-0.45, -0.25, 0.1, 0.3], 0.22, 0.14, '#d98c89');
    rect(-0.5, 0.2, 0.95, 0.42, '#f0a5a2');
    rect(-0.5, 0.2, 0.95, 0.08, '#d98c89');
    rect(0.3, 0.3, 0.42, 0.42, '#f0a5a2');
    rect(0.66, 0.36, 0.1, 0.16, '#e07b78');
    rect(0.68, 0.4, 0.04, 0.04, '#8a4a48');
    rect(0.5, 0.56, 0.08, 0.08, '#ffffff');
    rect(0.54, 0.56, 0.04, 0.08, '#111111');
  } else if (mob.kind === 'sheep') {
    legs([-0.42, -0.22, 0.12, 0.32], 0.26, 0.13, '#c9b9a6');
    rect(-0.55, 0.22, 1.05, 0.52, '#ececec');
    rect(-0.55, 0.22, 1.05, 0.08, '#d4d4d4');
    rect(-0.4, 0.66, 0.6, 0.08, '#f7f7f7');
    rect(0.38, 0.38, 0.36, 0.4, '#c9b9a6');
    rect(0.38, 0.7, 0.36, 0.1, '#ececec');
    rect(0.56, 0.6, 0.07, 0.07, '#111111');
  } else {
    legs([-0.06, 0.08], 0.16, 0.05, '#e8a33a');
    rect(-0.24, 0.14, 0.42, 0.3, '#f4f4f4');
    rect(-0.3, 0.26, 0.1, 0.14, '#e0e0e0');
    rect(0.1, 0.36, 0.22, 0.28, '#f4f4f4');
    rect(0.32, 0.46, 0.1, 0.06, '#e8a33a');
    rect(0.3, 0.38, 0.06, 0.08, '#d33b2c');
    rect(0.22, 0.54, 0.05, 0.05, '#111111');
  }
}

export function drawBat(ctx: Ctx, x: number, y: number, b: number, t: number, phase: number) {
  const flap = Math.sin(t * 18 + phase) > 0;
  const s = b * 0.1;
  ctx.fillStyle = '#4a3a2a';
  ctx.fillRect(Math.round(x - s), Math.round(y - s), Math.ceil(s * 2), Math.ceil(s * 2.4));
  ctx.fillStyle = '#2f2419';
  if (flap) {
    ctx.fillRect(Math.round(x - s * 5), Math.round(y - s * 1.5), Math.ceil(s * 4), Math.ceil(s));
    ctx.fillRect(Math.round(x + s), Math.round(y - s * 1.5), Math.ceil(s * 4), Math.ceil(s));
  } else {
    ctx.fillRect(Math.round(x - s * 4), Math.round(y), Math.ceil(s * 3), Math.ceil(s * 1.6));
    ctx.fillRect(Math.round(x + s), Math.round(y), Math.ceil(s * 3), Math.ceil(s * 1.6));
  }
  ctx.fillStyle = '#ff5050';
  ctx.fillRect(Math.round(x - s * 0.7), Math.round(y - s * 0.4), Math.ceil(s * 0.5), Math.ceil(s * 0.5));
  ctx.fillRect(Math.round(x + s * 0.2), Math.round(y - s * 0.4), Math.ceil(s * 0.5), Math.ceil(s * 0.5));
}
