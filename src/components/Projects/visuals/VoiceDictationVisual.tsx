import { useEffect, useState } from 'react';
import { VisualFrame } from './VisualFrame';
import { useCycle } from './useCycle';

// Decorative dictation panel: a waveform while "listening", then a raw
// transcript whose filler words are struck out to leave clean text.

const RAW = ['so', 'um', 'the', 'meeting', 'is', 'like', 'moved', 'to', 'uh', 'Friday', 'at', 'three'];
const FILLERS = new Set(['um', 'like', 'uh']);

export function VoiceDictationVisual() {
  const { ref, step, reduce } = useCycle(3, 2300);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduce || step !== 0) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 120);
    return () => window.clearInterval(id);
  }, [step, reduce]);
  const labels = ['listening', 'raw transcript', 'cleaned'];
  return (
    <VisualFrame title="dictation.txt" frameRef={ref}>
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex h-24 items-center justify-center gap-1" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => {
            const h = step === 0 && !reduce ? 18 + Math.abs(Math.sin((i + tick) * 0.7) * 70) : 14;
            return <span key={i} className="w-1.5 bg-accent-light transition-[height] duration-100" style={{ height: `${h}%`, opacity: step === 0 ? 1 : 0.35 }} />;
          })}
        </div>
        <p className="min-h-[5rem] text-lg leading-relaxed text-white" aria-hidden="true">
          {step === 0 ? (
            <span className="text-mist-muted">Speak…</span>
          ) : (
            RAW.map((w, i) => {
              const filler = FILLERS.has(w);
              if (step === 2 && filler) return null;
              return (
                <span key={i} className={step === 1 && filler ? 'text-[#ff5f56] line-through' : ''}>
                  {w}{' '}
                </span>
              );
            })
          )}
        </p>
        <p className="label-mono text-accent-light" aria-hidden="true">status // {labels[step]}</p>
      </div>
    </VisualFrame>
  );
}
