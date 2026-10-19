import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useFinePointer } from '../../hooks/useMousePosition';
import type { NeuralOrbController, OrbDetail } from './neuralOrbScene';

interface NeuralOrbProps {
  className?: string;
  /** Force a detail level; by default small screens get the lite version. */
  detail?: OrbDetail;
}

let webglSupport: boolean | undefined;
function supportsWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const canvas = document.createElement('canvas');
    webglSupport = Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/** CSS-only stand-in, shown while three.js loads and whenever WebGL is unavailable. */
function OrbFallback() {
  return (
    <div className="orb-fallback absolute inset-0 m-auto aspect-square w-[62%]" aria-hidden="true">
      <span className="orb-fallback__ring" />
      <span className="orb-fallback__ring orb-fallback__ring--inner" />
      <span className="orb-fallback__core" />
    </div>
  );
}

/**
 * Lightweight 3D neural visualisation. three.js is fetched on demand, the render
 * loop only runs while the orb is on screen, and any failure falls back to CSS.
 */
export function NeuralOrb({ className = '', detail }: NeuralOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>(() => (supportsWebGL() ? 'loading' : 'fallback'));

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !supportsWebGL()) return;

    let controller: NeuralOrbController | undefined;
    let cancelled = false;
    let visible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        controller?.setActive(visible);
      },
      { rootMargin: '100px' },
    );
    observer.observe(container);

    import('./neuralOrbScene')
      .then(({ createNeuralOrb }) => {
        if (cancelled) return;
        controller = createNeuralOrb(container, {
          detail: detail ?? (window.innerWidth < 768 ? 'lite' : 'full'),
          reducedMotion,
          interactive: finePointer,
        });
        controller.setActive(visible);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        console.warn('Neural orb unavailable, using fallback.', error);
        if (!cancelled) setStatus('fallback');
      });

    return () => {
      cancelled = true;
      observer.disconnect();
      controller?.dispose();
    };
  }, [detail, reducedMotion, finePointer]);

  return (
    <div className={`relative pointer-events-none select-none ${className}`} aria-hidden="true">
      {status !== 'ready' && <OrbFallback />}
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-opacity duration-700 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
