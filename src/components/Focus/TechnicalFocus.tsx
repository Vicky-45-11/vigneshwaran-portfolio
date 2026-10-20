import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { SectionHeading } from '../ui/SectionHeading';
import { focusAreas } from '../../data/portfolio';

export function TechnicalFocus() {
  return (
    <section
      id="focus"
      aria-labelledby="focus-title"
      className="relative py-24 text-mist sm:py-32"
    >
      <div className="container-editorial">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="02" label="Technical focus" title="What I build" id="focus-title" />
          <FadeIn delay={0.15} className="mc-card max-w-sm p-5 text-base leading-relaxed text-mist lg:mb-4">
            The areas I study, practise and keep returning to — interests and capabilities, not a services menu.
          </FadeIn>
        </div>

        <ol className="mc-card mt-16 px-5 sm:mt-24 sm:px-8">
          {focusAreas.map((area, i) => (
            <FadeIn as="li" key={area.number} delay={i * 0.08} y={32} amount={0.4}>
              <div className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 border-b-[3px] border-black/60 py-8 transition-colors duration-300 hover:bg-white/[0.04] sm:gap-x-10 sm:py-10 md:grid-cols-[minmax(0,8rem)_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center">
                <span className="font-pixel text-[clamp(2.5rem,7vw,6rem)] font-bold leading-none text-[#ff3b3b] [text-shadow:4px_4px_0_#5a0d0d] transition-colors duration-300 group-hover:text-[#ff7070]">
                  {area.number}
                </span>
                <h3 className="font-pixel text-[clamp(1.35rem,3vw,2.5rem)] font-bold uppercase leading-[0.95] text-white">
                  {area.title}
                </h3>
                <p className="col-span-2 max-w-md text-base leading-relaxed text-mist-muted md:col-span-1">{area.description}</p>
                <ArrowUpRight
                  size={28}
                  strokeWidth={1.25}
                  aria-hidden="true"
                  className="hidden text-white/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white md:block"
                />
              </div>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
