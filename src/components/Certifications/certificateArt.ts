import type { Certification } from '../../data/portfolio';

// Builds an original, local SVG "credential card" for each certification so the
// carousel needs no remote images. It shows only the facts in portfolio.ts:
// no issuer logos, dates or credential IDs.

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const ACCENTS = ['#3B82F6', '#22D3EE', '#60A5FA', '#2563EB', '#38BDF8'];

export function certificateArt(cert: Certification, index: number, total: number, holder: string): string {
  const accent = ACCENTS[index % ACCENTS.length];
  const lines = wrap(cert.name.toUpperCase(), 15).slice(0, 5);
  const fontSize = lines.length > 3 ? 46 : 54;
  const titleTop = 430 - (lines.length - 1) * fontSize * 0.5;
  const number = String(index + 1).padStart(2, '0');
  const sans = "Geist, Inter, 'Helvetica Neue', Arial, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, Menlo, monospace";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760" width="600" height="760">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#171717"/>
      <stop offset="1" stop-color="#0C0C0C"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.1" r="0.7">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="title" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9CA3AF"/>
      <stop offset="1" stop-color="#FFFFFF"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#D7E2EA" stroke-opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="600" height="760" fill="url(#bg)"/>
  <rect width="600" height="760" fill="url(#grid)"/>
  <rect width="600" height="760" fill="url(#glow)"/>
  <rect x="24" y="24" width="552" height="712" rx="20" fill="none" stroke="#D7E2EA" stroke-opacity="0.12"/>
  <text x="56" y="88" font-family="${mono}" font-size="20" letter-spacing="5" fill="#9CA3AF">CERTIFICATION</text>
  <text x="544" y="88" text-anchor="end" font-family="${mono}" font-size="20" letter-spacing="3" fill="${accent}">${number} / ${String(total).padStart(2, '0')}</text>
  <g transform="translate(470 210)" fill="none" stroke="${accent}">
    <circle r="54" stroke-opacity="0.5"/>
    <circle r="40" stroke-opacity="0.9" stroke-width="2"/>
    <path d="M-14 -4 l10 10 l20 -22" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-26 34 l-12 44 l20 -10 l10 18 l10 -40 M26 34 l12 44 l-20 -10 l-10 18 l-10 -40" stroke-opacity="0.6" stroke-width="2"/>
  </g>
  <text font-family="${sans}" font-weight="900" font-size="${fontSize}" letter-spacing="-1" fill="url(#title)">
    ${lines.map((l, i) => `<tspan x="56" y="${(titleTop + i * fontSize * 1.02).toFixed(0)}">${escapeXml(l)}</tspan>`).join('')}
  </text>
  <line x1="56" y1="620" x2="544" y2="620" stroke="#D7E2EA" stroke-opacity="0.12"/>
  <text x="56" y="664" font-family="${mono}" font-size="18" letter-spacing="4" fill="${accent}">${escapeXml(cert.area.toUpperCase())}</text>
  <text x="56" y="698" font-family="${mono}" font-size="18" letter-spacing="4" fill="#646973">${escapeXml(holder.toUpperCase())}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
