import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, type MotionValue } from 'framer-motion';
import type { BlockName } from './textures';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Game-style heads-up display: a hotbar that navigates the sections (keys 1–9
 * work too), an XP bar that fills as you scroll, a level that counts the
 * sections you have visited, and "Advancement Made!" toasts.
 */

interface Slot {
  id: string;
  label: string;
  block: BlockName;
  advancement?: [title: string, detail: string];
}

const SLOTS: Slot[] = [
  { id: 'hero', label: 'Spawn point', block: 'grassSide' },
  { id: 'about', label: 'About me', block: 'logSide', advancement: ['Getting Started', 'Met Vigneshwaran'] },
  { id: 'focus', label: 'Technical focus', block: 'redstoneOre', advancement: ['Redstone Engineer', 'Found the technical focus'] },
  { id: 'skills', label: 'Skills', block: 'crafting', advancement: ['Open Inventory', 'Checked the skills'] },
  { id: 'projects', label: 'Projects', block: 'chest', advancement: ['Loot!', 'Opened the project chest'] },
  { id: 'experience', label: 'Experience', block: 'ironOre', advancement: ['Team Player', 'Read the experience log'] },
  { id: 'education', label: 'Education', block: 'bookshelf', advancement: ['Enchanter', 'Studied the education'] },
  { id: 'certifications', label: 'Certifications', block: 'goldOre', advancement: ['We Need to Go Deeper', 'Entered the Nether'] },
  { id: 'contact', label: 'Contact', block: 'diamondOre', advancement: ['The End?', 'Reached the contact section'] },
];

const texVar = (block: BlockName) => `var(--tex-${block.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)})`;

function AdvancementToast({ slot, onDone }: { slot: Slot; onDone: (id: string) => void }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const id = window.setTimeout(() => onDone(slot.id), 3600);
    return () => window.clearTimeout(id);
  }, [slot.id, onDone]);

  return (
    <motion.div
      className="mc-toast flex items-center gap-3 px-3 py-2.5"
      initial={{ x: reducedMotion ? 0 : 340, opacity: reducedMotion ? 0 : 1 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: reducedMotion ? 0 : 340, opacity: reducedMotion ? 0 : 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="mc-item h-8 w-8 shrink-0" style={{ backgroundImage: texVar(slot.block) }} />
      <span className="min-w-0">
        <span className="block font-pixel text-sm leading-tight text-[#ffff55]">Advancement Made!</span>
        <span className="block truncate font-pixel text-sm leading-tight text-white">{slot.advancement?.[0]}</span>
      </span>
    </motion.div>
  );
}

interface HudProps {
  activeSection: string;
  progress: MotionValue<number>;
  visible: boolean;
}

export function Hud({ activeSection, progress, visible }: HudProps) {
  const reducedMotion = useReducedMotion();
  const [visited, setVisited] = useState<Set<string>>(() => new Set(['hero']));
  const [toasts, setToasts] = useState<Slot[]>([]);
  const [xp, setXp] = useState(0);

  useMotionValueEvent(progress, 'change', (v) => setXp(Math.min(1, Math.max(0, v))));

  // Unlock an advancement the first time each section is reached (updated
  // during render, React's pattern for state derived from changing props).
  if (visible && !visited.has(activeSection)) {
    setVisited(new Set(visited).add(activeSection));
    const slot = SLOTS.find((s) => s.id === activeSection);
    if (slot?.advancement) setToasts([...toasts.slice(-2), slot]);
  }

  // Number keys jump to sections, like switching hotbar slots.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1 || n > SLOTS.length) return;
      document.getElementById(SLOTS[n - 1].id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reducedMotion]);

  const dismiss = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  if (!visible) return null;
  const level = visited.size - 1;

  return (
    <>
      <div className="pointer-events-none fixed bottom-24 right-3 z-[45] flex w-[min(78vw,20rem)] flex-col gap-2 sm:bottom-auto sm:right-5 sm:top-24" aria-hidden="true">
        <AnimatePresence>
          {toasts.map((slot) => (
            <AdvancementToast key={slot.id} slot={slot} onDone={dismiss} />
          ))}
        </AnimatePresence>
      </div>

      <nav
        className="fixed inset-x-0 bottom-2 z-40 flex flex-col items-center gap-1 sm:bottom-3"
        aria-label="Hotbar: jump to a section (keys 1 to 9)"
      >
        <div className="flex w-[calc(9*var(--slot)+6px)] flex-col items-center [--slot:34px] sm:[--slot:44px]" aria-hidden="true">
          <span className="mc-level font-pixel text-base leading-none sm:text-lg">{level}</span>
          <div className="mc-xp mt-0.5 h-[7px] w-full sm:h-2">
            <div className="mc-xp__fill h-full" style={{ width: `${xp * 100}%` }} />
          </div>
        </div>
        <ul className="mc-hotbar flex p-[3px] [--slot:34px] sm:[--slot:44px]">
          {SLOTS.map((slot, i) => {
            const active = activeSection === slot.id;
            return (
              <li key={slot.id} className="group relative">
                <a
                  href={`#${slot.id}`}
                  aria-label={`${i + 1}: ${slot.label}`}
                  aria-current={active ? 'true' : undefined}
                  className={`mc-slot relative flex h-[var(--slot)] w-[var(--slot)] items-center justify-center ${active ? 'mc-slot--active' : ''}`}
                >
                  <span className="mc-item h-[56%] w-[56%]" style={{ backgroundImage: texVar(slot.block) }} />
                  <span className="absolute bottom-0 right-0.5 font-pixel leading-none text-white [text-shadow:1px_1px_0_#3f3f3f] sm:text-xs">
                    {i + 1}
                  </span>
                </a>
                <span className="mc-tooltip pointer-events-none absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 whitespace-nowrap px-2 py-1 font-pixel text-sm text-white group-hover:block group-focus-within:block">
                  {slot.label}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
