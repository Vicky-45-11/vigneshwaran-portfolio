import { useRef, type CSSProperties } from 'react';
import { useInView } from 'framer-motion';
import { TechIcon } from '../ui/TechIcon';
import { marqueeRows, type Skill } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function Tile({ skill }: { skill: Skill }) {
  return (
    <li className="mr-3 flex w-[13.5rem] shrink-0 items-center gap-4 rounded-2xl border border-line bg-ink-800 px-5 py-4 sm:mr-4 sm:w-60 sm:px-6 sm:py-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-ink-700 text-accent-light">
        <TechIcon name={skill.icon} size={20} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-base font-semibold text-mist">{skill.name}</span>
        <span className="label-mono block text-[0.625rem] text-mist-muted">{skill.category}</span>
      </span>
    </li>
  );
}

function MarqueeRow({ items, direction, paused, duration }: { items: Skill[]; direction: 'left' | 'right'; paused: boolean; duration: string }) {
  const reducedMotion = useReducedMotion();
  // Two copies make the -50% translate loop seamlessly; the copy is hidden from
  // assistive tech. With reduced motion there is one copy and the row scrolls.
  const copies = reducedMotion ? [0] : [0, 1];

  return (
    <div
      className={`marquee ${direction === 'right' ? 'marquee--right' : ''}`}
      data-paused={paused}
      style={{ '--marquee-duration': duration } as CSSProperties}
    >
      <div className="marquee__track">
        {copies.map((copy) => (
          <ul key={copy} className="flex" aria-hidden={copy === 1 ? true : undefined}>
            {items.map((skill) => (
              <Tile key={skill.name} skill={skill} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function TechMarquee() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '120px 0px' });

  return (
    <section id="stack" ref={ref} aria-labelledby="stack-title" className="relative overflow-hidden border-y border-line py-16 sm:py-24">
      <div className="container-editorial mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="stack-title" className="label-mono text-mist-muted">
          <span className="text-accent-light">00</span>&nbsp;&nbsp;Technologies I work with
        </h2>
        <p className="label-mono text-mist-dim">Languages · Frameworks · Data · Tools · AI</p>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        <MarqueeRow items={marqueeRows[0]} direction="right" paused={!inView} duration="52s" />
        <MarqueeRow items={marqueeRows[1]} direction="left" paused={!inView} duration="58s" />
      </div>
    </section>
  );
}
