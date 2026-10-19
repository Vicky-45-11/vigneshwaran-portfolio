import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { SectionHeading } from '../ui/SectionHeading';
import { focusAreas } from '../../data/portfolio';

export function TechnicalFocus() {
  return (
    <section
      id="focus"
      aria-labelledby="focus-title"
      className="relative rounded-t-[2.5rem] bg-white py-24 text-ink sm:rounded-t-[4rem] sm:py-32"
    >
      <div className="container-editorial">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="02" label="Technical focus" title="What I build" id="focus-title" tone="light" />
          <FadeIn delay={0.15} className="max-w-sm text-base leading-relaxed text-ink/60 lg:pb-4">
            The areas I study, practise and keep returning to — interests and capabilities, not a services menu.
          </FadeIn>
        </div>

        <ol className="mt-16 border-t border-ink/15 sm:mt-24">
          {focusAreas.map((area, i) => (
            <FadeIn as="li" key={area.number} delay={i * 0.08} y={32} amount={0.4}>
              <div className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 border-b border-ink/15 py-8 transition-colors duration-300 hover:bg-ink/[0.03] sm:gap-x-10 sm:py-10 md:grid-cols-[minmax(0,8rem)_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center">
                <span className="font-mono text-[clamp(2.5rem,7vw,6rem)] font-medium leading-none tracking-tight text-ink/15 transition-colors duration-300 group-hover:text-accent">
                  {area.number}
                </span>
                <h3 className="text-[clamp(1.35rem,3.2vw,2.75rem)] font-black uppercase leading-[0.95] tracking-tight">
                  {area.title}
                </h3>
                <p className="col-span-2 max-w-md text-base leading-relaxed text-ink/60 md:col-span-1">{area.description}</p>
                <ArrowUpRight
                  size={28}
                  strokeWidth={1.25}
                  aria-hidden="true"
                  className="hidden text-ink/30 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink md:block"
                />
              </div>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
