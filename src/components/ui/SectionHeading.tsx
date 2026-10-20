import type { ReactNode } from 'react';
import { FadeIn } from '../animations/FadeIn';

interface SectionHeadingProps {
  /** Small index label, e.g. "04". */
  index: string;
  label: string;
  title: ReactNode;
  id?: string;
  size?: 'lg' | 'xl';
  className?: string;
}

/** Oversized stone-textured pixel heading with an index label above it. */
export function SectionHeading({ index, label, title, id, size = 'lg', className = '' }: SectionHeadingProps) {
  const sizeClass =
    size === 'xl' ? 'text-[clamp(3rem,12vw,11rem)]' : 'text-[clamp(2.4rem,8vw,7.5rem)]';

  return (
    <header className={className}>
      <FadeIn y={12} duration={0.5}>
        <p className="label-mono mb-5 flex items-center gap-3 text-white [text-shadow:2px_2px_0_#000]">
          <span className="text-[#ffff55]">{index}</span>
          <span className="h-[3px] w-10 bg-white/40" aria-hidden="true" />
          {label}
        </p>
      </FadeIn>
      <FadeIn y={32} duration={0.8} delay={0.05}>
        <h2
          id={id}
          className={`${sizeClass} hero-heading font-bold uppercase leading-[0.92]`}
        >
          {title}
        </h2>
      </FadeIn>
    </header>
  );
}
