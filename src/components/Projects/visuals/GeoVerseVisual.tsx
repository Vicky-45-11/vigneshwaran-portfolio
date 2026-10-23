import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { VisualFrame } from './VisualFrame';

// Canvas dot-globe. About 1,400 points on a sphere are lit as "land" by a cheap
// procedural mask (decorative, not a real coastline), rotate in 3D, tilt with the
// pointer and can be dragged. The camera turns to each of five real places in
// turn, ringing the marker and drawing an arc from the previous one.

const PLACES = [
  { name: 'Himalaya', lat: 28, lon: 86 },
  { name: 'Amazon Basin', lat: -3, lon: -60 },
  { name: 'Sahara', lat: 23, lon: 13 },
  { name: 'Great Barrier Reef', lat: -18, lon: 147 },
  { name: 'Antarctica', lat: -80, lon: 0 },
];
const POINTS = 2600;
const rad = (d: number) => (d * Math.PI) / 180;

function land(lat: number, lon: number) {
  const a = rad(lat), o = rad(lon);
  const n = Math.sin(a * 3 + Math.sin(o * 2) * 1.3) + Math.sin(o * 3 - a * 2) * 0.7 + Math.sin(o * 5 + a) * 0.35;
  return n > 0.05 || lat < -66;
}
const toVec = (lat: number, lon: number, r = 1): [number, number, number] => {
  const a = rad(lat), o = rad(lon);
  return [r * Math.cos(a) * Math.sin(o), r * Math.sin(a), r * Math.cos(a) * Math.cos(o)];
};

const dots = Array.from({ length: POINTS }, (_, i) => {
  const y = 1 - (i / (POINTS - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const th = i * 2.399963;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = ((Math.atan2(Math.sin(th) * r, Math.cos(th) * r) * 180) / Math.PI);
  return { v: [r * Math.sin(rad(lon)), y, r * Math.cos(rad(lon))] as [number, number, number], land: land(lat, lon) };
});

export function GeoVerseVisual() {
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const inView = useInView(frame, { margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const live = useRef({ inView: false });
  const [label, setLabel] = useState(PLACES[0].name);
  useEffect(() => { live.current.inView = inView; }, [inView]);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const st = { yaw: rad(-86), pitch: rad(20), dragYaw: 0, dragPitch: 0, px: 0, py: 0, drag: false, lx: 0, ly: 0, active: 0, t0: performance.now(), lastSwap: 0 };
    let raf = 0, w = 0, h = 0, last = performance.now();

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.max(1, Math.round(w * dpr)); cv.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);

    const down = (e: PointerEvent) => { st.drag = true; st.lx = e.clientX; st.ly = e.clientY; cv.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      st.px = (e.clientX - r.left) / r.width - 0.5; st.py = (e.clientY - r.top) / r.height - 0.5;
      if (st.drag) { st.dragYaw += (e.clientX - st.lx) * 0.01; st.dragPitch = Math.max(-0.6, Math.min(0.6, st.dragPitch + (e.clientY - st.ly) * 0.006)); st.lx = e.clientX; st.ly = e.clientY; }
    };
    const up = () => { st.drag = false; };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!live.current.inView) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const t = (now - st.t0) / 1000;
      if (!reduce && now - st.lastSwap > 2800) { st.active = (st.active + 1) % PLACES.length; st.lastSwap = now; setLabel(PLACES[st.active].name); }
      const target = PLACES[st.active];
      const ty = -rad(target.lon), tp = rad(target.lat) * 0.55;
      if (!st.drag) st.dragYaw *= 1 - Math.min(1, dt * 0.8);
      st.yaw += (ty - st.yaw + 0) * Math.min(1, dt * 2.2) * (reduce ? 0 : 1);
      st.pitch += (tp + 0.25 - st.pitch) * Math.min(1, dt * 2.2) * (reduce ? 0 : 1);
      const yaw = st.yaw + st.dragYaw + st.px * 0.3, pitch = st.pitch + st.dragPitch + st.py * 0.25;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const R = Math.min(w, h) * 0.36, cx = w / 2, cyy = h / 2;
      const proj = (v: [number, number, number], s = 1): [number, number, number] => {
        const x1 = v[0] * cy - v[2] * sy, z1 = v[0] * sy + v[2] * cy;
        const y2 = v[1] * cp - z1 * sp, z2 = v[1] * sp + z1 * cp;
        return [cx + x1 * R * s, cyy - y2 * R * s, z2];
      };
      ctx.clearRect(0, 0, w, h);
      // atmosphere glow
      const g = ctx.createRadialGradient(cx, cyy, R * 0.8, cx, cyy, R * 1.45);
      g.addColorStop(0, 'rgba(124,255,107,0.22)'); g.addColorStop(1, 'rgba(124,255,107,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cyy, R * 1.45, 0, 7); ctx.fill();
      ctx.fillStyle = '#07120c'; ctx.beginPath(); ctx.arc(cx, cyy, R, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(124,255,107,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cyy, R, 0, 7); ctx.stroke();
      // dots (back side faint, front side bright)
      for (const d of dots) {
        const [x, y, z] = proj(d.v);
        if (z < -0.05) { if (d.land) { ctx.fillStyle = 'rgba(124,255,107,0.07)'; ctx.fillRect(x, y, 1.5, 1.5); } continue; }
        const a = 0.25 + z * 0.75;
        ctx.fillStyle = d.land ? `rgba(124,255,107,${a})` : `rgba(80,140,110,${a * 0.28})`;
        const s = d.land ? 1.2 + z * 1.4 : 1;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      // scan line sweeping across the globe
      const sweep = ((t * 0.5) % 1) * 2 - 1;
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(cx - R, cyy + sweep * R - 1, R * 2, 2);
      // arc from previous place to the active one, drawn progressively
      const prev = PLACES[(st.active + PLACES.length - 1) % PLACES.length];
      const prog = Math.min(1, (now - st.lastSwap) / 1400);
      const a = toVec(prev.lat, prev.lon), b = toVec(target.lat, target.lon);
      const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), om = Math.acos(dot) || 1e-3;
      ctx.beginPath(); let started = false;
      for (let k = 0; k <= 40 * prog; k++) {
        const u = k / 40, s1 = Math.sin((1 - u) * om) / Math.sin(om), s2 = Math.sin(u * om) / Math.sin(om), lift = 1 + 0.22 * Math.sin(Math.PI * u);
        const v: [number, number, number] = [(a[0] * s1 + b[0] * s2), (a[1] * s1 + b[1] * s2), (a[2] * s1 + b[2] * s2)];
        const [x, y, z] = proj(v, lift);
        if (z < -0.1) { started = false; continue; }
        if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255,212,71,0.9)'; ctx.lineWidth = 1.6; ctx.stroke();
      // markers
      PLACES.forEach((p, i) => {
        const [x, y, z] = proj(toVec(p.lat, p.lon));
        if (z < 0) return;
        const on = i === st.active;
        ctx.fillStyle = on ? '#ffd447' : '#7cff6b'; ctx.fillRect(x - 3, y - 3, 6, 6);
        if (on) {
          const ph = (t * 1.2) % 1;
          ctx.strokeStyle = `rgba(255,212,71,${1 - ph})`; ctx.lineWidth = 1.5; ctx.strokeRect(x - 5 - ph * 14, y - 5 - ph * 14, 10 + ph * 28, 10 + ph * 28);
        }
      });
      // orbiting satellite
      const oa = t * 0.9;
      const ox = cx + Math.cos(oa) * R * 1.42, oy = cyy + Math.sin(oa) * R * 0.4;
      ctx.fillStyle = '#fff'; ctx.fillRect(ox - 2.5, oy - 2.5, 5, 5);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.ellipse(cx, cyy, R * 1.42, R * 0.4, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up); cv.removeEventListener('pointercancel', up); };
  }, [reduce]);

  return (
    <VisualFrame title="world_explorer.glsl" frameRef={frame}>
      <div className="flex h-full flex-col">
        <canvas ref={canvas} className="min-h-[14rem] w-full flex-1 cursor-grab touch-pan-y active:cursor-grabbing" aria-hidden="true" />
        <p className="label-mono flex items-center justify-between text-accent-light" aria-hidden="true">
          <span>focus // {label}</span>
          <span className="text-mist-muted">drag to spin</span>
        </p>
      </div>
    </VisualFrame>
  );
}
