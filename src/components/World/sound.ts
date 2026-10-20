/**
 * Tiny synthesized sound effects (Web Audio, no audio files). Off by default;
 * the visitor turns them on from the navbar or with /sound on.
 */

let enabled = false;
let ctx: AudioContext | null = null;

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (on && !ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    ctx = Ctor ? new Ctor() : null;
  }
  void ctx?.resume();
}

function tone(freq: number, duration: number, type: OscillatorType, volume: number, slideTo?: number, delay = 0) {
  if (!enabled || !ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function noise(duration: number, volume: number, lowpass: number) {
  if (!enabled || !ctx) return;
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = lowpass;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start();
}

export const sfx = {
  click: () => tone(620, 0.06, 'square', 0.04, 420),
  breakBlock: () => noise(0.18, 0.25, 1400),
  pop: () => tone(520, 0.09, 'triangle', 0.08, 900),
  levelUp: () => {
    tone(523, 0.12, 'triangle', 0.08);
    tone(659, 0.12, 'triangle', 0.08, undefined, 0.1);
    tone(784, 0.22, 'triangle', 0.08, undefined, 0.2);
  },
  thunder: () => noise(1.6, 0.5, 260),
};
