import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from './ProjectCard';
import { projects } from '../../data/portfolio';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function Projects() {
  const stackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px) and (min-height: 640px)');
  const reducedMotion = useReducedMotion();
  // On phones and short screens the cards are taller than the viewport, so
  // they flow normally instead of pinning; scrolling is never hijacked.
  const stacked = isDesktop && !reducedMotion;
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeading index="04" label="Selected work" title="Projects" id="projects-title" size="xl" />
        <div ref={stackRef} className={stacked ? 'mt-8' : 'mt-14'}>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
              stacked={stacked}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
