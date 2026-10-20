import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface LiveProjectButtonProps {
  /** Destination; when missing the button renders as disabled. */
  href?: string;
  label?: string;
  icon?: ReactNode;
}

const base = 'mc-btn inline-flex min-h-11 items-center gap-2 px-5 py-2 text-sm uppercase';

/** Stone block-game button for project links. Only clickable when a real URL exists. */
export function LiveProjectButton({ href, label = 'LIVE PROJECT', icon }: LiveProjectButtonProps) {
  if (!href) {
    return (
      <span className={`${base} cursor-not-allowed opacity-50 hover:border-black hover:[filter:none]`} aria-disabled="true" title="Link not available yet">
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
      className={base}
    >
      {icon}
      {label}
      <ArrowUpRight size={14} aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
