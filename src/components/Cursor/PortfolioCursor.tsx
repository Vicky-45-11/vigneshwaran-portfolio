import { lazy, Suspense } from 'react';
import { useFinePointer } from '../../hooks/useMousePosition';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// The fluid simulation is loaded on demand so it never delays the first paint.
const SplashCursor = lazy(() => import('./SplashCursor'));

/**
 * Site-wide cursor effect: React Bits' SplashCursor in the portfolio's blue and
 * cyan. Skipped for reduced-motion visitors; touch screens get a lighter
 * simulation. Without WebGL2 the component renders nothing.
 */
export function PortfolioCursor() {
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();

  if (reducedMotion) return null;

  return (
    <Suspense fallback={null}>
      <SplashCursor
        rainbow={false}
        colors={['#3B82F6', '#22D3EE', '#60A5FA']}
        size={1}
        force={1}
        swirl={3}
        trail={1}
        intensity={finePointer ? 1 : 0.8}
        quality={finePointer ? 'high' : 'low'}
        clickSplash
        intro
        zIndex={45}
      />
    </Suspense>
  );
}
