import { useRef, type ReactNode, type PointerEvent } from 'react';
import { useFinePointer } from '../../hooks/useMousePosition';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MagnetProps {
  children: ReactNode;
  /** How far (in px) the element can travel toward the pointer. */
  strength?: number;
  className?: string;
}

/**
 * Pulls its child toward the pointer. Writes the transform directly to the DOM
 * so hovering never re-renders React. Inert on touch screens and reduced motion.
 */
export function Magnet({ children, strength = 14, className = '' }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const enabled = finePointer && !reducedMotion;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate3d(0, 0, 0)';
  };

  return (
    <div
      ref={ref}
      className={`inline-block transition-transform duration-200 ease-out will-change-transform ${className}`}
      onPointerMove={enabled ? onPointerMove : undefined}
      onPointerLeave={enabled ? reset : undefined}
    >
      {children}
    </div>
  );
}
