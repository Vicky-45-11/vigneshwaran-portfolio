import { Fragment, useRef, type CSSProperties } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

/**
 * Scroll-driven character reveal: each character goes from 0.2 to full opacity
 * as the paragraph moves through the viewport.
 *
 * A single scroll value is written to the `--reveal` CSS variable and every
 * character derives its own opacity from it in CSS, so there is one scroll
 * subscription no matter how long the text is. Words stay unbroken, and screen
 * readers get the plain sentence from the visually hidden copy.
 */
export function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] });

  const words = text.split(' ');
  const total = text.length;
  let index = 0;

  return (
    <motion.p
      ref={ref}
      className={className}
      style={{ '--reveal': reducedMotion ? 1 : scrollYProgress, '--total': total } as unknown as CSSProperties}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => {
          const chars = word.split('').map((char) => {
            const i = index++;
            return (
              <span
                key={i}
                style={{ opacity: `calc(0.2 + 0.8 * clamp(0, var(--reveal) * var(--total) - ${i}, 1))` }}
              >
                {char}
              </span>
            );
          });
          index++; // the space between words
          return (
            <Fragment key={w}>
              <span className="inline-block whitespace-nowrap">{chars}</span>
              {w < words.length - 1 && ' '}
            </Fragment>
          );
        })}
      </span>
    </motion.p>
  );
}
