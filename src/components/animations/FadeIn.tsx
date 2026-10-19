import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE_EDITORIAL } from './easing';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  /** Fraction of the element that must be visible before animating. */
  amount?: number;
  as?: 'div' | 'li' | 'article' | 'header' | 'p' | 'span';
}

/** Fades and slides its children into place, once, when they enter the viewport. */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 24,
  immediate = false,
  amount = 0.2,
  as = 'div',
}: FadeInProps) {
  const reducedMotion = useReducedMotion();
  const Component = motion[as];
  const hidden = { opacity: 0, x: reducedMotion ? 0 : x, y: reducedMotion ? 0 : y };
  const shown = { opacity: 1, x: 0, y: 0 };
  const transition = { duration: reducedMotion ? 0.2 : duration, delay: reducedMotion ? 0 : delay, ease: EASE_EDITORIAL };

  return immediate ? (
    <Component className={className} initial={hidden} animate={shown} transition={transition}>
      {children}
    </Component>
  ) : (
    <Component
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, amount }}
      transition={transition}
    >
      {children}
    </Component>
  );
}
