import { useEffect, useRef } from 'react';

/**
 * Display type whose letters condense out of a mist of particles, hold, then
 * drift away as vapor and re-form. The real text stays in the DOM (readable,
 * selectable, styled by CSS); a canvas behind it draws the vapor.
 *
 * Written for this site in the spirit of React Bits Pro "Vapor Type". It can be
 * swapped for the Pro component once the licensed registry is reachable.
 */

interface VaporLine {
  text: string;
  /** Class for every letter, e.g. a gradient text fill. */
  letterClassName?: string;
}

interface VaporTypeProps {
  lines: VaporLine[];
  /** Start the first condense when true (e.g. after the intro screen). */
  active: boolean;
  /** Static text, no canvas. */
  reducedMotion?: boolean;
  /** Seconds between vapor cycles once the text has formed. */
  interval?: number;
  /** Particle colour as "r, g, b". */
  color?: string;
}

type Phase = 'hidden' | 'condensing' | 'shown' | 'dissolving';

interface Letter {
  el: HTMLSpanElement;
  phase: Phase;
  start: number;
  points: Float32Array; // x, y pairs in canvas CSS pixels
}

interface Particle {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  start: number;
  life: number;
  size: number;
  condense: boolean;
}

const CONDENSE_MS = 1600;
const DISSOLVE_MS = 1800;
const LETTER_STAGGER_MS = 70;
const MAX_POINTS_PER_LETTER = 260;
const BLEED = 160; // canvas extends past the text so vapor can drift out

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t;

function sampleGlyph(el: HTMLSpanElement, origin: DOMRect): Float32Array {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const fontSize = parseFloat(style.fontSize);
  const w = Math.ceil(rect.width);
  const h = Math.ceil(rect.height + fontSize * 0.3);
  if (!w || !h) return new Float32Array(0);

  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const ctx = off.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(0);
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(el.textContent ?? '', 0, rect.height / 2);

  const data = ctx.getImageData(0, 0, w, h).data;
  const step = Math.max(3, Math.round(fontSize / 24));
  const pts: number[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 128) pts.push(rect.left - origin.left + BLEED + x, rect.top - origin.top + BLEED + y);
    }
  }
  // Thin out evenly if the glyph is large.
  const count = pts.length / 2;
  if (count <= MAX_POINTS_PER_LETTER) return new Float32Array(pts);
  const out = new Float32Array(MAX_POINTS_PER_LETTER * 2);
  for (let i = 0; i < MAX_POINTS_PER_LETTER; i++) {
    const j = Math.floor((i * count) / MAX_POINTS_PER_LETTER) * 2;
    out[i * 2] = pts[j];
    out[i * 2 + 1] = pts[j + 1];
  }
  return out;
}

export function VaporType({ lines, active, reducedMotion = false, interval = 7, color = '215, 226, 234' }: VaporTypeProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (reducedMotion || !active || !root || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    // One soft, round puff, drawn scaled for every particle so the vapor reads as mist rather than dust.
    const puff = document.createElement('canvas');
    puff.width = puff.height = 64;
    const pctx = puff.getContext('2d');
    if (pctx) {
      const g = pctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, `rgba(${color}, 1)`);
      g.addColorStop(0.35, `rgba(${color}, 0.45)`);
      g.addColorStop(1, `rgba(${color}, 0)`);
      pctx.fillStyle = g;
      pctx.fillRect(0, 0, 64, 64);
    }

    const letters: Letter[] = [...root.querySelectorAll<HTMLSpanElement>('[data-vapor-letter]')].map((el) => ({
      el,
      phase: 'hidden',
      start: 0,
      points: new Float32Array(0),
    }));
    const lineOf = letters.map((l) => Number(l.el.dataset.vaporLine));
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;
    let nextCycle = 0;
    let cycleLine = lineOf[lineOf.length - 1] ?? 0;

    const resize = () => {
      const box = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = box.width + BLEED * 2;
      const ch = box.height + BLEED * 2;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const l of letters) l.points = sampleGlyph(l.el, box);
    };

    const paintLetter = (l: Letter, v: number, drift: number) => {
      // v: 0 = vapor, 1 = solid. drift: upward offset while dissolving.
      l.el.style.opacity = String(v);
      l.el.style.filter = v >= 0.999 ? '' : `blur(${((1 - v) * 18).toFixed(2)}px)`;
      l.el.style.transform = v >= 0.999 ? '' : `translate3d(${(drift * 0.4).toFixed(1)}px, ${(-drift).toFixed(1)}px, 0) scale(${(1 + (1 - v) * 0.12).toFixed(3)})`;
    };

    const emit = (l: Letter, now: number, condense: boolean) => {
      const p = l.points;
      for (let i = 0; i < p.length; i += 2) {
        const angle = -Math.PI / 2 + (Math.random() - 0.3) * 1.6; // mostly up and to the right
        const dist = 50 + Math.random() * 140;
        const fx = p[i] + Math.cos(angle) * dist;
        const fy = p[i + 1] + Math.sin(angle) * dist;
        particles.push({
          x0: condense ? fx : p[i],
          y0: condense ? fy : p[i + 1],
          x1: condense ? p[i] : fx,
          y1: condense ? p[i + 1] : fy,
          start: now + Math.random() * 260,
          life: (condense ? CONDENSE_MS : DISSOLVE_MS) * (0.7 + Math.random() * 0.5),
          size: 4 + Math.random() * 8,
          condense,
        });
      }
    };

    const startPhase = (indices: number[], phase: 'condensing' | 'dissolving', now: number, delay = 0) => {
      indices.forEach((i, k) => {
        letters[i].phase = phase;
        letters[i].start = now + delay + k * LETTER_STAGGER_MS;
      });
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      // Letters
      for (const l of letters) {
        const t = now - l.start;
        if (t < 0) continue;
        if (l.phase === 'condensing') {
          if (!l.el.dataset.emitted) {
            emit(l, now, true);
            l.el.dataset.emitted = '1';
          }
          const k = Math.min(1, t / CONDENSE_MS);
          paintLetter(l, easeIn(Math.max(0, (k - 0.25) / 0.75)), 0);
          if (k >= 1) {
            l.phase = 'shown';
            delete l.el.dataset.emitted;
          }
        } else if (l.phase === 'dissolving') {
          if (!l.el.dataset.emitted) {
            emit(l, now, false);
            l.el.dataset.emitted = '1';
          }
          const k = Math.min(1, t / (DISSOLVE_MS * 0.55));
          paintLetter(l, 1 - easeOut(k), easeOut(k) * 22);
          if (k >= 1) {
            delete l.el.dataset.emitted;
            l.phase = 'condensing';
            l.start = now + 500;
          }
        }
      }

      // Cycle: once everything is solid, periodically let one line evaporate.
      const allShown = letters.every((l) => l.phase === 'shown');
      if (allShown && nextCycle === 0) nextCycle = now + interval * 1000;
      if (allShown && now >= nextCycle) {
        nextCycle = 0;
        const ids = letters.map((_, i) => i).filter((i) => lineOf[i] === cycleLine);
        startPhase(ids, 'dissolving', now);
        const lineCount = Math.max(...lineOf) + 1;
        cycleLine = (cycleLine + 1) % lineCount;
      }

      // Particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      const alive: Particle[] = [];
      for (const p of particles) {
        const t = (now - p.start) / p.life;
        if (t >= 1) continue;
        alive.push(p);
        if (t < 0) continue;
        const e = easeOut(t);
        const x = p.x0 + (p.x1 - p.x0) * e;
        const y = p.y0 + (p.y1 - p.y0) * e;
        ctx.globalAlpha = p.condense ? Math.sin(t * Math.PI) * 0.22 : (1 - t) * (1 - t) * 0.26;
        const s = p.size * (p.condense ? 1 + (1 - t) * 1.5 : 1 + t * 2.5);
        ctx.drawImage(puff, x - s / 2, y - s / 2, s, s);
      }
      particles = alive;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
    });
    io.observe(root);
    const onVisibility = () => {
      visible = !document.hidden;
    };

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      resize();
      for (const l of letters) paintLetter(l, 0, 0);
      startPhase(letters.map((_, i) => i), 'condensing', performance.now(), 150);
      raf = requestAnimationFrame(tick);
    });

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
      for (const l of letters) {
        l.el.style.opacity = '';
        l.el.style.filter = '';
        l.el.style.transform = '';
      }
    };
  }, [active, reducedMotion, interval, color]);

  const hideUntilActive = !reducedMotion && !active;

  return (
    <span ref={rootRef} className="relative block">
      <span className="sr-only">{lines.map((l) => l.text).join(' ')}</span>
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute -z-[1]"
          style={{ left: -BLEED, top: -BLEED }}
        />
      )}
      {lines.map((line, li) => (
        <span key={li} className="block whitespace-nowrap" aria-hidden="true">
          {[...line.text].map((ch, ci) =>
            ch === ' ' ? (
              ' '
            ) : (
              <span
                key={ci}
                data-vapor-letter=""
                data-vapor-line={li}
                className={`inline-block will-change-[filter,opacity,transform] ${line.letterClassName ?? ''}`}
                style={hideUntilActive ? { opacity: 0 } : undefined}
              >
                {ch}
              </span>
            ),
          )}
        </span>
      ))}
    </span>
  );
}
