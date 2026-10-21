import { useEffect, useRef } from 'react';
import { blockCanvas, type BlockName } from './textures';
import { drawBat, drawMob, type Bat, type Mob, type MobKind } from './mobs';
import { isSoundEnabled, setAmbience, sfx, type Material, type Zone } from './sound';
import type { Weather } from './gameContext';
import { generateWorld, rowShade, WORLD_ROWS, ZONES, type World } from './worldGen';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Fixed, full-screen pixel-art world behind the whole site. Scrolling the page
 * moves the camera down through the world, so each section sits in its own
 * layer: sky and surface, caves, deepslate, the Nether, The End.
 */

const TILE = 16; // texture pixels per block in the baked terrain

// Which world row sits at the top of the screen when each section reaches the top.
const ANCHORS: [string, number][] = [
  ['hero', 0],
  ['stack', 12],
  ['about', 28],
  ['focus', 46],
  ['skills', 62],
  ['projects', 80],
  ['experience', 104],
  ['education', 126],
  ['certifications', ZONES.nether - 1],
  ['contact', ZONES.end - 2],
];

// What the camera is passing through, for footsteps and the sound mix.
function materialAt(row: number): Material {
  if (row < ZONES.surface + 3) return 'grass';
  if (row < ZONES.surface + 6) return 'dirt';
  if (row < ZONES.deepslate) return 'stone';
  if (row < ZONES.nether) return 'deepslate';
  if (row < ZONES.end) return 'netherrack';
  return 'endstone';
}

function zoneAt(row: number): Zone {
  if (row < ZONES.surface + 6) return 'surface';
  if (row < ZONES.nether) return 'cave';
  if (row < ZONES.end) return 'nether';
  return 'end';
}

interface Cloud {
  x: number;
  row: number;
  w: number;
  speed: number;
}

function bake(world: World): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = world.cols * TILE;
  canvas.height = world.rows * TILE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.imageSmoothingEnabled = false;

  for (let row = 0; row < world.rows; row++) {
    for (let col = 0; col < world.cols; col++) {
      const cell = world.cells[row][col];
      const x = col * TILE;
      const y = row * TILE;
      if (cell === 'sky' || cell === 'void') continue;
      if (cell === 'cave') {
        ctx.drawImage(blockCanvas(row >= ZONES.deepslate ? 'deepslate' : 'stone'), x, y);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
        ctx.fillRect(x, y, TILE, TILE);
      } else if (cell === 'nether') {
        ctx.drawImage(blockCanvas('netherrack'), x, y);
        ctx.fillStyle = 'rgba(20, 0, 0, 0.72)';
        ctx.fillRect(x, y, TILE, TILE);
      } else {
        ctx.drawImage(blockCanvas(cell as BlockName), x, y);
      }
    }
    const shade = rowShade(row);
    if (shade > 0) {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = `rgba(0, 0, 0, ${shade})`;
      ctx.fillRect(0, row * TILE, canvas.width, TILE);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  return canvas;
}

interface WorldBackgroundProps {
  night: boolean;
  weather: Weather;
}

export function WorldBackground({ night, weather }: WorldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const nightRef = useRef(night);
  const weatherRef = useRef(weather);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    nightRef.current = night;
    weatherRef.current = weather;
    redrawRef.current();
  }, [night, weather]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    let block = 32;
    let world: World = generateWorld(1);
    let terrain = bake(world);
    let anchors: [number, number][] = [];
    let viewRows = 0;
    let clouds: Cloud[] = [];
    let stars: { x: number; y: number; s: number; p: number }[] = [];
    let mobs: Mob[] = [];
    let bats: Bat[] = [];
    let lastTime = 0;
    let flash = 0;
    let nextFlash = 4;
    let raf = 0;
    let last = 0;
    let dirty = true;
    let lastScroll = window.scrollY;
    let stepDistance = 0;

    const layout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      block = Math.round(Math.min(40, Math.max(24, w / 40)));
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingEnabled = false;
      viewRows = h / block;
      const cols = Math.ceil(w / block) + 1;
      if (cols !== world.cols) {
        world = generateWorld(cols);
        terrain = bake(world);
        clouds = Array.from({ length: Math.max(3, Math.round(cols / 7)) }, (_, i) => ({
          x: (i / Math.max(3, Math.round(cols / 7))) * cols + (i % 2) * 3,
          row: 3 + ((i * 5) % 6),
          w: 4 + ((i * 7) % 5),
          speed: 0.25 + ((i * 3) % 4) * 0.08,
        }));
        const kinds: MobKind[] = ['pig', 'sheep', 'chicken'];
        mobs = Array.from({ length: Math.max(2, Math.round(cols / 10)) }, (_, i) => ({
          kind: kinds[i % kinds.length],
          x: 2 + ((i * 7.3) % Math.max(1, cols - 4)),
          dir: i % 2 ? 1 : -1,
          speed: 0.5 + (i % 3) * 0.2,
          walking: i % 2 === 0,
          nextChange: 1 + (i % 4),
        }));
        bats = world.caveSpots
          .filter((_, i) => i % 9 === 0)
          .slice(0, 10)
          .map(([col, row], i) => ({ col, row, phase: i * 1.3 }));
        stars = Array.from({ length: 140 }, (_, i) => ({
          x: ((i * 7919) % 1000) / 1000,
          y: ((i * 104729) % 1000) / 1000,
          s: 1 + (i % 3),
          p: i * 0.7,
        }));
      }
      const scrollTop = (id: string) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : null;
      };
      anchors = [];
      for (const [id, row] of ANCHORS) {
        const top = scrollTop(id);
        if (top !== null) anchors.push([top, row]);
      }
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - h);
      anchors.push([maxScroll, WORLD_ROWS - viewRows]);
      anchors.sort((a, b) => a[0] - b[0]);
      dirty = true;
    };

    const cameraRow = () => {
      const y = window.scrollY;
      if (!anchors.length) return 0;
      if (y <= anchors[0][0]) return anchors[0][1];
      for (let i = 1; i < anchors.length; i++) {
        const [y1, r1] = anchors[i];
        const [y0, r0] = anchors[i - 1];
        if (y <= y1) return r0 + ((y - y0) / Math.max(1, y1 - y0)) * (r1 - r0);
      }
      return anchors[anchors.length - 1][1];
    };

    const draw = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const cam = Math.max(0, Math.min(WORLD_ROWS - viewRows, cameraRow()));
      const camPx = cam * block;
      const isNight = nightRef.current;
      const weather = weatherRef.current;
      const wet = weather !== 'clear';
      const t = reducedMotion ? 0 : time / 1000;
      const dt = Math.min(0.1, Math.max(0, t - lastTime));
      lastTime = t;
      const rowY = (row: number) => row * block - camPx;
      const sound = isSoundEnabled();

      // Sound: the mix follows the layer in view, and scrolling makes footsteps.
      const midRow = cam + viewRows / 2;
      setAmbience(zoneAt(midRow), weather, isNight);
      const scrolled = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      stepDistance = scrolled > 900 ? 0 : stepDistance + scrolled;
      if (stepDistance > 160) {
        stepDistance = 0;
        if (sound) sfx.step(materialAt(midRow));
      }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0b0b0d';
      ctx.fillRect(0, 0, w, h);

      // Sky
      const skyBottom = rowY(ZONES.surface + 6);
      if (skyBottom > 0) {
        const g = ctx.createLinearGradient(0, rowY(0), 0, skyBottom);
        if (isNight) {
          g.addColorStop(0, wet ? '#04060c' : '#060b1f');
          g.addColorStop(1, wet ? '#141a2c' : '#1c2a55');
        } else {
          g.addColorStop(0, wet ? '#5f6f86' : '#5e95f2');
          g.addColorStop(1, wet ? '#9ba8b8' : '#b9d6ff');
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, skyBottom);

        if (isNight && !wet) {
          for (const s of stars) {
            const y = rowY(0) + s.y * (ZONES.surface - 2) * block;
            if (y > skyBottom) continue;
            ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 2 + s.p);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(Math.round(s.x * w), Math.round(y), s.s * 2, s.s * 2);
          }
          ctx.globalAlpha = 1;
        }

        // Sun or moon: a square, as it should be
        const size = block * 2.2;
        const sx = w * 0.74;
        const sy = rowY(3);
        if (wet) {
          // Sun and moon hide behind the rain clouds.
        } else if (isNight) {
          ctx.fillStyle = '#e4e6f0';
          ctx.fillRect(sx, sy, size, size);
          ctx.fillStyle = '#b9bccb';
          ctx.fillRect(sx + size * 0.2, sy + size * 0.25, size * 0.2, size * 0.2);
          ctx.fillRect(sx + size * 0.6, sy + size * 0.55, size * 0.25, size * 0.2);
        } else {
          ctx.fillStyle = 'rgba(255, 246, 170, 0.35)';
          ctx.fillRect(sx - size * 0.3, sy - size * 0.3, size * 1.6, size * 1.6);
          ctx.fillStyle = '#fff6a0';
          ctx.fillRect(sx, sy, size, size);
          ctx.fillStyle = '#fffbe0';
          ctx.fillRect(sx + size * 0.2, sy + size * 0.2, size * 0.6, size * 0.6);
        }

        // Clouds
        ctx.fillStyle = wet
          ? isNight
            ? 'rgba(60, 64, 78, 0.85)'
            : 'rgba(120, 126, 138, 0.92)'
          : isNight
            ? 'rgba(160, 170, 200, 0.35)'
            : 'rgba(255, 255, 255, 0.88)';
        for (const c of clouds) {
          const span = world.cols + c.w;
          const x = (((c.x + t * c.speed) % span) + span) % span - c.w;
          const px = x * block;
          const py = rowY(c.row);
          ctx.fillRect(px, py, c.w * block, block * 0.75);
          ctx.fillRect(px + block, py - block * 0.5, (c.w - 2) * block, block * 0.5);
        }
      }

      // The End: deep purple void with stars
      const endTop = rowY(ZONES.end);
      if (endTop < h) {
        const top = Math.max(0, endTop);
        ctx.fillStyle = '#100819';
        ctx.fillRect(0, top, w, h - top);
        for (const s of stars) {
          const y = endTop + s.y * (WORLD_ROWS - ZONES.end) * block;
          if (y < top || y > h) continue;
          ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t * 1.5 + s.p);
          ctx.fillStyle = s.p % 3 < 1 ? '#c9a7ff' : '#ffffff';
          ctx.fillRect(Math.round(s.x * w), Math.round(y), s.s * 2, s.s * 2);
        }
        ctx.globalAlpha = 1;
      }

      // Terrain
      const srcY = cam * TILE;
      const srcH = Math.min(viewRows + 1, WORLD_ROWS - cam) * TILE;
      ctx.drawImage(terrain, 0, srcY, terrain.width, srcH, 0, 0, world.cols * block, (srcH / TILE) * block);

      // Animals on the surface
      const surfaceVisible = rowY(ZONES.surface - 6) < h && rowY(ZONES.surface + 2) > 0;
      for (const m of mobs) {
        if (!reducedMotion) {
          m.nextChange -= dt;
          if (m.nextChange <= 0) {
            m.walking = !m.walking;
            if (Math.random() < 0.4) m.dir = m.dir === 1 ? -1 : 1;
            m.nextChange = 1.5 + Math.random() * 3;
          }
          if (m.walking) m.x += m.dir * m.speed * dt;
          if (m.x < 1 || m.x > world.cols - 2) {
            m.dir = m.dir === 1 ? -1 : 1;
            m.x = Math.min(world.cols - 2, Math.max(1, m.x));
          }
        }
        if (!surfaceVisible) continue;
        const col = Math.min(world.cols - 1, Math.max(0, Math.round(m.x)));
        drawMob(ctx, m, m.x * block, rowY(world.surface[col]), block, t);
        if (sound && Math.random() < dt / 22) sfx.mob(m.kind, ((m.x * block) / w) * 2 - 1);
      }

      // Bats in the caves
      for (const bat of bats) {
        const by = rowY(bat.row) + Math.cos(t * 1.3 + bat.phase) * block * 0.8;
        if (by < -block || by > h + block) continue;
        const bx = (bat.col + 0.5) * block + Math.sin(t * 0.9 + bat.phase) * block * 1.6;
        ctx.globalAlpha = 0.85;
        drawBat(ctx, bx, by, block, t, bat.phase);
        ctx.globalAlpha = 1;
        if (sound && Math.random() < dt / 16) sfx.mob('bat', (bx / w) * 2 - 1);
      }

      if (isNight && skyBottom > 0) {
        ctx.fillStyle = 'rgba(8, 12, 40, 0.45)';
        ctx.fillRect(0, 0, w, Math.min(h, rowY(ZONES.surface + 10)));
      }

      // Light sources glow through the darkness
      const firstRow = Math.floor(cam) - 1;
      const lastRow = firstRow + Math.ceil(viewRows) + 2;
      for (const e of world.emissive) {
        if (e.row < firstRow || e.row > lastRow) continue;
        const x = e.col * block;
        const y = rowY(e.row);
        const flicker = reducedMotion ? 1 : 0.85 + 0.15 * Math.sin(t * 9 + e.col * 1.7 + e.row);
        let glow = 'rgba(255, 150, 40, 0.18)';
        let radius = block * 1.6;
        if (e.kind === 'lava') {
          ctx.drawImage(blockCanvas('lava'), 0, (t * 3) % 16, 16, 16 - ((t * 3) % 16), x, y, block, block * (1 - ((t * 3) % 16) / 16));
          ctx.drawImage(blockCanvas('lava'), 0, 0, 16, (t * 3) % 16, x, y + block * (1 - ((t * 3) % 16) / 16), block, block * (((t * 3) % 16) / 16));
          glow = 'rgba(255, 110, 20, 0.16)';
        } else if (e.kind === 'glowstone') {
          ctx.drawImage(blockCanvas('glowstone'), x, y, block, block);
          glow = 'rgba(255, 220, 120, 0.2)';
        } else if (e.kind === 'portal') {
          ctx.fillStyle = `rgba(${120 + Math.round(40 * Math.sin(t * 3 + e.row))}, 40, 220, 0.9)`;
          ctx.fillRect(x, y, block, block);
          ctx.fillStyle = 'rgba(210, 160, 255, 0.5)';
          const k = Math.floor(t * 6 + e.col * 3 + e.row) % 4;
          ctx.fillRect(x + (k * block) / 4, y + ((3 - k) * block) / 4, block / 4, block / 4);
          glow = 'rgba(150, 70, 255, 0.22)';
          radius = block * 2.2;
        } else if (e.kind === 'torch') {
          ctx.fillStyle = '#6b4a2b';
          ctx.fillRect(x + block * 0.44, y + block * 0.45, block * 0.12, block * 0.55);
          ctx.fillStyle = '#ffd66b';
          ctx.fillRect(x + block * 0.4, y + block * 0.3, block * 0.2, block * 0.18);
          glow = `rgba(255, 190, 80, ${0.22 * flicker})`;
          radius = block * 2.6;
        } else if (e.kind === 'crystal') {
          ctx.fillStyle = '#ff9be8';
          ctx.fillRect(x + block * 0.25, y + block * 0.15, block * 1.5, block * 0.9);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + block * 0.7, y + block * 0.4, block * 0.6, block * 0.35);
          glow = 'rgba(255, 140, 230, 0.25)';
          radius = block * 3;
        }
        const g = ctx.createRadialGradient(x + block / 2, y + block / 2, 0, x + block / 2, y + block / 2, radius);
        g.addColorStop(0, glow);
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(x + block / 2 - radius, y + block / 2 - radius, radius * 2, radius * 2);
      }

      // Rain falls only where there is open sky
      const rainBottom = Math.min(h, rowY(ZONES.surface + 1));
      if (wet && rainBottom > 0) {
        ctx.strokeStyle = isNight ? 'rgba(140, 160, 210, 0.45)' : 'rgba(70, 90, 150, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const drops = Math.round(w / 6);
        for (let i = 0; i < drops; i++) {
          const x = (((i * 97.3) % w) + t * 40) % w;
          const y = (((i * 53.7) % (h + 60)) + t * (700 + (i % 5) * 60)) % (h + 60) - 40;
          if (y > rainBottom) continue;
          ctx.moveTo(x, y);
          ctx.lineTo(x - 3, y + 14);
        }
        ctx.stroke();
      }

      // Lightning during thunderstorms
      if (weather === 'thunder' && !reducedMotion) {
        nextFlash -= dt;
        if (nextFlash <= 0) {
          flash = 1;
          nextFlash = 6 + Math.random() * 8;
          window.setTimeout(() => sfx.thunder(), 250);
        }
      }
      if (flash > 0) {
        ctx.fillStyle = `rgba(235, 240, 255, ${(flash * (skyBottom > 0 ? 0.7 : 0.25)).toFixed(3)})`;
        ctx.fillRect(0, 0, w, h);
        flash = Math.max(0, flash - dt * 3.5);
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const animate = !reducedMotion && now - last > 1000 / 24;
      if (!dirty && !animate) return;
      last = now;
      dirty = false;
      draw(now);
    };

    const markDirty = () => {
      dirty = true;
    };
    redrawRef.current = markDirty;

    layout();
    raf = requestAnimationFrame(tick);
    window.addEventListener('scroll', markDirty, { passive: true });
    window.addEventListener('resize', layout);
    // Section heights change as content loads (fonts, images, lazy sections).
    const ro = new ResizeObserver(layout);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', markDirty);
      window.removeEventListener('resize', layout);
      ro.disconnect();
      redrawRef.current = () => {};
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
