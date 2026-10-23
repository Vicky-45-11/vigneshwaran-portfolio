import { useMemo, useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { projects, skills } from '../../data/portfolio';

// Paste a job description and see which of the listed technologies are on this
// portfolio's skills list, and which are not. It runs in the browser, nothing
// is sent anywhere, and it only counts technologies it can find by name.

const ALIASES: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  react: 'React.js',
  'react.js': 'React.js',
  reactjs: 'React.js',
  node: 'Node.js',
  'node.js': 'Node.js',
  nodejs: 'Node.js',
  express: 'Express.js',
  'express.js': 'Express.js',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  mongo: 'MongoDB',
  mongodb: 'MongoDB',
  ml: 'Machine Learning',
  'machine learning': 'Machine Learning',
  'generative ai': 'Generative AI',
  genai: 'Generative AI',
  'prompt engineering': 'Prompt Engineering',
  dsa: 'Data Structures and Algorithms',
  'data structures': 'Data Structures and Algorithms',
  oop: 'OOP',
  dbms: 'DBMS',
  sql: 'SQL',
  mysql: 'MySQL',
  python: 'Python',
  java: 'Java',
  'c++': 'C++',
  html: 'HTML5',
  html5: 'HTML5',
  css: 'CSS3',
  css3: 'CSS3',
  git: 'Git',
  github: 'GitHub',
  docker: 'Docker',
  postman: 'Postman',
  supabase: 'Supabase',
  sdlc: 'SDLC',
  'operating systems': 'Operating Systems',
};

// Common requirements that are not on the skills list, so gaps are shown honestly.
const OTHERS = ['TypeScript', 'AWS', 'Azure', 'GCP', 'Kubernetes', 'Angular', 'Vue', 'Next.js', 'TensorFlow', 'PyTorch', 'Redis', 'GraphQL', 'Spring', 'Django', 'Flask', 'FastAPI', 'Tailwind', 'Linux', 'Kafka', 'Go', 'Rust', 'C#', '.NET', 'PHP', 'Figma', 'Jenkins'];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const has = (text: string, term: string, ignoreCase = true) =>
  new RegExp(`(^|[^A-Za-z0-9+#.])${esc(term)}(?![A-Za-z0-9+#])`, ignoreCase ? 'i' : '').test(text);

// Words that are also ordinary English must appear capitalized to count.
const AMBIGUOUS = new Set(['react', 'express', 'node', 'ml', 'js', 'dsa', 'oop', 'mongo', 'java']);
const hasAlias = (text: string, alias: string) => {
  if (!AMBIGUOUS.has(alias)) return has(text, alias);
  const cap = alias.charAt(0).toUpperCase() + alias.slice(1);
  return has(text, cap, false) || has(text, alias.toUpperCase(), false);
};

const SAMPLE = 'We are hiring a junior full-stack developer. You know Python or Java, SQL, React and Node.js, use Git and Docker, and have worked with TypeScript and AWS. Basic machine learning is a plus.';

export function FitChecker() {
  const [text, setText] = useState('');

  const result = useMemo(() => {
    if (!text.trim()) return null;
    const matched = new Set<string>();
    for (const [alias, skill] of Object.entries(ALIASES)) if (hasAlias(text, alias)) matched.add(skill);
    // Capital C on its own is the C language.
    if (/(^|[^A-Za-z0-9+#])C(?![A-Za-z0-9+#])/.test(text) && skills.some((s) => s.name === 'C')) matched.add('C');
    const gaps = OTHERS.filter((o) => has(text, o, false));
    const projs = projects.filter((p) => p.technologies.some((t) => matched.has(t)));
    return { matched: [...matched], gaps, projs };
  }, [text]);

  const total = result ? result.matched.length + result.gaps.length : 0;

  return (
    <section aria-labelledby="fit-title" className="relative z-10 pb-24 sm:pb-32">
      <div className="container-editorial">
        <SectionHeading index="08.8" label="For recruiters" title="Job fit check" id="fit-title" size="lg" />

        <div className="mc-card mt-10 grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
          <div>
            <label htmlFor="fit-input" className="label-mono text-mist-muted">
              Paste a job description
            </label>
            <textarea
              id="fit-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder="Paste the requirements here…"
              className="mt-2 w-full border-[3px] border-black bg-black/50 p-3 font-mono text-[1.1rem] leading-snug text-white placeholder:text-mist-dim focus:outline focus:outline-2 focus:outline-white"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <button type="button" onClick={() => setText(SAMPLE)} className="mc-btn min-h-11 px-3 text-sm">
                Try a sample
              </button>
              <span className="label-mono text-[0.7rem] text-mist-dim">Runs in your browser. Nothing is sent.</span>
            </div>
          </div>

          <div aria-live="polite">
            {!result ? (
              <p className="label-mono text-mist-muted">Results appear here.</p>
            ) : total === 0 ? (
              <p className="label-mono text-mist-muted">No technologies I recognise in that text.</p>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-pixel text-xl text-white">
                    {result.matched.length} of {total} technologies match
                  </p>
                  <div className="mt-2 h-2 bg-black/60" aria-hidden="true">
                    <div className="h-full bg-accent-light transition-[width] duration-500" style={{ width: `${(result.matched.length / total) * 100}%` }} />
                  </div>
                </div>
                {result.matched.length > 0 && (
                  <div>
                    <p className="label-mono mb-2 text-accent-light">On the skills list</p>
                    <div className="flex flex-wrap gap-2">
                      {result.matched.map((m) => (
                        <span key={m} className="border-[3px] border-black bg-accent px-2.5 font-mono text-[1.05rem] text-ink">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                {result.gaps.length > 0 && (
                  <div>
                    <p className="label-mono mb-2 text-mist-muted">Not on the skills list yet</p>
                    <div className="flex flex-wrap gap-2">
                      {result.gaps.map((m) => (
                        <span key={m} className="border-[3px] border-black bg-white/10 px-2.5 font-mono text-[1.05rem] text-mist">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                {result.projs.length > 0 && (
                  <p className="font-mono text-[1.1rem] leading-snug text-mist">
                    Related projects: {result.projs.map((p) => p.title.toLowerCase()).join(', ')}.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
