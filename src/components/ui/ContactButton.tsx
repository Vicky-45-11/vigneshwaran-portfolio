import { ArrowUpRight } from 'lucide-react';
import { Magnet } from '../animations/Magnet';

interface ContactButtonProps {
  href?: string;
  label?: string;
  className?: string;
  type?: 'link' | 'submit';
}

const styles =
  'group inline-flex min-h-12 items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold tracking-[0.14em] text-white ' +
  'ring-1 ring-inset ring-white/20 shadow-[0_0_0_rgba(59,130,246,0)] transition-[box-shadow,filter] duration-200 ' +
  'hover:shadow-[0_8px_40px_-6px_rgba(59,130,246,0.65)] hover:brightness-110 active:brightness-95';

const background = { backgroundImage: 'linear-gradient(123deg, #0B1F3A, #2563EB, #3B82F6)' };

/** Blue gradient pill used for every primary "contact" action. */
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
        <button type="submit" className={styles} style={background}>
          {content}
        </button>
      ) : (
        <a href={href} className={styles} style={background}>
          {content}
        </a>
      )}
    </Magnet>
  );
}
