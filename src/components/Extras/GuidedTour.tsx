import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Route, X } from 'lucide-react';
import { certifications, education, personal, projects, skills, skillCategories } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// A hands-free tour for visitors short on time: it scrolls through the main
// sections with a one-line summary from the site's own data, and can be paused
// or stepped by hand. It starts only when the visitor asks.

const primary = education.find((e) => e.primary) ?? education[0];

const STEPS = [
  { id: 'hero', title: 'Meet the developer', text: `${personal.name}, ${personal.headline.toLowerCase()} based in ${personal.location}.` },
  { id: 'about', title: 'About', text: `${primary.qualification} at ${primary.institution}, CGPA ${primary.cgpa}.` },
  { id: 'skills', title: 'Skills', text: `${skills.length} skills across ${skillCategories.length} categories, from Python and Java to React and databases.` },
  { id: 'projects', title: 'Projects', text: `${projects.length} projects: ${projects.map((p) => p.title.toLowerCase()).join(', ')}.` },
  { id: 'experience', title: 'Experience', text: 'Student organizational experience at the Directorate of Student Affairs.' },
  { id: 'certifications', title: 'Certifications', text: `${certifications.length} certifications in AI, programming and data science.` },
  { id: 'contact', title: 'Say hello', text: `Email ${personal.email} or find the resume download just above.` },
];

const STEP_MS = 6500;

export function GuidedTour({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Bring the current step's section into view.
  useEffect(() => {
    if (!open) return;
    document.getElementById(STEPS[step].id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [open, step, reduce]);

  // Move on by itself while playing; stop at the last step.
  useEffect(() => {
    if (!open || !playing) return;
    const id = window.setTimeout(() => {
      if (step < STEPS.length - 1) setStep(step + 1);
      else setPlaying(false);
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [open, playing, step]);

  if (!visible) return null;

  const start = () => {
    setStep(0);
    setPlaying(true);
    setOpen(true);
  };
  const go = (n: number) => setStep(Math.min(STEPS.length - 1, Math.max(0, n)));

  return (
    <div className="fixed bottom-[5.6rem] right-3 z-[46] sm:bottom-20 sm:right-5">
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.button
            key="launch"
            type="button"
            onClick={start}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mc-btn inline-flex min-h-11 items-center gap-2 px-4 text-sm"
          >
            <Route size={16} aria-hidden="true" />
            30-second tour
          </motion.button>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mc-card w-[min(86vw,19rem)] p-4"
            style={{ backgroundColor: 'rgba(12,12,12,0.97)' }}
            role="region"
            aria-label="Guided tour"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="label-mono text-[#ffff55]">
                Step {step + 1} / {STEPS.length}
              </p>
              <button type="button" aria-label="Close tour" onClick={() => setOpen(false)} className="text-mist hover:text-white">
                <X size={16} />
              </button>
            </div>
            <p className="mt-2 font-pixel text-lg text-white" aria-live="polite">{STEPS[step].title}</p>
            <p className="mt-1 font-mono text-[1.1rem] leading-snug text-mist">{STEPS[step].text}</p>

            <div className="mt-3 flex gap-1" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span key={s.id} className="h-1.5 flex-1 bg-white/15">
                  <span
                    key={`${i}-${step}-${playing}`}
                    className="block h-full bg-accent-light"
                    style={
                      i < step
                        ? { width: '100%' }
                        : i === step && playing && !reduce
                          ? { animation: `tour-fill ${STEP_MS}ms linear forwards` }
                          : { width: i === step ? '100%' : '0%' }
                    }
                  />
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button type="button" aria-label="Previous step" onClick={() => go(step - 1)} disabled={step === 0} className="mc-btn inline-flex h-11 w-11 items-center justify-center disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
              <button type="button" aria-label={playing ? 'Pause tour' : 'Play tour'} onClick={() => setPlaying((p) => !p)} className="mc-btn inline-flex h-11 flex-1 items-center justify-center gap-2 text-sm">
                {playing ? <Pause size={16} /> : <Play size={16} />}
                {playing ? 'Pause' : 'Play'}
              </button>
              <button type="button" aria-label="Next step" onClick={() => go(step + 1)} disabled={step === STEPS.length - 1} className="mc-btn inline-flex h-11 w-11 items-center justify-center disabled:opacity-40">
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
