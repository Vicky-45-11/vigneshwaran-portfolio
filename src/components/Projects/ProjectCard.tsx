import { motion, useTransform, type MotionValue } from 'framer-motion';
import { GithubIcon } from '../icons/GithubIcon';
import { LiveProjectButton } from '../ui/LiveProjectButton';
import { personal, type Project } from '../../data/portfolio';
import { VISUALS } from './visualRegistry';
import { openSpotlight } from '../Extras/spotlightEvents';

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  /** Scroll progress through the whole stack (0–1). */
  progress: MotionValue<number>;
  /** Sticky stacking + scale only on large screens with motion allowed. */
  stacked: boolean;
}

export function ProjectCard({ project, index, total, progress, stacked }: ProjectCardProps) {
  // Each card shrinks a little as the cards after it slide over it.
  const targetScale = 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const { Component: Visual, caption } = VISUALS[project.visual];

  return (
    <div
      className={stacked ? 'sticky flex h-[100svh] items-center' : 'py-3'}
      style={stacked ? { top: `${index * 28}px` } : undefined}
    >
      <motion.article
        aria-labelledby={`${project.id}-title`}
        style={stacked ? { scale, transformOrigin: 'top center' } : undefined}
        className="mc-card relative w-full overflow-hidden p-5 sm:p-8 lg:h-[min(78svh,680px)] lg:p-10"
      >
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <span className="hero-heading text-[clamp(4rem,10vw,8.5rem)] font-bold leading-[0.8]">
                {project.number}
              </span>
              <span className="label-mono mc-slot px-3 py-1 text-accent-light">
                {project.category}
              </span>
            </div>

            <h3 id={`${project.id}-title`} className="mt-8 font-pixel text-[clamp(1.9rem,4vw,3.4rem)] font-bold uppercase leading-[0.95] text-white [text-shadow:3px_3px_0_#3f3f3f]">
              {project.title}
            </h3>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-mist-muted">{project.description}</p>

            {project.technologies.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                {project.technologies.map((tech) => (
                  <li key={tech} className="label-mono mc-slot px-3 py-1 text-white">
                    {tech}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
              {project.sourceUrl ? (
                <LiveProjectButton href={project.sourceUrl} label="SOURCE CODE" icon={<GithubIcon size={14} />} />
              ) : (
                // No repository link has been published for this project yet,
                // so point to the GitHub profile and say so plainly.
                <LiveProjectButton href={personal.github} label="GITHUB PROFILE" icon={<GithubIcon size={14} />} />
              )}
              {project.liveUrl && <LiveProjectButton href={project.liveUrl} label="LIVE PROJECT" />}
              <button type="button" onClick={() => openSpotlight(index)} className="label-mono mc-slot px-4 py-2 text-white hover:text-accent-light" aria-haspopup="dialog">
                SPOTLIGHT ⤢
              </button>
            </div>
          </div>

          <figure className="relative min-h-[18rem] sm:min-h-[22rem] lg:min-h-0">
            <div className="absolute inset-0" aria-hidden="true">
              <Visual />
            </div>
            <figcaption className="sr-only">{caption}</figcaption>
          </figure>
        </div>
      </motion.article>
    </div>
  );
}
