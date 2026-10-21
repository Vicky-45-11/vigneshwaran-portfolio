import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { certifications, education, experience, personal, projects, skillCategories, skills } from '../../data/portfolio';
import { CATEGORY_LABEL } from '../Skills/categoryStyle';

// A small shell that prints this site's own data. Commands are looked up in a
// table; nothing is executed and nothing leaves the browser.

const FILES: Record<string, () => string> = {
  'about.txt': () => personal.about,
  'skills.txt': () =>
    skillCategories.map((c) => `${CATEGORY_LABEL[c]}: ${skills.filter((s) => s.category === c).map((s) => s.name).join(', ')}`).join('\n'),
  'education.txt': () => education.map((e) => `${e.qualification}, ${e.institution}, ${e.period}${e.cgpa ? `, CGPA ${e.cgpa}` : ''}`).join('\n'),
  'experience.txt': () => experience.map((x) => `${x.organization}\n${x.responsibilities.map((r) => `- ${r.detail}`).join('\n')}`).join('\n'),
  'certifications.txt': () => certifications.map((c) => `- ${c.name} (${c.area})`).join('\n'),
  'contact.txt': () => `email:  ${personal.email}\ngithub: ${personal.github}\nbase:   ${personal.location}`,
};

const COMMANDS: Record<string, (arg: string) => string> = {
  help: () => 'whoami   ls   ls projects   cat <file>   projects   skills   contact   resume   clear',
  whoami: () => `${personal.name}: ${personal.headline.toLowerCase()}, ${personal.location}`,
  ls: (arg) =>
    arg === 'projects'
      ? projects.map((p) => `${p.id}/`).join('  ')
      : [...Object.keys(FILES), 'projects/'].join('  '),
  cat: (arg) => (FILES[arg] ? FILES[arg]() : arg ? `cat: ${arg}: No such file` : 'usage: cat <file>   (try ls)'),
  projects: () => projects.map((p) => `${p.number} ${p.title} (${p.category})\n   ${p.description}`).join('\n'),
  skills: () => FILES['skills.txt'](),
  contact: () => FILES['contact.txt'](),
  resume: () => 'Download it from the Resume chest section: /Vigneshwaran_S_Resume.pdf',
};

interface Entry {
  cmd: string;
  out: string;
}

export function MiniTerminal() {
  const [log, setLog] = useState<Entry[]>([{ cmd: '', out: 'Type help to see the commands.' }]);
  const [input, setInput] = useState('');
  const sent = useRef<string[]>([]);
  const at = useRef(-1);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const run = (line: string) => {
    const text = line.trim();
    if (!text) return;
    sent.current.push(text);
    at.current = -1;
    const [name, ...rest] = text.split(/\s+/);
    if (name === 'clear') {
      setLog([]);
      return;
    }
    const fn = COMMANDS[name.toLowerCase()];
    setLog((l) => [...l, { cmd: text, out: fn ? fn(rest.join(' ').toLowerCase()) : `${name}: command not found. Try help.` }]);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(input);
    setInput('');
  };

  const keys = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const h = sent.current;
    if (!h.length) return;
    at.current = e.key === 'ArrowUp' ? Math.min(h.length - 1, at.current + 1) : Math.max(-1, at.current - 1);
    setInput(at.current === -1 ? '' : h[h.length - 1 - at.current]);
  };

  return (
    <section aria-labelledby="term-title" className="relative z-10 pb-24 sm:pb-32">
      <div className="container-editorial">
        <SectionHeading index="08.9" label="For developers" title="Terminal" id="term-title" size="lg" />

        <div className="mt-10 border-[3px] border-black bg-[#0a0f0a] shadow-[0_10px_0_-4px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-2 border-b-[3px] border-black bg-[#1a1f1a] px-3 py-2" aria-hidden="true">
            <span className="h-3 w-3 bg-[#ff5f56]" />
            <span className="h-3 w-3 bg-[#ffbd2e]" />
            <span className="h-3 w-3 bg-accent-light" />
            <span className="label-mono ml-2 text-[0.7rem] text-mist-muted">guest@{personal.githubHandle}: ~</span>
          </div>
          <div ref={box} className="h-72 overflow-y-auto p-4 font-mono text-[1.15rem] leading-snug text-accent-light" role="log" aria-live="polite">
            {log.map((e, i) => (
              <div key={i} className="mb-2">
                {e.cmd && (
                  <p className="text-white">
                    <span className="text-accent-cyan">$</span> {e.cmd}
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words">{e.out}</p>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 border-t-[3px] border-black px-4 py-2">
            <span className="font-mono text-[1.15rem] text-accent-cyan" aria-hidden="true">$</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={keys}
              aria-label="Terminal command"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="help"
              className="min-h-11 min-w-0 flex-1 bg-transparent font-mono text-[1.15rem] text-white placeholder:text-mist-dim focus:outline-none"
            />
          </form>
          <div className="flex flex-wrap gap-2 border-t-[3px] border-black px-4 py-3">
            {['help', 'whoami', 'ls', 'cat skills.txt', 'projects'].map((c) => (
              <button key={c} type="button" onClick={() => run(c)} className="mc-btn min-h-11 px-3 text-sm">
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
