import { useEffect, useRef } from 'react';
import { blockColors, type BlockName } from './textures';
import { sfx, type Material } from './sound';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Clicking anywhere breaks a "block": a burst of pixel particles in the colours
 * of the layer you are in (grass near the top, stone, deepslate, netherrack,
 * end stone further down). Purely decorative; clicks pass straight through.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  born: number;
}

const LIFE_MS = 750;

const MATERIAL: Partial<Record<BlockName, Material>> = {
  grassSide: 'grass',
  dirt: 'dirt',
  stone: 'stone',
  deepslate: 'deepslate',
  netherrack: 'netherrack',
  endStone: 'endstone',
};

function layerBlock(): BlockName {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const f = max > 0 ? window.scrollY / max : 0;
  if (f < 0.08) return 'grassSide';
  if (f < 0.12) return 'dirt';
  if (f < 0.55) return 'stone';
  if (f < 0.72) return 'deepslate';
  if (f < 0.86) return 'netherrack';
  return 'endStone';
}

export function BlockBreak() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (reducedMotion || !canvas || !ctx) return undefined;

    let particles: Particle[] = [];
    let raf = 0;
    const palettes = new Map<BlockName, string[]>();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const tick = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => now - p.born < LIFE_MS);
      for (const p of particles) {
        p.vy += 0.38;
        p.x += p.vx;
        p.y += p.vy;
        ctx.globalAlpha = 1 - (now - p.born) / LIFE_MS;
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      ctx.globalAlpha = 1;
      raf = particles.length ? requestAnimationFrame(tick) : 0;
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;
      const block = layerBlock();
      if (target?.closest('[data-sound]')) {
        // The element plays its own sound.
      } else if (target?.closest('a, button, [role="button"]')) sfx.click();
      else sfx.dig(MATERIAL[block] ?? 'stone', (e.clientX / window.innerWidth) * 2 - 1);
      let colors = palettes.get(block);
      if (!colors) {
        colors = blockColors(block, 8);
        palettes.set(block, colors);
      }
      const now = performance.now();
      for (let i = 0; i < 16; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 14,
          y: e.clientY + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 6,
          vy: -2 - Math.random() * 5,
          size: 4 + Math.floor(Math.random() * 4),
          color: colors[i % colors.length],
          born: now,
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[65] h-full w-full" />;
}
