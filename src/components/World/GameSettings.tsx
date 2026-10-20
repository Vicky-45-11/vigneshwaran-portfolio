import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { GameContext, type Weather } from './gameContext';
import { setSoundEnabled } from './sound';

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [night, setNight] = useState(false);
  const [weather, setWeather] = useState<Weather>('clear');
  const [sound, setSound] = useState(false);

  useEffect(() => setSoundEnabled(sound), [sound]);

  const value = useMemo(() => ({ night, setNight, weather, setWeather, sound, setSound }), [night, weather, sound]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
