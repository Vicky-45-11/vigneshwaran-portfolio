import { motion } from 'framer-motion';
import { TechIcon } from '../ui/TechIcon';
import { skills, type Project } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Where ingredients go in the 3x3 grid, so a short recipe still looks like a recipe.
const PATTERNS: number[][] = [[4], [3, 5], [1, 3, 5], [0, 2, 6, 8], [1, 3, 4, 5, 7], [0, 1, 2, 3, 4, 5]];

/** A crafting recipe for the project: its real technologies go in the grid and the project comes out as a chest. */
export function ProjectRecipe({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const techs = project.technologies.slice(0, 6);
  const cells = new Map<number, string>();
  (PATTERNS[Math.max(0, techs.length - 1)] ?? PATTERNS[5]).forEach((cell, i) => {
    if (techs[i]) cells.set(cell, techs[i]);
  });
  const t = (d: number) => (reduce ? 0 : d);
  return (
    <div className="mt-6" role="group" aria-label={`Crafting recipe for ${project.title}`}>
      <p className="label-mono text-accent-light">CRAFTING RECIPE</p>
      {techs.length === 0 ? (
        <p className="mt-2 text-mist-muted">The technologies for this project are not listed yet.</p>
      ) : (
        <div className="mt-2 flex items-center gap-4">
          <ul className="grid grid-cols-3 gap-1" aria-label="Ingredients">
            {Array.from({ length: 9 }, (_, cell) => {
              const name = cells.get(cell);
              const order = name ? techs.indexOf(name) : 0;
              const icon = name ? skills.find((s) => s.name === name)?.icon : undefined;
              return (
                <li key={cell} className="mc-slot flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16" title={name}>
                  {name && (
                    <motion.span
                      className="flex flex-col items-center gap-0.5 text-white"
                      initial={reduce ? false : { scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: t(0.25 + order * 0.28), type: 'spring', stiffness: 260, damping: 16 }}
                    >
                      {icon ? <TechIcon name={icon} size={22} /> : <span className="font-pixel text-lg leading-none">{name.slice(0, 2)}</span>}
                      <span className="max-w-[3.6rem] truncate font-pixel text-[0.62rem] leading-none sm:text-xs">{name}</span>
                    </motion.span>
                  )}
                </li>
              );
            })}
          </ul>
          <motion.span
            aria-hidden="true"
            className="font-pixel text-3xl text-white"
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: t(0.4 + techs.length * 0.28) }}
          >
            ➜
          </motion.span>
          <motion.div
            className="mc-slot flex h-20 w-20 flex-col items-center justify-center gap-1"
            initial={reduce ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: t(0.7 + techs.length * 0.28), type: 'spring', stiffness: 200, damping: 12 }}
          >
            <span className="relative block h-9 w-12" aria-hidden="true">
              <motion.span
                className="absolute inset-x-0 top-0 block h-[38%] origin-top border-[3px] border-[#1a0f05] bg-[#8b5a2b]"
                initial={reduce ? false : { rotateX: 0 }}
                animate={{ rotateX: -105 }}
                transition={{ delay: t(1.1 + techs.length * 0.28), type: 'spring', stiffness: 140, damping: 12 }}
              />
              <span className="absolute inset-x-0 bottom-0 block h-[68%] border-[3px] border-[#1a0f05] bg-[#7a4e24]" />
            </span>
            <span className="font-pixel text-xs text-[#ffff55]">{project.number}</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
