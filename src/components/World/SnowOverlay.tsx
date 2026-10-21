import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * While it snows, a light layer of pixel snowflakes drifts over the whole
 * page, in front of the content (the world canvas behind only snows above
 * ground). Clicks pass straight through, and it is skipped for reduced motion.
 */

interface Flake {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
}

export function SnowOverlay({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!active || reducedMotion || !canvas || !ctx) return undefined;

    let flakes: Flake[] = [];
    let raf = 0;
    let last = 0;
    let fade = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.round(Math.min(90, canvas.width / 16));
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.floor(Math.random() * 3) * 2,
        speed: 30 + Math.random() * 50,
        sway: 8 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || now - last < 1000 / 30) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      fade = Math.min(1, fade + dt / 1.5);
      const t = now / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const f of flakes) {
        f.y += f.speed * dt;
        if (f.y > canvas.height + 8) {
          f.y = -8;
          f.x = Math.random() * canvas.width;
        }
        const x = f.x + Math.sin(t * 0.9 + f.phase) * f.sway;
        // Bigger flakes are nearer and brighter.
        ctx.fillStyle = `rgba(255, 255, 255, ${((0.35 + f.size * 0.08) * fade).toFixed(3)})`;
        ctx.fillRect(Math.round(x), Math.round(f.y), f.size, f.size);
      }
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, reducedMotion]);

  if (!active || reducedMotion) return null;
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[44] h-full w-full" />;
}
