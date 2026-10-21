import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lock } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { TechIcon } from '../ui/TechIcon';
import { skillCategories, skills } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { CATEGORY_COLOR, CATEGORY_LABEL } from '../Skills/categoryStyle';

// An advancement tree built from the same skills list as the inventory above:
// scrolling it into view unlocks the skills one by one, branch by branch.

const ordered = skillCategories.flatMap((c) => skills.filter((s) => s.category === c).map((s) => s.name));

export function SkillTree() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: '-15% 0px' });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const unlocked = reduce && inView ? ordered.length : step;

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => {
      setStep((n) => {
        if (n + 1 >= ordered.length) window.clearInterval(id);
        return n + 1;
      });
    }, 90);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  const done = unlocked >= ordered.length;

  return (
    <section aria-labelledby="skilltree-title" className="relative z-10 pb-24 sm:pb-32">
      <div className="container-editorial" ref={root}>
        <SectionHeading index="03.5" label="Advancements" title="Skill tree" id="skilltree-title" size="lg" />

        <div className="mc-card mt-10 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-pixel text-lg text-white">
              {done ? 'All skills unlocked' : 'Unlocking skills…'}
            </p>
            <p className="label-mono text-[#ffff55]" aria-live="off">
              {Math.min(unlocked, ordered.length)} / {ordered.length}
            </p>
          </div>
          <div className="mt-3 h-2 bg-black/60" aria-hidden="true">
            <div className="h-full bg-accent-light transition-[width] duration-200" style={{ width: `${(unlocked / ordered.length) * 100}%` }} />
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-7">
            {skillCategories.map((cat) => {
              const items = skills.filter((s) => s.category === cat);
              return (
                <li key={cat} className="min-w-0">
                  <div className="flex items-center gap-2 border-b-[3px] pb-2" style={{ borderColor: CATEGORY_COLOR[cat] }}>
                    <span className="h-3 w-3 shrink-0" style={{ backgroundColor: CATEGORY_COLOR[cat] }} aria-hidden="true" />
                    <span className="label-mono truncate text-[0.7rem] text-white">{CATEGORY_LABEL[cat]}</span>
                  </div>
                  <ul className="relative mt-3 flex flex-col gap-2 pl-4">
                    <span className="absolute bottom-3 left-[5px] top-0 w-[3px]" style={{ backgroundColor: CATEGORY_COLOR[cat], opacity: 0.45 }} aria-hidden="true" />
                    {items.map((s) => {
                      const on = ordered.indexOf(s.name) < unlocked;
                      return (
                        <li key={s.name} className="relative">
                          <span className="absolute -left-[11px] top-1/2 h-[3px] w-[11px] -translate-y-1/2" style={{ backgroundColor: CATEGORY_COLOR[cat], opacity: 0.45 }} aria-hidden="true" />
                          <motion.div
                            animate={on && !reduce ? { scale: [0.85, 1.08, 1] } : { scale: 1 }}
                            transition={{ duration: 0.35 }}
                            className={`mc-slot flex items-center gap-2 px-2 py-1.5 transition-[filter,opacity] duration-300 ${on ? '' : 'opacity-50 grayscale'}`}
                            style={on ? { boxShadow: `0 0 14px -2px ${CATEGORY_COLOR[cat]}` } : undefined}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center text-white" style={{ backgroundColor: on ? CATEGORY_COLOR[cat] : '#333' }}>
                              {on ? <TechIcon name={s.icon} size={16} /> : <Lock size={13} />}
                            </span>
                            <span className="min-w-0 line-clamp-2 font-mono text-[1.05rem] leading-[0.95] text-white">{s.name}</span>
                          </motion.div>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
