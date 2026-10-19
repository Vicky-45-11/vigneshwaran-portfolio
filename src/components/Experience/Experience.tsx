import { Check } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { SectionHeading } from '../ui/SectionHeading';
import { experience } from '../../data/portfolio';

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeading index="05" label="Student organisation" title="Experience" id="experience-title" />

        <ol className="mt-14 sm:mt-20">
          {experience.map((item) => (
            <li key={item.organization} className="grid gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:gap-12">
              <FadeIn className="lg:col-span-5">
                <div className="flex items-start gap-4">
                  <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-accent shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" aria-hidden="true" />
                  <div>
                    <h3 className="text-[clamp(1.75rem,3.6vw,3rem)] font-black uppercase leading-[0.95] tracking-tight text-mist">
                      {item.organization}
                    </h3>
                    <p className="label-mono mt-4 text-mist-muted">{item.context}</p>
                  </div>
                </div>
              </FadeIn>

              <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
                {item.responsibilities.map((point, i) => (
                  <FadeIn
                    as="li"
                    key={point}
                    delay={i * 0.08}
                    y={20}
                    className="flex gap-4 rounded-2xl border border-line bg-ink-800 p-5 sm:p-6"
                  >
                    <Check size={18} className="mt-0.5 shrink-0 text-accent-light" aria-hidden="true" />
                    <span className="text-base leading-relaxed text-mist">{point}</span>
                  </FadeIn>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
