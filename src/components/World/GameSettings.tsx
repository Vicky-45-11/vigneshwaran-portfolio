import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { GameContext, type Weather } from './gameContext';
import { setSoundEnabled, sfx } from './sound';

const THEME_KEY = 'vs-portfolio-theme';

function savedNight(): boolean {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'night';
  } catch {
    return false;
  }
}

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [night, setNight] = useState(savedNight);
  const [weather, setWeather] = useState<Weather>('clear');
  const [sound, setSound] = useState(false);

  useEffect(() => {
    setSoundEnabled(sound);
    if (sound) sfx.pop();
  }, [sound]);

  // Night is also the site's dark theme: CSS keys off data-theme, and the
  // choice is remembered for the next visit.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = night ? 'night' : 'day';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', night ? '#050508' : '#5E95F2');
    try {
      window.localStorage.setItem(THEME_KEY, night ? 'night' : 'day');
    } catch {
      // Storage can be unavailable (private mode); the theme still works for this visit.
    }
  }, [night]);

  // CSS dresses the interface for the weather (snow settles on the cards).
  useEffect(() => {
    document.documentElement.dataset.weather = weather;
  }, [weather]);

  // M toggles sound anywhere, unless the visitor is typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || (e.key !== 'm' && e.key !== 'M')) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
      setSound((on) => !on);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(() => ({ night, setNight, weather, setWeather, sound, setSound }), [night, weather, sound]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
