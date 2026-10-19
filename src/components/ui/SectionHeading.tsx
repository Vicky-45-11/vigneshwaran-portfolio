import type { ReactNode } from 'react';
import { FadeIn } from '../animations/FadeIn';

interface SectionHeadingProps {
  /** Small index label, e.g. "04". */
  index: string;
  label: string;
  title: ReactNode;
  id?: string;
  tone?: 'dark' | 'light';
  size?: 'lg' | 'xl';
  className?: string;
}

/** Oversized editorial heading with a mono index label above it. */
export function SectionHeading({ index, label, title, id, tone = 'dark', size = 'lg', className = '' }: SectionHeadingProps) {
  const sizeClass =
    size === 'xl' ? 'text-[clamp(3.25rem,14vw,13rem)]' : 'text-[clamp(2.75rem,9vw,8.5rem)]';

  return (
    <header className={className}>
      <FadeIn y={12} duration={0.5}>
        <p className={`label-mono mb-5 flex items-center gap-3 ${tone === 'light' ? 'text-ink/60' : 'text-mist-muted'}`}>
          <span className={tone === 'light' ? 'text-accent' : 'text-accent-light'}>{index}</span>
          <span className={`h-px w-10 ${tone === 'light' ? 'bg-ink/20' : 'bg-white/20'}`} aria-hidden="true" />
          {label}
        </p>
      </FadeIn>
      <FadeIn y={32} duration={0.8} delay={0.05}>
        <h2
          id={id}
          className={`${sizeClass} font-black uppercase leading-[0.88] tracking-tight ${tone === 'light' ? 'hero-heading--dark' : 'hero-heading'}`}
        >
          {title}
        </h2>
      </FadeIn>
    </header>
  );
}
