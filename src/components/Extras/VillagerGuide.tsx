import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { certifications, education, experience, personal, projects, skillCategories, skills } from '../../data/portfolio';
import { CATEGORY_LABEL } from '../Skills/categoryStyle';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// A guide that answers from this site's own data. It is a keyword lookup, not
// an AI model, and says so. Anything it cannot find it admits.

interface Msg {
  from: 'you' | 'guide';
  text: string;
}

const TOPICS: { chip: string; words: string[]; answer: () => string }[] = [
  {
    chip: 'Skills',
    words: ['skill', 'tech', 'stack', 'language', 'know', 'tools'],
    answer: () =>
      skillCategories
        .map((c) => `${CATEGORY_LABEL[c]}: ${skills.filter((s) => s.category === c).map((s) => s.name).join(', ')}`)
        .join('\n'),
  },
  {
    chip: 'Projects',
    words: ['project', 'built', 'build', 'work', 'made', 'portfolio'],
    answer: () => projects.map((p) => `${p.title} (${p.category}): ${p.description}`).join('\n'),
  },
  {
    chip: 'Education',
    words: ['educat', 'study', 'college', 'university', 'degree', 'cgpa', 'school', 'srm'],
    answer: () => education.map((e) => `${e.qualification}, ${e.institution}, ${e.period}${e.cgpa ? `, CGPA ${e.cgpa}` : ''}`).join('\n'),
  },
  {
    chip: 'Experience',
    words: ['experience', 'job', 'intern', 'role', 'team'],
    answer: () => experience.map((x) => `${x.organization}: ${x.responsibilities.map((r) => r.detail).join(' ')}`).join('\n'),
  },
  {
    chip: 'Certifications',
    words: ['certif', 'course', 'learn'],
    answer: () => certifications.map((c) => `${c.name} (${c.area})`).join('\n'),
  },
  {
    chip: 'Contact',
    words: ['contact', 'email', 'mail', 'reach', 'hire', 'github', 'phone', 'location', 'where', 'resume', 'cv'],
    answer: () => `Email: ${personal.email}\nGitHub: ${personal.github}\nBased in ${personal.location}.\nThe resume is in the Resume chest section, with a download button.`,
  },
  { chip: 'About', words: ['about', 'who', 'yourself', 'intro'], answer: () => personal.about },
];

const GREETING = `Hello! I'm the village guide. I'm not an AI, I just look things up on this site about ${personal.firstName}. Pick a topic or type a question.`;

function reply(q: string) {
  const s = q.toLowerCase();
  const hit = TOPICS.find((t) => t.words.some((w) => s.includes(w)) || s.includes(t.chip.toLowerCase()));
  return hit ? hit.answer() : "Hmm, I only know what's on this site: skills, projects, education, experience, certifications and how to get in touch.";
}

export function VillagerGuide() {
  const reduce = useReducedMotion();
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'guide', text: GREETING }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [msgs, busy, reduce]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text || busy) return;
    setMsgs((m) => [...m, { from: 'you', text }]);
    setInput('');
    setBusy(true);
    timer.current = window.setTimeout(
      () => {
        setMsgs((m) => [...m, { from: 'guide', text: reply(text) }]);
        setBusy(false);
      },
      reduce ? 0 : 550,
    );
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <section aria-labelledby="guide-title" className="relative z-10 pb-24 sm:pb-32">
      <div className="container-editorial">
        <SectionHeading index="08.6" label="Ask around" title="Village guide" id="guide-title" size="lg" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[14rem_1fr]">
          <div className="flex items-center gap-4 lg:flex-col lg:justify-center" aria-hidden="true">
            {/* Pixel villager */}
            <div className="relative h-28 w-24 border-[4px] border-black bg-[#b98a62]">
              <span className="absolute left-0 right-0 top-[18%] h-3 bg-[#5a3a22]" />
              <span className="absolute left-[18%] top-[34%] h-3 w-4 bg-white"><span className="block h-full w-2 translate-x-1 bg-[#2f7a2a]" /></span>
              <span className="absolute right-[18%] top-[34%] h-3 w-4 bg-white"><span className="block h-full w-2 bg-[#2f7a2a]" /></span>
              <span className="absolute left-1/2 top-[44%] h-10 w-5 -translate-x-1/2 bg-[#9a6f4a] shadow-[inset_0_-4px_0_#7a5638]" />
            </div>
            <p className="label-mono text-[#ffff55]">Village guide</p>
          </div>

          <div className="mc-card flex flex-col p-4 sm:p-5">
            <div ref={log} className="flex max-h-80 min-h-56 flex-col gap-3 overflow-y-auto pr-1" role="log" aria-live="polite">
              {msgs.map((m, i) => (
                <p
                  key={i}
                  className={`max-w-[85%] whitespace-pre-line px-3 py-2 font-mono text-[1.1rem] leading-snug ${
                    m.from === 'you' ? 'self-end bg-accent text-ink' : 'self-start bg-white/10 text-white'
                  }`}
                >
                  {m.text}
                </p>
              ))}
              {busy && <p className="label-mono self-start text-mist-muted">…</p>}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button key={t.chip} type="button" onClick={() => ask(t.chip)} disabled={busy} className="mc-btn min-h-11 px-3 text-sm disabled:opacity-60">
                  {t.chip}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Ask the village guide"
                placeholder="Ask about skills, projects, contact…"
                className="min-h-11 min-w-0 flex-1 border-[3px] border-black bg-black/50 px-3 font-mono text-[1.1rem] text-white placeholder:text-mist-dim focus:outline focus:outline-2 focus:outline-white"
              />
              <button type="submit" aria-label="Send" disabled={busy} className="mc-btn inline-flex min-h-11 items-center px-4 disabled:opacity-60">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
