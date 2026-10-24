export const SPOTLIGHT_EVENT = 'vs:spotlight';
/** Open the full-screen spotlight on a project (used by the cards and the command palette). */
export function openSpotlight(index: number) {
  window.dispatchEvent(new CustomEvent(SPOTLIGHT_EVENT, { detail: index }));
}
