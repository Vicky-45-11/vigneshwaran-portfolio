import { GraduationCap, MapPin } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { SectionHeading } from '../ui/SectionHeading';
import { education } from '../../data/portfolio';

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-editorial">
        <SectionHeading index="06" label="Academic path" title="Education" id="education-title" />

        <div className="mt-14 grid gap-4 sm:mt-20 lg:grid-cols-12">
          {education.map((item, i) => (
            <FadeIn
              as="article"
              key={item.institution}
              delay={i * 0.1}
              className={`relative flex flex-col overflow-hidden rounded-[2rem] border p-6 sm:p-10 ${
                item.primary ? 'border-accent/30 bg-ink-800 lg:col-span-7' : 'border-line bg-ink lg:col-span-5'
              }`}
            >
              {item.primary && (
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_65%)]"
                  aria-hidden="true"
                />
              )}
              <div className="flex items-center justify-between gap-4">
                <span className="label-mono text-accent-light">{item.period}</span>
                <GraduationCap size={22} strokeWidth={1.5} className="text-mist-dim" aria-hidden="true" />
              </div>
              <h3 className={`mt-10 font-black uppercase leading-[0.95] tracking-tight text-mist ${item.primary ? 'text-[clamp(1.75rem,3.4vw,3rem)]' : 'text-[clamp(1.5rem,2.6vw,2.25rem)]'}`}>
                {item.qualification}
              </h3>
              <p className="mt-4 text-lg text-mist-muted">{item.institution}</p>

              <div className="min-h-10 flex-1" aria-hidden="true" />
              <dl className="flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
                <div>
                  <dt className="label-mono text-mist-dim">Location</dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm text-mist">
                    <MapPin size={14} aria-hidden="true" /> {item.location}
                  </dd>
                </div>
                {item.cgpa && (
                  <div>
                    <dt className="label-mono text-mist-dim">CGPA</dt>
                    <dd className="mt-1 font-mono text-sm text-mist">{item.cgpa}</dd>
                  </div>
                )}
              </dl>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
