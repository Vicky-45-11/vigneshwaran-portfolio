import { useEffect, useMemo, useRef, useState } from 'react';
import { personal, projects } from '../../data/portfolio';
import { useGame } from '../World/gameContext';
import { sfx } from '../World/sound';
import { openSpotlight } from './spotlightEvents';

interface Cmd { id: string; group: string; label: string; hint?: string; run: () => void }

const SECTIONS: [string, string][] = [
  ['hero', 'Spawn point'], ['about', 'About me'], ['focus', 'Technical focus'], ['skills', 'Skills'], ['projects', 'Projects'],
  ['experience', 'Experience'], ['education', 'Education'], ['certifications', 'Certifications'], ['contact', 'Contact'],
];

/** Ctrl or Cmd + K: jump anywhere, open a project, change the world, or get in touch, all from the keyboard. */
export function CommandPalette({ visible }: { visible: boolean }) {
  const { night, setNight, setWeather, sound, setSound } = useGame();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const cmds = useMemo<Cmd[]>(() => {
    const go = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    return [
      ...SECTIONS.map(([id, label], i): Cmd => ({ id: `go:${id}`, group: 'Go to', label, hint: String(i + 1), run: go(id) })),
      ...projects.map((p, i): Cmd => ({ id: `p:${p.id}`, group: 'Projects', label: `${p.number} ${p.title}`, hint: p.category, run: () => openSpotlight(i) })),
      { id: 'night', group: 'World', label: night ? 'Switch to day' : 'Switch to night', run: () => setNight(!night) },
      { id: 'rain', group: 'World', label: 'Weather: rain', run: () => setWeather('rain') },
      { id: 'snow', group: 'World', label: 'Weather: snow', run: () => setWeather('snow') },
      { id: 'thunder', group: 'World', label: 'Weather: thunder', run: () => setWeather('thunder') },
      { id: 'clear', group: 'World', label: 'Weather: clear', run: () => setWeather('clear') },
      { id: 'sound', group: 'World', label: sound ? 'Sound off' : 'Sound on', hint: 'M', run: () => setSound(!sound) },
      { id: 'github', group: 'Links', label: 'Open GitHub', run: () => window.open(personal.github, '_blank', 'noopener,noreferrer') },
      { id: 'email', group: 'Links', label: 'Send an email', hint: personal.email, run: () => { window.location.href = `mailto:${personal.email}`; } },
    ];
  }, [night, sound, setNight, setWeather, setSound]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? cmds.filter((c) => `${c.group} ${c.label} ${c.hint ?? ''}`.toLowerCase().includes(t)) : cmds;
  }, [cmds, q]);

  const show = () => { returnTo.current = document.activeElement as HTMLElement | null; setQ(''); setSel(0); setOpen(true); sfx.pop(); };
  const hide = () => { setOpen(false); returnTo.current?.focus?.(); };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (open) hide(); else show(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  useEffect(() => { if (open) input.current?.focus(); }, [open]);

  if (!visible) return null;
  const run = (c?: Cmd) => { if (!c) return; setOpen(false); sfx.pop(); window.setTimeout(c.run, 60); };
  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); hide(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(list.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(list[sel]); }
  };

  return (
    <>
      <button type="button" onClick={show} aria-label="Open command palette (Ctrl K)" aria-haspopup="dialog"
        className="mc-slot label-mono fixed bottom-24 left-3 z-[44] hidden px-3 py-2 text-white sm:block">⌘K SEARCH</button>
      {open && (
        <div className="fixed inset-0 z-[85] flex items-start justify-center bg-black/70 p-3 pt-[12vh]" onMouseDown={(e) => { if (e.target === e.currentTarget) hide(); }}>
          <div role="dialog" aria-modal="true" aria-label="Command palette" className="mc-card w-full max-w-xl p-3">
            <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} onKeyDown={onInputKey} placeholder="Jump to a section, open a project, change the world…"
              role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-activedescendant={list[sel] ? `cmdk-${list[sel].id}` : undefined}
              className="w-full border-2 border-[#555] bg-black/60 px-3 py-3 font-pixel text-lg text-white outline-none focus:border-[#ffff55]" />
            <ul id="cmdk-list" role="listbox" className="mt-2 max-h-[52vh] overflow-y-auto">
              {list.length === 0 && <li className="px-3 py-4 text-mist-muted">Nothing matches “{q}”.</li>}
              {list.map((c, i) => (
                <li key={c.id} id={`cmdk-${c.id}`} role="option" aria-selected={i === sel}
                  ref={(el) => { if (el && i === sel) el.scrollIntoView({ block: 'nearest' }); }}
                  onMouseEnter={() => setSel(i)} onClick={() => run(c)}
                  className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${i === sel ? 'bg-[#3a5f2a] text-white' : 'text-mist'}`}>
                  <span className="label-mono w-20 shrink-0 text-accent-light">{c.group}</span>
                  <span className="min-w-0 flex-1 truncate">{c.label}</span>
                  {c.hint && <span className="label-mono max-w-[40%] truncate text-mist-muted">{c.hint}</span>}
                </li>
              ))}
            </ul>
            <p className="label-mono mt-2 px-1 text-mist-muted">↑ ↓ choose · Enter run · Esc close</p>
          </div>
        </div>
      )}
    </>
  );
}
