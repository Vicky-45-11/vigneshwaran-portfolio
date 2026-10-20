import { useEffect, useState } from 'react';
import { useScroll, useSpring, type MotionValue } from 'framer-motion';

/**
 * Page scroll progress (0–1, smoothed) plus the id of the section currently
 * crossing the middle of the viewport. Uses Framer's shared scroll listener and
 * one IntersectionObserver instead of per-frame layout reads.
 */
export function useScrollProgress(sectionIds: readonly string[]): {
  progress: MotionValue<number>;
  activeSection: string;
} {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      // A thin band across the middle of the viewport decides the active section.
      { rootMargin: '-45% 0px -50% 0px' },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sectionIds]);

  return { progress, activeSection };
}
