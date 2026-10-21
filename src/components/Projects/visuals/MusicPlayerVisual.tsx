import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Heart, Pause, Play, Search, SkipBack, SkipForward } from 'lucide-react';
import { MusicEngine, TRACKS, trackLength } from './musicEngine';

// A working mini music player: pick a cover or use play, pause, next and
// previous. The tracks are original chiptune loops synthesized in the browser,
// and the artwork is CSS gradients. No third-party branding or audio files.
// The project card hides this preview from assistive tech, so its controls
// stay out of the tab order and work with a mouse or touch.

const BAR_COUNT = 12;

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function MusicPlayerVisual() {
  const reduce = useReducedMotion();
  const engine = useRef<MusicEngine | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(() => new Set());
  const [typed, setTyped] = useState('');
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const indexRef = useRef(0);

  const track = TRACKS[index];
  const length = trackLength(track);

  const getEngine = () => {
    if (!engine.current) {
      engine.current = new MusicEngine();
      engine.current.onEnd = () => select((indexRef.current + 1) % TRACKS.length, true);
    }
    return engine.current;
  };

  function select(i: number, autoplay: boolean) {
    indexRef.current = i;
    setIndex(i);
    setTime(0);
    const e = getEngine();
    e.load(TRACKS[i]);
    if (autoplay) setPlaying(e.play());
  }

  const toggle = () => {
    const e = getEngine();
    if (e.playing) {
      e.pause();
      setPlaying(false);
    } else {
      e.load(TRACKS[index], time / length);
      setPlaying(e.play());
    }
  };

  const step = (dir: 1 | -1) => {
    // "Previous" restarts the song first, like real players, if it has been playing a while.
    if (dir === -1 && time > 3) return select(index, playing);
    select((index + dir + TRACKS.length) % TRACKS.length, playing || dir === 1);
  };

  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setTime(f * length);
    getEngine().load(track, f);
  };

  // Progress clock and a visualizer fed by the real audio output.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const data = new Uint8Array(32);
    const tick = () => {
      const e = engine.current;
      if (e) {
        setTime(e.position());
        if (e.analyser) {
          e.analyser.getByteFrequencyData(data);
          bars.current.forEach((el, i) => {
            if (el) el.style.transform = `scaleY(${Math.max(0.12, Math.min(1, (data[i + 1] / 255) * 1.4))})`;
          });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Rest the visualizer when paused.
  useEffect(() => {
    if (playing) return;
    bars.current.forEach((el, i) => {
      if (el) el.style.transform = `scaleY(${0.15 + ((i * 7) % 5) * 0.06})`;
    });
  }, [playing]);

  // The search bar types the name of whatever is selected.
  useEffect(() => {
    if (reduce) return;
    const target = TRACKS[index].title;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setTyped(target.slice(0, n));
      if (n >= target.length) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, [index, reduce]);

  // Stop the audio if the card goes away.
  useEffect(() => () => engine.current?.dispose(), []);

  const btn = 'flex items-center justify-center text-mist transition-[color,transform] hover:scale-110 hover:text-white active:scale-95';

  return (
    <div className="relative flex h-full w-full flex-col gap-3 overflow-clip border border-line bg-ink p-4 sm:gap-4 sm:p-6">
      {/* Glow tinted by the current cover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl transition-[background] duration-700"
        style={{ background: track.cover }}
      />

      <div className="relative flex items-center gap-2 rounded-full border border-line bg-ink-800 px-4 py-2 text-mist-dim">
        <Search size={14} aria-hidden="true" />
        <span className="label-mono truncate text-[0.65rem] text-mist">
          {reduce ? track.title : typed}
          <span className={`ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-accent-light ${reduce ? '' : 'animate-pulse'}`} />
        </span>
        <span className="label-mono ml-auto hidden text-[0.6rem] text-mist-dim sm:inline">original synth loops</span>
      </div>

      <div className="relative grid grid-cols-4 content-start gap-2 sm:gap-3">
        {TRACKS.map((t, i) => {
          const active = i === index;
          return (
            <button
              key={t.title}
              type="button"
              tabIndex={-1}
              onClick={() => (active ? toggle() : select(i, true))}
              className="group flex min-w-0 flex-col gap-2 text-left"
            >
              <div
                className={`relative aspect-square overflow-hidden rounded-xl transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 ${
                  active ? 'shadow-[0_0_0_2px_#7DDC5B,0_12px_30px_-10px_rgba(125,220,91,0.6)]' : ''
                }`}
                style={{ background: t.cover }}
              >
                {/* Hover play button, like the real thing */}
                <span
                  className={`absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center sm:bottom-2 sm:right-2 sm:h-9 sm:w-9 justify-center rounded-full bg-accent-light text-ink shadow-lg transition-all duration-300 ${
                    active && playing ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                  }`}
                >
                  {active && playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" className="ml-0.5" />}
                </span>
                {active && playing && (
                  <span className="absolute left-2 top-2 flex h-4 items-end gap-[2px]">
                    {[0, 1, 2].map((b) => (
                      <span key={b} className="eq-bar w-[3px] rounded-full bg-white" style={{ height: '100%', animationDelay: `${b * -0.2}s` }} />
                    ))}
                  </span>
                )}
              </div>
              <span className={`truncate text-[0.65rem] font-medium sm:text-xs ${active ? 'text-accent-light' : 'text-white/80'}`}>{t.title}</span>
              <span className="-mt-1.5 hidden truncate text-[0.7rem] text-mist-dim sm:block">{t.artist}</span>
            </button>
          );
        })}
      </div>

      {/* Up next: the queue after the current song, on roomier screens */}
      <div className="relative hidden min-h-0 flex-1 flex-col gap-1 overflow-clip md:flex">
        <span className="label-mono mb-1 text-[0.6rem] text-mist-dim">up next</span>
        {[1, 2, 3].map((k) => {
          const i = (index + k) % TRACKS.length;
          const t = TRACKS[i];
          return (
            <motion.button
              key={t.title}
              layout={!reduce}
              type="button"
              tabIndex={-1}
              onClick={() => select(i, true)}
              className="group flex items-center gap-3 px-2 py-1.5 text-left transition-colors hover:bg-white/5"
            >
              <span className="label-mono w-4 text-[0.65rem] text-mist-dim">
                <span className="group-hover:hidden">{k}</span>
                <Play size={11} fill="currentColor" className="hidden text-white group-hover:inline" />
              </span>
              <span className="h-7 w-7 shrink-0 rounded" style={{ background: t.cover }} />
              <span className="flex min-w-0 flex-1 items-baseline gap-2">
                <span className="truncate text-xs text-white/85 group-hover:text-white">{t.title}</span>
                <span className="hidden truncate text-[0.7rem] text-mist-dim lg:inline">{t.artist}</span>
              </span>
              <span className="label-mono w-8 text-right text-[0.6rem] text-mist-dim">{fmt(trackLength(t))}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Now-playing bar */}
      <div className="relative mt-auto flex items-center gap-3 mc-card p-3 sm:gap-4 sm:p-4">
        <div className="relative h-12 w-12 shrink-0">
          <motion.div
            className="h-full w-full rounded-full"
            style={{ background: track.cover }}
            animate={playing && !reduce ? { rotate: 360 } : { rotate: 0 }}
            transition={playing && !reduce ? { duration: 6, repeat: Infinity, ease: 'linear' } : { duration: 0.4 }}
          />
          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-ink-800" />
        </div>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-baseline gap-2"
            >
              <span className="truncate text-sm font-medium text-white">{track.title}</span>
              <span className="hidden truncate text-xs text-mist-dim sm:inline">{track.artist}</span>
            </motion.div>
          </AnimatePresence>
          <div className="mt-2 flex items-center gap-2">
            <span className="label-mono w-7 text-[0.6rem] text-mist-dim">{fmt(time)}</span>
            <div className="group relative flex h-3 flex-1 cursor-pointer items-center" onPointerDown={seek}>
              <div className="h-1 w-full rounded-full bg-white/10">
                <div className="h-full rounded-full bg-accent-light" style={{ width: `${(time / length) * 100}%` }} />
              </div>
              <span
                className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                style={{ left: `${(time / length) * 100}%` }}
              />
            </div>
            <span className="label-mono w-7 text-right text-[0.6rem] text-mist-dim">{fmt(length)}</span>
          </div>
        </div>

        <div className="hidden h-8 items-end gap-[3px] md:flex" aria-hidden="true">
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <span
              key={i}
              ref={(el) => {
                bars.current[i] = el;
              }}
              className="h-full w-[3px] origin-bottom rounded-full bg-accent-cyan/80 transition-transform duration-75"
              style={{ transform: 'scaleY(0.2)' }}
            />
          ))}
        </div>

        <button
          type="button"
          tabIndex={-1}
          onClick={() =>
            setLiked((s) => {
              const n = new Set(s);
              if (n.has(index)) n.delete(index);
              else n.add(index);
              return n;
            })
          }
          className={`${btn} hidden sm:flex ${liked.has(index) ? 'text-accent-light hover:text-accent-light' : ''}`}
        >
          <motion.span key={liked.has(index) ? 'on' : 'off'} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            <Heart size={16} fill={liked.has(index) ? 'currentColor' : 'none'} />
          </motion.span>
        </button>

        <div className="flex items-center gap-2">
          <button type="button" tabIndex={-1} onClick={() => step(-1)} className={btn}>
            <SkipBack size={16} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={toggle}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-mist text-ink transition-transform hover:scale-110 active:scale-95"
          >
            {playing && !reduce && <span className="absolute inset-0 animate-ping rounded-full bg-accent-light/30" />}
            {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </button>
          <button type="button" tabIndex={-1} onClick={() => step(1)} className={btn}>
            <SkipForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
