import { ArrowUp } from 'lucide-react';
import { navLinks, personal } from '../../data/portfolio';
import { GithubIcon } from '../icons/GithubIcon';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden pt-16">
      <div className="container-editorial">
        <div className="mc-card grid gap-10 p-6 sm:p-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-pixel text-lg text-white [text-shadow:2px_2px_0_#3f3f3f]">
              VIGNESHWARAN<span className="text-accent-light">.DEV</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist-muted">
              {personal.headline} · {personal.location}
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-4">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="label-mono inline-block py-2 text-mist-muted transition-colors hover:text-mist">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-start gap-3 md:col-span-3 md:justify-end">
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mc-btn flex h-11 w-11 items-center justify-center"
              aria-label="GitHub profile (opens in a new tab)"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="#hero"
              className="mc-btn inline-flex h-11 items-center gap-2 px-4 text-base"
            >
              Back to top <ArrowUp size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        <p
          className="hero-heading hero-heading--end pointer-events-none mt-16 select-none text-center text-[clamp(2.2rem,10vw,9rem)] font-bold uppercase leading-[0.9]"
          aria-hidden="true"
        >
          {personal.firstName}
        </p>

        <div className="flex flex-col gap-2 py-6 sm:flex-row sm:justify-between">
          <p className="label-mono text-white/70">© {year} {personal.name}</p>
          <p className="label-mono text-white/70">Built with React, Tailwind CSS &amp; Framer Motion · Block world drawn in code</p>
        </div>
      </div>
    </footer>
  );
}
