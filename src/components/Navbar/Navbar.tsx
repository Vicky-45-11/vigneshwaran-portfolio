import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, type MotionValue } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { EASE_EDITORIAL } from '../animations/easing';
import { navLinks, personal } from '../../data/portfolio';
import { GithubIcon } from '../icons/GithubIcon';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NavbarProps {
  activeSection: string;
  progress: MotionValue<number>;
  /** Delay the entrance until the intro has gone. */
  ready: boolean;
}

export function Navbar({ activeSection, progress, ready }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-accent via-accent-light to-accent-cyan"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || menuOpen ? 'border-b border-line bg-ink' : 'border-b border-transparent'
        }`}
        initial={{ opacity: 0, y: reducedMotion ? 0 : -24 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
      >
        <nav className="container-editorial flex h-16 items-center justify-between sm:h-[4.5rem]" aria-label="Primary">
          <a href="#hero" className="font-mono text-sm font-semibold tracking-[0.12em] text-mist transition-opacity hover:opacity-70">
            <span className="sm:hidden">{personal.initials}</span>
            <span className="hidden sm:inline">
              VIGNESHWARAN<span className="text-accent-light">.DEV</span>
            </span>
          </a>

          <ul className="hidden items-center gap-8 md:flex lg:gap-10">
            {navLinks.map((link) => {
              const active = activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active ? 'true' : undefined}
                    className={`relative py-2 text-xs font-medium tracking-[0.2em] transition-opacity duration-200 hover:opacity-100 ${
                      active ? 'text-white opacity-100' : 'text-mist opacity-60'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent-light"
                        transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-mist md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-10 pt-24 md:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reducedMotion ? 0.15 : 0.5, ease: EASE_EDITORIAL }}
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.1 + i * 0.05, ease: EASE_EDITORIAL }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line py-4 text-[clamp(2rem,10vw,3rem)] font-black leading-none tracking-tight text-mist"
                  >
                    <span className="label-mono text-accent-light">0{i + 1}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3 text-sm text-mist-muted">
              <a href={`mailto:${personal.email}`} className="break-all py-1 hover:text-mist">
                {personal.email}
              </a>
              <a href={personal.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-1 hover:text-mist">
                <GithubIcon size={16} /> {personal.githubHandle}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
