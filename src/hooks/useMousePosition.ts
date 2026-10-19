import { useEffect, useState } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/** True on devices with a precise hovering pointer (a mouse or trackpad). */
export function useFinePointer(): boolean {
  const [isFine, setIsFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(FINE_POINTER_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsFine(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return isFine;
}

/**
 * Pointer position as motion values, so consumers can animate from it
 * without re-rendering React on every mouse move.
 */
export function useMousePosition(enabled = true): { x: MotionValue<number>; y: MotionValue<number> } {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, x, y]);

  return { x, y };
}
