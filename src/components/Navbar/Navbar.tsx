import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { EASE_EDITORIAL } from '../animations/easing';
import { navLinks, personal } from '../../data/portfolio';
import { GithubIcon } from '../icons/GithubIcon';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NavbarProps {
  activeSection: string;
  /** Delay the entrance until the intro has gone. */
  ready: boolean;
  night: boolean;
  onToggleNight: () => void;
}

function DayNightButton({ night, onToggle }: { night: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={night}
      aria-label={night ? 'Switch the world to day' : 'Switch the world to night'}
      title={night ? 'Day' : 'Night'}
      className="mc-btn flex h-10 w-10 items-center justify-center"
    >
      {night ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}

export function Navbar({ activeSection, ready, night, onToggleNight }: NavbarProps) {
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
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || menuOpen ? 'border-b-[3px] border-black bg-black/75 backdrop-blur-sm' : 'border-b-[3px] border-transparent'
        }`}
        initial={{ opacity: 0, y: reducedMotion ? 0 : -24 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
      >
        <nav className="container-editorial flex h-16 items-center justify-between sm:h-[4.5rem]" aria-label="Primary">
          <a href="#hero" className="flex items-center gap-3 font-pixel text-lg text-white transition-opacity [text-shadow:2px_2px_0_#3f3f3f] hover:opacity-80">
            <span className="mc-item h-7 w-7" style={{ backgroundImage: 'var(--tex-grass-side)' }} aria-hidden="true" />
            <span className="sm:hidden">{personal.initials}</span>
            <span className="hidden sm:inline">
              VIGNESHWARAN<span className="text-accent-light">.DEV</span>
            </span>
          </a>

          <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <ul className="flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const active = activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active ? 'true' : undefined}
                    className={`relative py-2 font-pixel text-sm tracking-[0.08em] transition-opacity duration-200 [text-shadow:2px_2px_0_#000] hover:opacity-100 ${
                      active ? 'text-[#ffff55] opacity-100' : 'text-white opacity-80'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-0 right-0 h-[3px] bg-[#ffff55]"
                        transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
          <DayNightButton night={night} onToggle={onToggleNight} />
          </div>

          <div className="flex items-center gap-2 md:hidden">
          <DayNightButton night={night} onToggle={onToggleNight} />
          <button
            type="button"
            className="mc-btn flex h-11 w-11 items-center justify-center md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="mc-dirt-bg fixed inset-0 z-40 flex flex-col px-6 pb-10 pt-24 md:hidden"
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
                    className="flex items-baseline gap-4 border-b-[3px] border-black/60 py-4 font-pixel text-[clamp(1.75rem,9vw,2.75rem)] leading-none text-white [text-shadow:3px_3px_0_#3f3f3f]"
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
