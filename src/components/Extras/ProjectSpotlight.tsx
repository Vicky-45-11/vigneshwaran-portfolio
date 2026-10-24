import { useCallback, useEffect, useRef, useState } from 'react';
import { GithubIcon } from '../icons/GithubIcon';
import { LiveProjectButton } from '../ui/LiveProjectButton';
import { personal, projects } from '../../data/portfolio';
import { VISUALS } from '../Projects/visualRegistry';
import { SPOTLIGHT_EVENT } from './spotlightEvents';
import { ProjectRecipe } from './ProjectRecipe';

/** Full-screen project viewer: big illustration, details, and arrow keys to move between projects. */
export function ProjectSpotlight() {
  const [index, setIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const open = index !== null;

  useEffect(() => {
    const on = (e: Event) => {
      returnTo.current = document.activeElement as HTMLElement | null;
      setIndex((e as CustomEvent<number>).detail);
    };
    window.addEventListener(SPOTLIGHT_EVENT, on);
    return () => window.removeEventListener(SPOTLIGHT_EVENT, on);
  }, []);

  const close = useCallback(() => { setIndex(null); returnTo.current?.focus?.(); }, []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + projects.length) % projects.length)), []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, close, step]);

  if (index === null) return null;
  const p = projects[index];
  const { Component: Visual, caption } = VISUALS[p.visual];
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 sm:p-8" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="spot-title" className="mc-card relative grid max-h-full w-full max-w-6xl gap-6 overflow-y-auto p-5 sm:p-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
        <div className="flex flex-col">
          <p className="label-mono text-accent-light">PROJECT {p.number} / {String(projects.length).padStart(2, '0')} · {p.category}</p>
          <h2 id="spot-title" className="mt-3 font-pixel text-[clamp(1.8rem,4vw,3rem)] font-bold uppercase leading-[0.95] text-white [text-shadow:3px_3px_0_#3f3f3f]">{p.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-mist-muted">{p.description}</p>
          {p.technologies.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">{p.technologies.map((t) => <li key={t} className="label-mono mc-slot px-3 py-1 text-white">{t}</li>)}</ul>
          )}
          <ProjectRecipe key={p.id} project={p} />
          <div className="mt-6 flex flex-wrap gap-3">
            <LiveProjectButton href={p.sourceUrl ?? personal.github} label={p.sourceUrl ? 'SOURCE CODE' : 'GITHUB PROFILE'} icon={<GithubIcon size={14} />} />
            {p.liveUrl && <LiveProjectButton href={p.liveUrl} label="LIVE PROJECT" />}
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-8">
            <button type="button" className="label-mono mc-slot px-4 py-2 text-white" onClick={() => step(-1)} aria-label="Previous project">‹ PREV</button>
            <button type="button" className="label-mono mc-slot px-4 py-2 text-white" onClick={() => step(1)} aria-label="Next project">NEXT ›</button>
            <button ref={closeRef} type="button" className="label-mono mc-slot ml-auto px-4 py-2 text-white" onClick={close}>CLOSE (ESC)</button>
          </div>
          <p className="label-mono mt-3 text-mist-muted">← → switch project</p>
        </div>
        <figure className="relative min-h-[18rem] sm:min-h-[26rem]">
          <div className="absolute inset-0" aria-hidden="true"><Visual /></div>
          <figcaption className="sr-only">{caption}</figcaption>
        </figure>
      </section>
    </div>
  );
}
