import { useMemo, useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { projects, skills } from '../../data/portfolio';
import { CATEGORY_COLOR } from '../Skills/categoryStyle';

// Pick a skill to see which projects use it, or pick a project to see its
// technologies. The links come straight from each project's technology list,
// so a skill with no project is shown as such rather than implied.

type Sel = { kind: 'skill' | 'project'; key: string } | null;

const norm = (s: string) => s.toLowerCase();

export function SkillMap() {
  const [sel, setSel] = useState<Sel>(null);

  // Every technology a project lists, plus any skill from the skills list.
  const chips = useMemo(() => {
    const known = new Map(skills.map((s) => [norm(s.name), s]));
    const extra = [...new Set(projects.flatMap((p) => p.technologies))].filter((t) => !known.has(norm(t)));
    return [
      ...skills.map((s) => ({ name: s.name, color: CATEGORY_COLOR[s.category] })),
      ...extra.map((name) => ({ name, color: '#666' })),
    ];
  }, []);

  const projectHas = (id: string, tech: string) => projects.find((p) => p.id === id)?.technologies.some((t) => norm(t) === norm(tech)) ?? false;
  const skillLit = (name: string) =>
    !sel || (sel.kind === 'skill' ? sel.key === name : projectHas(sel.key, name));
  const projectLit = (id: string) =>
    !sel || (sel.kind === 'project' ? sel.key === id : projectHas(id, sel.key));

  const used = sel?.kind === 'skill' ? projects.filter((p) => projectHas(p.id, sel.key)) : [];
  const note =
    !sel
      ? 'Pick a skill or a project.'
      : sel.kind === 'skill'
        ? used.length
          ? `${sel.key} is used in ${used.map((p) => p.title.toLowerCase()).join(' and ')}.`
          : `${sel.key} isn't listed under a project yet.`
        : (projects.find((p) => p.id === sel.key)?.technologies.length ?? 0) > 0
          ? ''
          : 'No technologies are listed for this project yet.';

  const toggle = (kind: 'skill' | 'project', key: string) => setSel((s) => (s?.kind === kind && s.key === key ? null : { kind, key }));

  return (
    <section aria-labelledby="skillmap-title" className="relative z-10 pb-24 sm:pb-32">
      <div className="container-editorial">
        <SectionHeading index="03.7" label="Connections" title="Skill map" id="skillmap-title" size="lg" />

        <div className="mc-card mt-10 grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="label-mono mb-3 text-mist-muted">Skills</p>
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => {
                const on = sel?.kind === 'skill' && sel.key === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle('skill', c.name)}
                    className={`inline-flex min-h-9 items-center gap-2 border-[3px] border-black px-2.5 font-mono text-[1.05rem] text-white transition-[opacity,transform] duration-200 hover:-translate-y-0.5 ${on ? 'outline outline-2 outline-white' : ''} ${skillLit(c.name) ? '' : 'opacity-25'}`}
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="label-mono mb-3 text-mist-muted">Projects</p>
            <ul className="flex flex-col gap-2">
              {projects.map((p) => {
                const on = sel?.kind === 'project' && sel.key === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle('project', p.id)}
                      className={`mc-slot w-full px-3 py-2 text-left transition-opacity duration-200 ${on ? 'mc-slot--active' : ''} ${projectLit(p.id) ? '' : 'opacity-30'} ${sel?.kind === 'skill' && projectLit(p.id) ? 'outline outline-2 outline-accent-light' : ''}`}
                    >
                      <span className="block font-pixel text-base text-white">{p.title}</span>
                      <span className="block font-mono text-[1.05rem] leading-tight text-mist-muted">
                        {p.technologies.length ? p.technologies.join(' · ') : 'no technologies listed'}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="label-mono text-[#ffff55] lg:col-span-2" aria-live="polite">
            {note}
          </p>
        </div>
      </div>
    </section>
  );
}
