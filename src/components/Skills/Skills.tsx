import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_EDITORIAL } from '../animations/easing';
import { SectionHeading } from '../ui/SectionHeading';
import { TechIcon } from '../ui/TechIcon';
import { skillCategories, skills, type SkillCategory } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { CATEGORY_COLOR, CATEGORY_LABEL } from './categoryStyle';
import { CraftingTable } from './CraftingTable';

type Filter = 'ALL' | SkillCategory;
const filters: Filter[] = ['ALL', ...skillCategories];

export function Skills() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const reducedMotion = useReducedMotion();

  const visible = useMemo(() => (filter === 'ALL' ? skills : skills.filter((s) => s.category === filter)), [filter]);
  const count = (f: Filter) => (f === 'ALL' ? skills.length : skills.filter((s) => s.category === f).length);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative z-10 py-24 sm:py-32"
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
                    className={`mc-btn inline-flex min-h-11 items-center gap-2 px-4 text-sm ${active ? 'mc-btn--pressed' : ''}`}
                  >
                    {f}
                    <span className="text-[#ffff55]">{count(f)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} skills{filter === 'ALL' ? '' : ` in ${CATEGORY_LABEL[filter]}`}.
        </p>

        <div className="mc-inventory mt-8 p-3 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
            <p className="font-pixel text-lg text-[color:var(--inv-text)]">Inventory</p>
            <p className="label-mono text-[color:var(--inv-muted)] [text-shadow:none]">
              Total items: {skills.length} · Categories: {skillCategories.length}
            </p>
          </div>
          <motion.ul layout={!reducedMotion} className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(6.25rem,1fr))] gap-1.5 sm:grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))]">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((skill) => (
                <motion.li
                  key={skill.name}
                  layout={!reducedMotion}
                  initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }}
                  transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
                  className="mc-slot-light group relative flex aspect-square flex-col items-center justify-center gap-1.5 p-1.5 text-center"
                  tabIndex={0}
                  aria-label={`${skill.name}, ${CATEGORY_LABEL[skill.category]}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center text-white sm:h-12 sm:w-12" style={{ backgroundColor: CATEGORY_COLOR[skill.category] }} aria-hidden="true">
                    <span className="mc-item flex h-full w-full items-center justify-center bg-transparent">
                      <TechIcon name={skill.icon} size={22} />
                    </span>
                  </span>
                  <span className="line-clamp-2 font-mono text-[1.05rem] leading-[0.95] text-[color:var(--inv-strong)]" aria-hidden="true">
                    {skill.name}
                  </span>
                  <span
                    className="mc-tooltip pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-max max-w-[14rem] -translate-x-1/2 px-2.5 py-1.5 text-left group-hover:block group-focus:block"
                    aria-hidden="true"
                  >
                    <span className="block font-pixel text-sm text-white">{skill.name}</span>
                    <span className="block font-mono text-base leading-tight text-[#5555ff]">{CATEGORY_LABEL[skill.category]}</span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
        <CraftingTable />
      </div>
    </section>
  );
}
