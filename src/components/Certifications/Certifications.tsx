import { Award } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { SectionHeading } from '../ui/SectionHeading';
import { certifications } from '../../data/portfolio';

export function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeading index="07" label="Continued learning" title="Certifications" id="certifications-title" />

        <ol className="mt-14 grid gap-3 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => (
            <FadeIn
              as="li"
              key={cert.name}
              delay={(i % 3) * 0.08}
              y={24}
              className="group relative flex min-h-[15rem] flex-col rounded-[1.75rem] border border-line bg-ink-800 p-6 transition-colors duration-300 hover:border-accent/40 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-ink text-accent-light transition-colors duration-300 group-hover:border-accent/40">
                  <Award size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="font-mono text-sm text-mist-dim">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-auto pt-10 text-xl font-bold leading-snug text-mist sm:text-2xl">{cert.name}</h3>
              <p className="label-mono mt-3 text-mist-muted">{cert.area}</p>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
