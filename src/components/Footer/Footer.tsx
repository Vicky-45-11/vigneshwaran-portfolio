import { ArrowUp } from 'lucide-react';
import { navLinks, personal } from '../../data/portfolio';
import { GithubIcon } from '../icons/GithubIcon';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line pt-16">
      <div className="container-editorial">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-sm font-semibold tracking-[0.12em] text-mist">
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-mist-muted transition-colors hover:border-line-strong hover:text-mist"
              aria-label="GitHub profile (opens in a new tab)"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="#hero"
              className="label-mono inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-mist-muted transition-colors hover:border-line-strong hover:text-mist"
            >
              Back to top <ArrowUp size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        <p
          className="hero-heading pointer-events-none mt-16 select-none text-center text-[clamp(2.5rem,11.4vw,10.25rem)] font-black uppercase leading-[0.8] tracking-[-0.05em] opacity-60"
          aria-hidden="true"
        >
          {personal.firstName}
        </p>

        <div className="flex flex-col gap-2 border-t border-line py-6 sm:flex-row sm:justify-between">
          <p className="label-mono text-mist-dim">© {year} {personal.name}</p>
          <p className="label-mono text-mist-dim">Built with React, Three.js &amp; Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
