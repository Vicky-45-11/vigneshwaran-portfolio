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
    <div className="w-64 rounded-2xl border border-line bg-ink-800/90 p-4 font-mono text-[0.7rem] leading-relaxed shadow-2xl shadow-black/50">
      <div className="mb-3 flex gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
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

function DatabaseShape() {
  return (
    <svg viewBox="0 0 120 140" className="w-24 text-accent-light/60" fill="none" stroke="currentColor" strokeWidth="1">
      {[20, 60, 100].map((y) => (
        <g key={y}>
          <ellipse cx="60" cy={y} rx="44" ry="12" />
          <path d={`M16 ${y} v24 a44 12 0 0 0 88 0 v-24`} />
        </g>
      ))}
    </svg>
  );
}

function GeometricShape() {
  return (
    <svg viewBox="0 0 100 100" className="w-28 text-mist/25" fill="none" stroke="currentColor" strokeWidth="0.8">
      <polygon points="50,4 92,28 92,72 50,96 8,72 8,28" />
      <path d="M50 4 L50 50 M92 28 L50 50 M92 72 L50 50 M50 96 L50 50 M8 72 L50 50 M8 28 L50 50" />
      <polygon points="50,26 71,38 71,62 50,74 29,62 29,38" className="text-accent/50" stroke="currentColor" />
    </svg>
  );
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
          <DatabaseShape />
        </div>
        <div className="absolute bottom-[2%] left-[3%] opacity-80">
          <GeometricShape />
        </div>
      </div>
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.08),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="container-editorial relative">
        <SectionHeading index="01" label="Who I am" title="About me" id="about-title" />

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-8 xl:col-span-7">
            <AnimatedText
              text={personal.about}
              className="text-[clamp(1.5rem,3.4vw,2.75rem)] font-semibold leading-[1.2] tracking-tight text-mist"
            />
          </div>

          <dl className="grid content-start gap-px self-start overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 xl:col-span-3 xl:col-start-10">
            {facts.map((fact, i) => (
              <FadeIn key={fact.label} delay={i * 0.08} y={16} className="bg-ink p-5">
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
