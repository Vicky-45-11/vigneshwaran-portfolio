import { AnimatedText } from '../animations/AnimatedText';
import { FadeIn } from '../animations/FadeIn';
import { SectionHeading } from '../ui/SectionHeading';
import { education, personal } from '../../data/portfolio';

const degree = education[0];

const facts = [
  { label: 'Studying', value: degree.qualification },
  { label: 'At', value: degree.institution },
  { label: 'Based in', value: personal.location },
  { label: 'Focus', value: 'AI · Machine Learning · Full-Stack' },
];

/** Floating snippet; the content describes the person, it is not a real file. */
function CodePanel() {
  return (
    <div className="mc-card w-64 p-4 font-mono text-base leading-tight">
      <div className="mb-3 flex gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 bg-white/20" />
        <span className="h-2 w-2 bg-white/20" />
        <span className="h-2 w-2 bg-white/20" />
      </div>
      <p>
        <span className="text-accent-light">const</span> <span className="text-mist">developer</span> = {'{'}
      </p>
      <p className="pl-4 text-mist-muted">
        focus: [<span className="text-accent-cyan">'AI'</span>, <span className="text-accent-cyan">'ML'</span>,{' '}
        <span className="text-accent-cyan">'Full-Stack'</span>],
      </p>
      <p className="pl-4 text-mist-muted">
        based: <span className="text-accent-cyan">'Chennai'</span>,
      </p>
      <p>{'}'};</p>
    </div>
  );
}

/** A single floating block, drawn with the site's generated textures. */
function FloatingBlock({ texture, size }: { texture: string; size: number }) {
  return <span className="mc-item block" style={{ width: size, height: size, backgroundImage: `var(--tex-${texture})` }} />;
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden py-24 sm:py-36">
      {/* Decorative objects stay at the edges and never sit over the text column. */}
      <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden="true">
        <div className="animate-float absolute right-[3%] top-[14%]">
          <CodePanel />
        </div>
        <div className="animate-float absolute bottom-[1%] right-[24%] [animation-delay:-3s]">
          <FloatingBlock texture="bookshelf" size={84} />
        </div>
        <div className="absolute bottom-[2%] left-[3%] opacity-80">
          <FloatingBlock texture="diamond-ore" size={72} />
        </div>
      </div>

      <div className="container-editorial relative">
        <SectionHeading index="01" label="Who I am" title="About me" id="about-title" />

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12">
          <div className="mc-card p-6 sm:p-8 lg:col-span-8 xl:col-span-7">
            <AnimatedText
              text={personal.about}
              className="text-[clamp(1.5rem,3.4vw,2.75rem)] font-semibold leading-[1.2] tracking-tight text-mist"
            />
          </div>

          <dl className="grid content-start gap-[3px] self-start overflow-hidden border-[3px] border-black bg-black sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 xl:col-span-3 xl:col-start-10">
            {facts.map((fact, i) => (
              <FadeIn key={fact.label} delay={i * 0.08} y={16} className="bg-[#0e0e12]/90 p-5">
                <dt className="label-mono text-mist-dim">{fact.label}</dt>
                <dd className="mt-2 text-sm font-medium text-mist">{fact.value}</dd>
              </FadeIn>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
