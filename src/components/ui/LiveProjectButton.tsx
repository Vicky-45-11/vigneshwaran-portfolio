import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface LiveProjectButtonProps {
  /** Destination; when missing the button renders as disabled. */
  href?: string;
  label?: string;
  icon?: ReactNode;
}

const base =
  'inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors duration-200';

/** Outlined pill for project links. Only clickable when a real URL exists. */
export function LiveProjectButton({ href, label = 'LIVE PROJECT', icon }: LiveProjectButtonProps) {
  if (!href) {
    return (
      <span className={`${base} cursor-not-allowed border-white/10 text-mist-dim`} aria-disabled="true" title="Link not available yet">
        {icon}
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} border-white/25 bg-transparent text-mist hover:border-white/50 hover:bg-white/[0.06]`}
    >
      {icon}
      {label}
      <ArrowUpRight size={14} aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
