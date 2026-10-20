import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { EASE_EDITORIAL } from '../animations/easing';
import { VaporType } from '../animations/VaporType';
import { ContactButton } from '../ui/ContactButton';
import { VoxelIsland } from '../World/VoxelIsland';
import { education, personal } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HeroProps {
  /** Hold the entrance animation until the intro has closed. */
  ready: boolean;
}

// Yellow title-screen splashes, all true of this portfolio.
const SPLASHES = [
  'Now with AI!',
  'Computer Science (AI)!',
  'Full-stack!',
  `CGPA ${education[0].cgpa}!`,
  'Made in Chennai!',
  'Built with React!',
  'Machine learning inside!',
  'Also try Python!',
];

function SplashText() {
  const reducedMotion = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = window.setInterval(() => setI((n) => (n + 1) % SPLASHES.length), 4200);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <button
      type="button"
      onClick={() => setI((n) => (n + 1) % SPLASHES.length)}
      className="mc-splash absolute right-1 top-8 z-10 text-[clamp(0.95rem,2.3vw,1.9rem)] sm:right-[6%] sm:top-[0.2em] lg:left-[46%] lg:right-auto"
      aria-label={`Splash text: ${SPLASHES[i]} Click for another.`}
    >
      <span className="mc-splash__pulse inline-block">{SPLASHES[i]}</span>
    </button>
  );
}

export function Hero({ ready }: HeroProps) {
  const reducedMotion = useReducedMotion();
  const distance = reducedMotion ? 0 : 1;

  const enter = (delay: number, y = 40) => ({
    initial: { opacity: 0, y: y * distance },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: reducedMotion ? 0.2 : 0.9, delay: reducedMotion ? 0 : delay, ease: EASE_EDITORIAL },
  });

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 sm:pt-28">
      <motion.div
        className="order-2 mx-auto h-[300px] w-full max-w-md sm:h-[360px] lg:absolute lg:right-[4%] lg:top-[44%] lg:-z-[5] lg:order-none lg:h-[min(44vh,440px)] lg:w-[min(36vw,520px)] lg:max-w-none"
        initial={{ opacity: 0, y: 30 * distance, scale: reducedMotion ? 1 : 0.94 }}
        animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: reducedMotion ? 0.2 : 1.4, delay: reducedMotion ? 0 : 0.35, ease: EASE_EDITORIAL }}
      >
        <div className={reducedMotion ? 'h-full w-full' : 'animate-float h-full w-full'}>
          <VoxelIsland className="h-full w-full" spin={!reducedMotion} />
        </div>
      </motion.div>

      <div className="container-editorial order-1 flex flex-col lg:flex-1">
        <motion.p {...enter(0.1, 16)} className="label-mono mt-6 text-white [text-shadow:2px_2px_0_#1d3a66] sm:mt-10">
          <span className="text-[#ffff55]">■</span>&nbsp;&nbsp;{personal.headline} — {personal.location}
        </motion.p>

        <div className="relative">
          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.4rem,10.4vw,9.5rem)] font-bold uppercase leading-[0.9] tracking-normal sm:mt-8"
          >
            <VaporType
              active={ready}
              reducedMotion={reducedMotion}
              color="255, 255, 255"
              lines={[
                { text: "Hi, I'm", letterClassName: 'vapor-letter vapor-letter--top' },
                { text: personal.firstName, letterClassName: 'vapor-letter vapor-letter--bottom' },
              ]}
            />
          </h1>
          {ready && <SplashText />}
        </div>

        <motion.div {...enter(0.4, 24)} className="mc-card mt-8 max-w-xl p-5 sm:p-6">
          <p className="text-lg leading-relaxed text-white sm:text-xl">{personal.heroCopy}</p>
          <p className="label-mono mt-3 text-accent-light">{personal.supportingHeadline}</p>
        </motion.div>
      </div>

      <div className="container-editorial order-3 mt-auto">
        <div className="flex flex-col gap-6 pb-10 pt-8 sm:flex-row sm:items-center sm:justify-between sm:pb-28">
          <motion.div {...enter(0.6, 16)} className="flex items-center gap-4">
            <a href="#stack" className="mc-btn flex h-12 w-12 items-center justify-center" aria-label="Scroll to the technology section">
              <ArrowDown size={20} aria-hidden="true" />
            </a>
            <span className="label-mono text-white [text-shadow:2px_2px_0_#000]">{personal.heroMeta}</span>
          </motion.div>
          <motion.div {...enter(0.7, 24)}>
            <ContactButton />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
