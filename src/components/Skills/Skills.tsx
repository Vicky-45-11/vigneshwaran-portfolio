import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_EDITORIAL } from '../animations/easing';
import { SectionHeading } from '../ui/SectionHeading';
import { TechIcon } from '../ui/TechIcon';
import { skillCategories, skills, type SkillCategory } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Filter = 'ALL' | SkillCategory;
const filters: Filter[] = ['ALL', ...skillCategories];

const CATEGORY_LABEL: Record<SkillCategory, string> = {
  PROGRAMMING: 'Programming',
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASES: 'Databases',
  AI: 'AI & Machine Learning',
  'CORE CS': 'Core Computer Science',
  TOOLS: 'Tools',
};

export function Skills() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const reducedMotion = useReducedMotion();

  const visible = useMemo(() => (filter === 'ALL' ? skills : skills.filter((s) => s.category === filter)), [filter]);
  const count = (f: Filter) => (f === 'ALL' ? skills.length : skills.filter((s) => s.category === f).length);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-ink py-24 sm:-mt-16 sm:rounded-t-[4rem] sm:py-32"
    >
      <div className="container-editorial">
        <SectionHeading index="03" label="Skill explorer" title="Skills" id="skills-title" />

        <div className="mt-12 sm:mt-16" role="group" aria-label="Filter skills by category">
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {filters.map((f) => {
              const active = f === filter;
              return (
                <li key={f} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(f)}
                    className={`label-mono inline-flex min-h-11 items-center gap-2 rounded-full border px-4 transition-colors duration-200 ${
                      active
                        ? 'border-accent-light bg-accent/15 text-white'
                        : 'border-line text-mist-muted hover:border-line-strong hover:text-mist'
                    }`}
                  >
                    {f}
                    <span className={active ? 'text-accent-light' : 'text-mist-dim'}>{count(f)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} skills{filter === 'ALL' ? '' : ` in ${CATEGORY_LABEL[filter]}`}.
        </p>

        <motion.ul layout={!reducedMotion} className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((skill) => (
              <motion.li
                key={skill.name}
                layout={!reducedMotion}
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
                transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-line bg-ink-800 p-4 transition-colors duration-200 hover:border-accent/40 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-ink-700 text-mist-muted transition-colors duration-200 group-hover:text-accent-light">
                  <TechIcon name={skill.icon} size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.95rem] font-semibold leading-snug text-mist sm:text-base">{skill.name}</span>
                  <span className="label-mono mt-1 block text-[0.625rem] text-mist-dim">{CATEGORY_LABEL[skill.category]}</span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
