import { ArrowUpRight } from 'lucide-react';
import { Magnet } from '../animations/Magnet';

interface ContactButtonProps {
  href?: string;
  label?: string;
  className?: string;
  type?: 'link' | 'submit';
}

const styles = 'mc-btn mc-btn--green group inline-flex min-h-12 items-center gap-3 px-7 py-3 text-lg';

/** Green block-game button used for every primary "contact" action. */
export function ContactButton({ href = '#contact', label = 'CONTACT ME', className = '', type = 'link' }: ContactButtonProps) {
  const content = (
    <>
      <span>{label}</span>
      <ArrowUpRight size={18} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </>
  );

  return (
    <Magnet className={className}>
      {type === 'submit' ? (
        <button type="submit" className={styles}>
          {content}
        </button>
      ) : (
        <a href={href} className={styles}>
          {content}
        </a>
      )}
    </Magnet>
  );
}
