import { useEffect, useState } from 'react';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/** True on devices with a precise hovering pointer (a mouse or trackpad). */
export function useFinePointer(): boolean {
  const [isFine, setIsFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(FINE_POINTER_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsFine(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return isFine;
}
