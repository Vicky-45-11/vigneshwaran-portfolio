import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { GameContext, type Weather } from './gameContext';
import { setSoundEnabled, sfx } from './sound';

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [night, setNight] = useState(false);
  const [weather, setWeather] = useState<Weather>('clear');
  const [sound, setSound] = useState(false);

  useEffect(() => {
    setSoundEnabled(sound);
    if (sound) sfx.pop();
  }, [sound]);

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
