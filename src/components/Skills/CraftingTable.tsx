import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { TechIcon } from '../ui/TechIcon';
import { sfx } from '../World/sound';
import { projects, skills, type TechIconName } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { CATEGORY_COLOR } from './categoryStyle';

/**
 * A crafting table where each project is the output of a recipe made from the
 * technologies it was built with (taken from the project data).
 */

// Fill the 3×3 grid from the centre outwards so small recipes look deliberate.
const SLOT_ORDER = [4, 1, 7, 3, 5, 0, 2, 6, 8];

interface Ingredient {
  name: string;
  icon: TechIconName;
  color: string;
}

function ingredientFor(name: string): Ingredient {
  const skill = skills.find((s) => s.name === name);
  return skill
    ? { name, icon: skill.icon, color: CATEGORY_COLOR[skill.category] }
    : { name, icon: 'message-square-text', color: CATEGORY_COLOR.AI };
}

export function CraftingTable() {
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [filled, setFilled] = useState(reducedMotion ? 9 : 0);
  const project = projects[selected];
  const ingredients = project.technologies.map(ingredientFor);
  const total = ingredients.length;
  const crafted = filled >= total;

  // Place ingredients one by one, then pop out the result.
  useEffect(() => {
    if (reducedMotion || filled >= total) return undefined;
    const id = window.setTimeout(() => {
      setFilled((f) => f + 1);
      if (filled + 1 >= total) sfx.levelUp();
      else sfx.pop();
    }, filled === 0 ? 250 : 230);
    return () => window.clearTimeout(id);
  }, [filled, total, reducedMotion]);

  const choose = (i: number) => {
    setSelected(i);
    setFilled(reducedMotion ? 9 : 0);
    sfx.dig('wood');
  };

  const grid: (Ingredient | null)[] = Array(9).fill(null);
  ingredients.slice(0, 9).forEach((ing, i) => {
    grid[SLOT_ORDER[i]] = ing;
  });

  return (
    <div className="mc-inventory mt-10 p-3 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
        <p className="font-pixel text-lg text-[#3f3f3f]">Crafting Table</p>
        <p className="label-mono text-[#4a4a4a] [text-shadow:none]">Skills in, projects out</p>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,15rem)_1fr] lg:items-center">
        <ul className="grid gap-1.5 sm:grid-cols-3 lg:grid-cols-1" aria-label="Recipe book">
          {projects.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                data-sound="wood"
                onClick={() => choose(i)}
                aria-pressed={i === selected}
                className={`mc-slot-light flex w-full items-center gap-3 px-3 py-2 text-left ${i === selected ? '!bg-[#b4b4b4] outline outline-[3px] outline-white' : ''}`}
              >
                <span className="mc-item h-7 w-7 shrink-0" style={{ backgroundImage: 'var(--tex-chest)' }} aria-hidden="true" />
                <span className="min-w-0 font-pixel text-sm leading-tight text-[#1e1e1e]">{p.title}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <div className="grid grid-cols-3 gap-1" aria-label={`Recipe for ${project.title}`} role="group">
            {grid.map((ing, i) => {
              const order = ing ? ingredients.indexOf(ing) : -1;
              const show = ing && order < filled;
              return (
                <div key={i} className="mc-slot-light flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16" title={ing?.name}>
                  {show && ing && (
                    <motion.span
                      initial={reducedMotion ? false : { scale: 0.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.18 }}
                      className="mc-item flex h-9 w-9 items-center justify-center text-white sm:h-10 sm:w-10"
                      style={{ backgroundColor: ing.color }}
                    >
                      <TechIcon name={ing.icon} size={20} />
                      <span className="sr-only">{ing.name}</span>
                    </motion.span>
                  )}
                  {total === 0 && i === 4 && <span className="font-pixel text-2xl text-[#3f3f3f]">?</span>}
                </div>
              );
            })}
          </div>

          <ArrowRight size={40} strokeWidth={3} className="rotate-90 text-[#5a5a5a] sm:rotate-0" aria-hidden="true" />

          <div className="flex flex-col items-center gap-2">
            <a
              href={`#projects`}
              data-sound="chest"
              onClick={() => sfx.chest()}
              className="mc-slot-light relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24"
              aria-label={`Result: ${project.title}. Go to projects`}
            >
              {(crafted || total === 0) && (
                <motion.span
                  key={project.id}
                  initial={reducedMotion ? false : { scale: 0.2, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                  className="mc-item flex h-14 w-14 items-center justify-center font-pixel text-xl text-white [text-shadow:2px_2px_0_#3f3f3f] sm:h-16 sm:w-16"
                  style={{ backgroundImage: 'var(--tex-chest)' }}
                >
                  {project.number}
                </motion.span>
              )}
            </a>
            <p className="max-w-[12rem] text-center font-pixel text-sm leading-tight text-[#1e1e1e]">{project.title}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 px-1 font-mono text-lg leading-tight text-[#3f3f3f]">
        {total > 0 ? `Ingredients: ${project.technologies.join(' + ')}` : 'Recipe not published yet: technologies for this project have not been listed.'}
      </p>
    </div>
  );
}
