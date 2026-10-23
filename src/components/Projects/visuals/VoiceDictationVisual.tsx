import { useEffect, useRef } from 'react';
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from 'framer-motion';
import { VisualFrame } from './VisualFrame';
import { useCycle } from './useCycle';

// Dictation panel. A smooth multi-layer waveform (canvas) swells while
// "listening". Then the raw transcript appears word by word, filler words flash
// red and are struck out, and the cleaned sentence closes up around the gaps.

const RAW = ['so', 'um', 'the', 'meeting', 'is', 'like', 'moved', 'to', 'uh', 'Friday', 'at', 'three'];
const FILLERS = new Set(['um', 'like', 'uh']);
const SEQ = 16; // ticks of 350ms

export function VoiceDictationVisual() {
  const { ref, step, reduce } = useCycle(SEQ, 350);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cvView = useInView(canvas);
  const noMotion = useReducedMotion();
  const listening = step < 5;
  const words = listening ? 0 : Math.min(RAW.length, step - 4);
  const cleaning = step >= 12;
  const amp = useRef(0);
  useEffect(() => { amp.current = listening ? 1 : 0.12; }, [listening]);

  useEffect(() => {
    const cv = canvas.current; const ctx = cv?.getContext('2d');
    if (!cv || !ctx || !cvView) return;
    let raf = 0, a = 0;
    const resize = () => { const r = cv.getBoundingClientRect(); const d = Math.min(devicePixelRatio || 1, 2); cv.width = r.width * d; cv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    resize(); const ro = new ResizeObserver(resize); ro.observe(cv);
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const r = cv.getBoundingClientRect(); const w = r.width, h = r.height, t = now / 1000;
      a += (amp.current - a) * 0.08;
      ctx.clearRect(0, 0, w, h);
      const layers = [['rgba(124,255,107,0.9)', 1, 2.2], ['rgba(124,255,107,0.45)', 1.6, 1.4], ['rgba(255,255,255,0.3)', 2.3, 1]] as const;
      layers.forEach(([col, f, lw], li) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const u = x / w, env = Math.sin(Math.PI * u) ** 1.5;
          const y = h / 2 + Math.sin(u * 14 * f + t * (3 + li)) * Math.sin(u * 5 - t * 1.3 + li) * env * (h * 0.4) * (noMotion ? 0.2 : a) + Math.sin(u * 40 + t * 9) * env * 3 * a;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke();
      });
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [cvView, noMotion]);

  const status = listening ? 'listening' : cleaning ? 'cleaned' : 'transcribing';
  return (
    <VisualFrame title="dictation.txt" frameRef={ref}>
      <div className="flex h-full flex-col justify-between gap-3">
        <canvas ref={canvas} className="h-24 w-full" aria-hidden="true" />
        <LayoutGroup>
          <motion.p layout className="min-h-[5.5rem] text-lg leading-relaxed text-white" aria-hidden="true">
            {listening && <span className="text-mist-muted">Speak…</span>}
            <AnimatePresence initial={false}>
              {RAW.slice(0, words).map((w, i) => {
                const filler = FILLERS.has(w);
                if (cleaning && filler) return null;
                return (
                  <motion.span
                    key={w + i}
                    layout
                    initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)', color: filler && words >= 10 ? '#ff5f56' : '#ffffff' }}
                    exit={{ opacity: 0, scale: 0.4, y: -10, filter: 'blur(3px)' }}
                    transition={{ duration: reduce ? 0 : 0.28 }}
                    className={`inline-block pr-[0.3em] ${filler && words >= 10 ? 'line-through' : ''}`}
                  >
                    {w}
                  </motion.span>
                );
              })}
            </AnimatePresence>
            {cleaning && <motion.span layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-accent-light">.</motion.span>}
          </motion.p>
        </LayoutGroup>
        <p className="label-mono text-accent-light" aria-hidden="true">status // {status}</p>
      </div>
    </VisualFrame>
  );
}
