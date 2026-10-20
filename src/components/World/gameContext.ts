import { createContext, useContext } from 'react';

export type Weather = 'clear' | 'rain' | 'thunder';

export interface GameSettings {
  night: boolean;
  setNight: (night: boolean) => void;
  weather: Weather;
  setWeather: (weather: Weather) => void;
  sound: boolean;
  setSound: (sound: boolean) => void;
}

export const GameContext = createContext<GameSettings | null>(null);

/** Shared world settings: time of day, weather and sound. */
export function useGame(): GameSettings {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGame must be used inside GameSettingsProvider');
  return value;
}
