import { useMemo, useState } from 'react';
import { Award } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { SectionHeading } from '../ui/SectionHeading';
import { DepthCarousel } from '../ui/DepthCarousel/DepthCarousel';
import { certifications, personal } from '../../data/portfolio';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { certificateArt } from './certificateArt';

export function Certifications() {
  const [active, setActive] = useState(0);
  const isSmall = useMediaQuery('(max-width: 639px)');

  const slides = useMemo(
    () =>
      certifications.map((cert, i) => ({
        image: certificateArt(cert, i, certifications.length, personal.name),
        alt: `${cert.name} — ${cert.area} certification`,
      })),
    [],
  );

  return (
    <section id="certifications" aria-labelledby="certifications-title" className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeading index="07" label="Continued learning" title="Certifications" id="certifications-title" />

        <div className="mt-12 grid items-center gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-12">
          <FadeIn className="relative h-[400px] sm:h-[540px] lg:col-span-7 lg:h-[600px]">
            <div
              className="pointer-events-none absolute inset-x-[10%] top-1/2 h-2/3 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_65%)]"
              aria-hidden="true"
            />
            <DepthCarousel
              items={slides}
              ariaLabel="Certifications"
              cardWidth={isSmall ? 250 : 320}
              cardHeight={isSmall ? 316 : 405}
              radius={22}
              tint="#0C0C0C"
              depth={220}
              spread={isSmall ? 50 : 90}
              tilt={22}
              tiltDirection="right"
              perspective={1400}
              visibleCards={4}
              falloff={0.2}
              blur={6}
              autoplay
              loop
              onChange={(index) => setActive(index)}
            />
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-5">
            <p className="label-mono text-mist-muted">
              Drag, swipe or use the arrow keys · <span className="text-accent-light">{String(active + 1).padStart(2, '0')}</span> / {String(certifications.length).padStart(2, '0')}
            </p>
            <ol className="mt-6 border-t border-line">
              {certifications.map((cert, i) => {
                const current = i === active;
                return (
                  <li
                    key={cert.name}
                    aria-current={current ? 'true' : undefined}
                    className={`flex items-start gap-4 border-b border-line py-5 transition-colors duration-300 ${current ? 'text-white' : 'text-mist-muted'}`}
                  >
                    <span className={`mt-1 font-mono text-sm ${current ? 'text-accent-light' : 'text-mist-dim'}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold leading-snug sm:text-xl">{cert.name}</span>
                      <span className="label-mono mt-1 block text-[0.625rem] text-mist-dim">{cert.area}</span>
                    </span>
                    <Award
                      size={20}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className={`mt-1 shrink-0 transition-colors duration-300 ${current ? 'text-accent-light' : 'text-mist-dim'}`}
                    />
                  </li>
                );
              })}
            </ol>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
