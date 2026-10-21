import { useEffect, useRef, useState, type FormEvent } from 'react';
import { MessageSquare } from 'lucide-react';
import { useGame, type Weather } from './gameContext';
import { PLAYABLE, setMusic, sfx } from './sound';
import { personal, projects, skillCategories, skills } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Game-style chat with slash commands. Press T (or /) to open it, or use the
 * chat button. Commands teleport between sections, change the time and
 * weather, toggle sound and print facts from the portfolio data.
 */

interface Line {
  id: number;
  text: string;
  color?: string;
  at: number;
}

const TP_TARGETS: Record<string, string> = {
  spawn: 'hero',
  home: 'hero',
  hero: 'hero',
  about: 'about',
  focus: 'focus',
  skills: 'skills',
  projects: 'projects',
  experience: 'experience',
  education: 'education',
  certifications: 'certifications',
  certs: 'certifications',
  nether: 'certifications',
  contact: 'contact',
  end: 'contact',
};

const HELP = [
  '/tp <about|skills|projects|experience|education|certifications|contact|spawn>',
  '/theme <dark|light>   /time set <day|night>   /weather <clear|rain|thunder>   /sound <on|off>',
  '/playsound <name>   /music <on|off>   (press M to toggle sound)',
  '/whoami   /projects   /skills   /email   /github   /seed   /clear',
];

const YELLOW = '#ffff55';
const RED = '#ff5555';
const GRAY = '#aaaaaa';

let nextId = 1;

export function ChatConsole({ visible }: { visible: boolean }) {
  const { setNight, setWeather, setSound } = useGame();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [welcomed, setWelcomed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);

  const say = (text: string, color?: string) =>
    setLines((prev) => [...prev.slice(-30), { id: nextId++, text, color, at: Date.now() }]);

  if (visible && !welcomed) {
    setWelcomed(true);
    setLines([
      { id: nextId++, text: `Welcome to ${personal.firstName}'s world!`, color: YELLOW, at: now },
      { id: nextId++, text: 'Press T for commands, M for sound.', color: GRAY, at: now },
    ]);
  }

  // Old lines fade out like in-game chat; a slow clock is enough for that.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (open || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
      if (e.key === 't' || e.key === 'T' || e.key === '/') {
        e.preventDefault();
        setInput(e.key === '/' ? '/' : '');
        setOpen(true);
        sfx.chatOpen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, visible]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const run = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    history.current = [text, ...history.current].slice(0, 20);
    historyIndex.current = -1;
    if (!text.startsWith('/')) {
      say(`<Visitor> ${text}`);
      return;
    }
    say(text, GRAY);
    const [cmd, ...args] = text.slice(1).toLowerCase().split(/\s+/);
    const ok = (msg: string) => {
      say(msg);
      sfx.pop();
    };

    switch (cmd) {
      case 'help':
        HELP.forEach((h) => say(h, YELLOW));
        break;
      case 'tp':
      case 'teleport': {
        const id = TP_TARGETS[args[0] ?? ''];
        if (!id) {
          say('Unknown destination. Try /tp skills', RED);
          break;
        }
        document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        say(`Teleported to ${args[0]}`);
        sfx.teleport();
        setOpen(false);
        break;
      }
      case 'time': {
        const value = args[0] === 'set' ? args[1] : args[0];
        if (value === 'day' || value === 'noon') {
          setNight(false);
          ok('Set the time to day');
        } else if (value === 'night' || value === 'midnight') {
          setNight(true);
          ok('Set the time to night');
        } else say('Usage: /time set <day|night>', RED);
        break;
      }
      case 'theme': {
        const value = args[0];
        if (value === 'dark' || value === 'night' || value === 'black') {
          setNight(true);
          ok('Night mode on: dark theme');
        } else if (value === 'light' || value === 'day') {
          setNight(false);
          ok('Day mode on');
        } else say('Usage: /theme <dark|light>', RED);
        break;
      }
      case 'weather': {
        const value = args[0] as Weather | undefined;
        if (value === 'clear' || value === 'rain' || value === 'thunder') {
          setWeather(value);
          ok(`Changed the weather to ${value}`);
        } else say('Usage: /weather <clear|rain|thunder>', RED);
        break;
      }
      case 'sound':
        if (args[0] === 'on' || args[0] === 'off') {
          setSound(args[0] === 'on');
          say(`Sound effects ${args[0]}`);
        } else say('Usage: /sound <on|off>', RED);
        break;
      case 'playsound': {
        const play = PLAYABLE[args[0] ?? ''];
        if (play) {
          setSound(true);
          // Give the audio engine a moment to wake up the first time.
          window.setTimeout(play, 60);
          say(`Played sound ${args[0]}`);
        } else say(`Usage: /playsound <${Object.keys(PLAYABLE).join('|')}>`, RED);
        break;
      }
      case 'music':
        if (args[0] === 'on' || args[0] === 'off') {
          setMusic(args[0] === 'on');
          if (args[0] === 'on') setSound(true);
          say(`Background music ${args[0]}`);
        } else say('Usage: /music <on|off>', RED);
        break;
      case 'whoami':
        ok(`${personal.name} · ${personal.headline} · ${personal.location}`);
        break;
      case 'projects':
        projects.forEach((p) => say(`[${p.number}] ${p.title} · ${p.category}`, YELLOW));
        break;
      case 'skills':
        ok(`${skills.length} skills in ${skillCategories.length} categories: ${skillCategories.join(', ')}`);
        break;
      case 'email':
        navigator.clipboard?.writeText(personal.email).then(
          () => ok(`Copied ${personal.email} to the clipboard`),
          () => say(personal.email, YELLOW),
        );
        break;
      case 'github':
        window.open(personal.github, '_blank', 'noopener,noreferrer');
        ok(`Opening ${personal.github}`);
        break;
      case 'seed':
        ok('Seed: 1729');
        break;
      case 'clear':
        setLines([]);
        break;
      default:
        say('Unknown command. Type /help for help.', RED);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(input);
    setInput('');
  };

  if (!visible) return null;
  const shown = open ? lines.slice(-12) : lines.filter((l) => now - l.at < 9000).slice(-6);

  return (
    <div className="fixed bottom-[5.6rem] left-2 z-[46] flex w-[min(94vw,34rem)] flex-col gap-1 sm:bottom-3 sm:left-3">
      <div role="log" aria-live="polite" aria-label="Chat" className="flex flex-col">
        {shown.map((l) => (
          <p
            key={l.id}
            className="bg-black/55 px-2 py-0.5 font-mono text-[1.05rem] leading-tight text-white [text-shadow:2px_2px_0_#3f3f3f]"
            style={l.color ? { color: l.color } : undefined}
          >
            {l.text}
          </p>
        ))}
      </div>
      {open ? (
        <form onSubmit={onSubmit} className="flex">
          <label htmlFor="chat-input" className="sr-only">
            Chat command
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false);
              if (e.key === 'ArrowUp' && history.current.length) {
                historyIndex.current = Math.min(history.current.length - 1, historyIndex.current + 1);
                setInput(history.current[historyIndex.current]);
              }
            }}
            onBlur={() => !input && setOpen(false)}
            autoComplete="off"
            spellCheck={false}
            placeholder="Type /help"
            className="w-full border-0 bg-black/70 px-2 py-1.5 font-mono text-lg text-white placeholder:text-white/40 focus:outline-none focus-visible:outline-none"
          />
        </form>
      ) : (
        <button
          type="button"
          data-sound="chat"
          onClick={() => {
            setOpen(true);
            sfx.chatOpen();
          }}
          className="mc-btn flex h-10 w-10 items-center justify-center self-start"
          aria-label="Open chat commands (T)"
          title="Chat (T)"
        >
          <MessageSquare size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
