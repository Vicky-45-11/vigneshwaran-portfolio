/**
 * Synthesized block-game sound effects and ambience (Web Audio, no audio
 * files). Everything is generated from oscillators and filtered noise, so the
 * sounds are original. Off by default; the visitor turns them on from the
 * title screen, the navbar, the M key or /sound on.
 *
 * The mix changes with where you are in the world: open air on the surface,
 * echo in the caves, a low rumble in the Nether and wind in The End.
 */

export type Material = 'grass' | 'dirt' | 'stone' | 'deepslate' | 'wood' | 'netherrack' | 'endstone';
export type Zone = 'surface' | 'cave' | 'nether' | 'end';
export type MobSound = 'pig' | 'sheep' | 'chicken' | 'bat';

let enabled = false;
let musicOn = true;
let ctx: AudioContext | null = null;
let bus: GainNode | null = null; // everything goes through here
let echoSend: GainNode | null = null;
let echoDelay: DelayNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

// Ambience loops
let rainGain: GainNode | null = null;
let rainFilter: BiquadFilterNode | null = null;
let rumbleGain: GainNode | null = null;
let windGain: GainNode | null = null;
let ambienceTimer = 0;

const state = { zone: 'surface' as Zone, weather: 'clear' as string, night: false };
let nextMusic = 0;
let nextCave = 0;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const vary = (v: number, amount = 0.08) => v * rand(1 - amount, 1 + amount);

function setup(): boolean {
  if (ctx) return true;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return false;
  ctx = new Ctor();

  const master = ctx.createGain();
  master.gain.value = 0.9;
  const limiter = ctx.createDynamicsCompressor();
  master.connect(limiter).connect(ctx.destination);

  bus = ctx.createGain();
  bus.connect(master);

  // A feedback delay gives caves and The End their echo.
  echoSend = ctx.createGain();
  echoSend.gain.value = 0;
  echoDelay = ctx.createDelay(1);
  echoDelay.delayTime.value = 0.2;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.38;
  const echoTone = ctx.createBiquadFilter();
  echoTone.type = 'lowpass';
  echoTone.frequency.value = 1800;
  bus.connect(echoSend);
  echoSend.connect(echoDelay).connect(echoTone).connect(feedback).connect(echoDelay);
  echoTone.connect(master);

  const length = ctx.sampleRate * 2;
  noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

  const loop = (filterType: BiquadFilterType, freq: number, q = 0.7) => {
    const src = ctx!.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;
    const filter = ctx!.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const gain = ctx!.createGain();
    gain.gain.value = 0;
    src.connect(filter).connect(gain).connect(master);
    src.start();
    return { filter, gain };
  };
  const rain = loop('lowpass', 5000);
  rainGain = rain.gain;
  rainFilter = rain.filter;
  rumbleGain = loop('lowpass', 160).gain;
  const wind = loop('bandpass', 420, 0.6);
  windGain = wind.gain;
  // The End's wind slowly changes pitch.
  const lfo = ctx.createOscillator();
  const lfoDepth = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoDepth.gain.value = 220;
  lfo.connect(lfoDepth).connect(wind.filter.frequency);
  lfo.start();
  return true;
}

interface ToneOptions {
  freq: number;
  to?: number;
  dur: number;
  type?: OscillatorType;
  vol: number;
  delay?: number;
  pan?: number;
  attack?: number;
  vibrato?: [rate: number, depth: number];
  filter?: [BiquadFilterType, number];
}

function out(pan?: number): AudioNode | null {
  if (!ctx || !bus) return null;
  if (pan === undefined || !ctx.createStereoPanner) return bus;
  const p = ctx.createStereoPanner();
  p.pan.value = Math.max(-1, Math.min(1, pan));
  p.connect(bus);
  return p;
}

function tone({ freq, to, dur, type = 'sine', vol, delay = 0, pan, attack = 0.005, vibrato, filter }: ToneOptions) {
  if (!enabled || !ctx) return;
  const dest = out(pan);
  if (!dest) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  if (vibrato) {
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = vibrato[0];
    depth.gain.value = vibrato[1];
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t0);
    lfo.stop(t0 + dur + 0.05);
  }
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  let node: AudioNode = osc;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = filter[0];
    f.frequency.value = filter[1];
    node = node.connect(f);
  }
  node.connect(gain).connect(dest);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

interface NoiseOptions {
  dur: number;
  vol: number;
  type?: BiquadFilterType;
  freq: number;
  q?: number;
  delay?: number;
  pan?: number;
  attack?: number;
}

function noise({ dur, vol, type = 'lowpass', freq, q = 0.8, delay = 0, pan, attack = 0.003 }: NoiseOptions) {
  if (!enabled || !ctx || !noiseBuffer) return;
  const dest = out(pan);
  if (!dest) return;
  const t0 = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(gain).connect(dest);
  src.start(t0, Math.random() * 1.5);
  src.stop(t0 + dur + 0.05);
}

/** Each material has its own texture of sound; `scale` makes footsteps softer. */
function material(m: Material, scale: number, pan?: number) {
  const v = (x: number) => x * scale;
  const d = (x: number) => x * (scale < 1 ? 0.7 : 1);
  switch (m) {
    case 'grass':
      noise({ dur: d(0.14), vol: v(0.3), type: 'bandpass', freq: vary(2600), q: 0.9, pan });
      noise({ dur: d(0.09), vol: v(0.18), type: 'bandpass', freq: vary(900), pan });
      break;
    case 'dirt':
      noise({ dur: d(0.15), vol: v(0.35), freq: vary(1000), pan });
      break;
    case 'stone':
      noise({ dur: d(0.09), vol: v(0.38), type: 'bandpass', freq: vary(1800), q: 2, pan });
      tone({ freq: vary(190), to: 120, dur: d(0.06), type: 'square', vol: v(0.04), pan });
      break;
    case 'deepslate':
      noise({ dur: d(0.12), vol: v(0.45), freq: vary(650), pan });
      tone({ freq: vary(110), to: 75, dur: d(0.08), type: 'square', vol: v(0.05), pan });
      break;
    case 'wood':
      tone({ freq: vary(230), to: 160, dur: d(0.1), type: 'triangle', vol: v(0.14), pan });
      noise({ dur: d(0.08), vol: v(0.18), type: 'bandpass', freq: vary(700), q: 3, pan });
      break;
    case 'netherrack':
      noise({ dur: d(0.11), vol: v(0.5), freq: vary(480), pan });
      noise({ dur: d(0.04), vol: v(0.1), type: 'bandpass', freq: vary(3200), pan });
      break;
    case 'endstone':
      noise({ dur: d(0.1), vol: v(0.3), type: 'bandpass', freq: vary(2200), q: 4, pan });
      tone({ freq: vary(880), to: 700, dur: d(0.08), vol: v(0.04), pan });
      break;
  }
}

// Original generative music: soft notes picked from a scale that suits the place.
const SCALES: Record<string, number[]> = {
  day: [60, 62, 64, 67, 69, 72, 74, 76], // major pentatonic
  night: [57, 60, 62, 64, 67, 69, 72], // minor pentatonic
  cave: [45, 48, 50, 52, 55, 57, 60],
  nether: [38, 39, 43, 45, 46, 50], // phrygian, low
  end: [72, 74, 76, 78, 80, 82, 84], // whole tone, high
};
const midi = (n: number) => 440 * 2 ** ((n - 69) / 12);

function musicNote() {
  const key = state.zone === 'surface' ? (state.night ? 'night' : 'day') : state.zone;
  const scale = SCALES[key];
  const note = scale[Math.floor(Math.random() * scale.length)];
  const len = state.zone === 'nether' ? 3.5 : 2.4;
  const vol = state.zone === 'end' ? 0.025 : 0.035;
  tone({ freq: midi(note), dur: len, vol, attack: 0.02, pan: rand(-0.4, 0.4) });
  tone({ freq: midi(note + 12), dur: len * 0.6, type: 'triangle', vol: vol * 0.25, attack: 0.02 });
  if (Math.random() < 0.3) {
    const harmony = scale[(scale.indexOf(note) + 2) % scale.length];
    tone({ freq: midi(harmony), dur: len, vol: vol * 0.7, attack: 0.02, delay: 0.35 });
  }
}

function caveSound() {
  // The eerie, distant noise that makes you look over your shoulder.
  const pan = rand(-0.9, 0.9);
  tone({ freq: rand(60, 80), to: rand(40, 55), dur: 4, vol: 0.06, attack: 1.2, pan, vibrato: [0.6, 4] });
  tone({ freq: rand(400, 700), to: rand(250, 350), dur: 3, type: 'triangle', vol: 0.012, attack: 1, delay: 0.6, pan: -pan });
  noise({ dur: 3.5, vol: 0.05, type: 'bandpass', freq: 300, q: 2, attack: 1.4, pan });
}

function ambienceTick() {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  if (musicOn && now >= nextMusic) {
    musicNote();
    const sparse = state.zone === 'cave' || state.zone === 'nether';
    nextMusic = now + (sparse ? rand(3.5, 7) : rand(1.6, 3.8)) + (Math.random() < 0.12 ? 6 : 0);
  }
  if (state.zone === 'cave' && now >= nextCave) {
    if (nextCave > 0) caveSound();
    nextCave = now + rand(18, 40);
  }
  if (state.zone !== 'cave') nextCave = now + rand(6, 12);
}

function applyAmbience() {
  if (!ctx || !rainGain || !rainFilter || !rumbleGain || !windGain || !echoSend || !echoDelay) return;
  const t = ctx.currentTime;
  const glide = (param: AudioParam, value: number, time = 1.2) => param.setTargetAtTime(value, t, time / 3);
  const { zone, weather } = state;
  const wet = weather === 'thunder' ? 0.16 : weather === 'rain' ? 0.11 : 0;
  // Rain is muffled underground and absent in the Nether and The End.
  glide(rainGain.gain, zone === 'surface' ? wet : zone === 'cave' ? wet * 0.25 : 0);
  glide(rainFilter.frequency, zone === 'surface' ? 5000 : 700);
  glide(rumbleGain.gain, zone === 'nether' ? 0.22 : 0);
  glide(windGain.gain, zone === 'end' ? 0.07 : 0);
  glide(echoSend.gain, zone === 'cave' ? 0.35 : zone === 'end' ? 0.45 : zone === 'nether' ? 0.2 : 0, 0.6);
  echoDelay.delayTime.setTargetAtTime(zone === 'end' ? 0.34 : zone === 'nether' ? 0.26 : 0.18, t, 0.2);
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (!on) {
    void ctx?.suspend();
    window.clearInterval(ambienceTimer);
    ambienceTimer = 0;
    return;
  }
  if (!setup() || !ctx) return;
  void ctx.resume();
  applyAmbience();
  nextMusic = ctx.currentTime + 1.5;
  if (!ambienceTimer) ambienceTimer = window.setInterval(ambienceTick, 250);
}

export function isSoundEnabled() {
  return enabled;
}

export function setMusic(on: boolean) {
  musicOn = on;
}

/** Tell the mixer where the camera is and what the weather is doing. */
export function setAmbience(zone: Zone, weather: string, night: boolean) {
  if (zone === state.zone && weather === state.weather && night === state.night) return;
  const zoneChanged = zone !== state.zone;
  state.zone = zone;
  state.weather = weather;
  state.night = night;
  if (!enabled) return;
  applyAmbience();
  if (zoneChanged && zone === 'nether') sfx.portal();
  if (zoneChanged && ctx) nextMusic = Math.min(nextMusic, ctx.currentTime + 1);
}

// Note-block harp pitches for the nine hotbar slots.
const HOTBAR_NOTES = [66, 68, 70, 71, 73, 75, 76, 78, 80];

export const sfx = {
  /** UI button click. */
  click: () => {
    tone({ freq: 1200, to: 900, dur: 0.035, type: 'square', vol: 0.03 });
    noise({ dur: 0.03, vol: 0.06, type: 'highpass', freq: 3000 });
  },
  /** Breaking a block made of the given material. */
  dig: (m: Material, pan?: number) => material(m, 1, pan),
  /** A soft footstep on the given material. */
  step: (m: Material) => material(m, 0.3, rand(-0.25, 0.25)),
  /** Item pickup pop, slightly different pitch each time. */
  pop: () => {
    const f = rand(650, 1000);
    tone({ freq: f, to: f * 1.7, dur: 0.07, vol: 0.09 });
  },
  /** Experience orb ding. */
  xp: () => {
    const f = [1318, 1397, 1568, 1760][Math.floor(Math.random() * 4)];
    tone({ freq: f, dur: 0.3, vol: 0.05 });
    tone({ freq: f * 2, dur: 0.15, type: 'triangle', vol: 0.012 });
  },
  levelUp: () => {
    [784, 988, 1175, 1568].forEach((f, i) => {
      tone({ freq: f, dur: 0.35, vol: 0.05, delay: i * 0.08 });
      tone({ freq: f * 2, dur: 0.2, type: 'triangle', vol: 0.012, delay: i * 0.08 });
    });
  },
  /** Opening a wooden chest: a creak and a thud. */
  chest: () => {
    tone({ freq: 140, to: 85, dur: 0.38, type: 'sawtooth', vol: 0.05, vibrato: [22, 6], filter: ['lowpass', 900] });
    noise({ dur: 0.18, vol: 0.3, freq: 380, delay: 0.3 });
  },
  /** Ender-style teleport: a warbling swoop out and back in. */
  teleport: () => {
    tone({ freq: 1100, to: 180, dur: 0.4, vol: 0.06, vibrato: [32, 90] });
    noise({ dur: 0.35, vol: 0.12, type: 'bandpass', freq: 2500, q: 1.5 });
    tone({ freq: 180, to: 1000, dur: 0.35, vol: 0.05, vibrato: [32, 90], delay: 0.38 });
  },
  /** Note-block harp pluck for a hotbar slot (0–8). */
  noteBlock: (slot: number) => {
    const f = midi(HOTBAR_NOTES[slot % HOTBAR_NOTES.length]);
    tone({ freq: f, dur: 0.6, type: 'triangle', vol: 0.07, attack: 0.002 });
    tone({ freq: f * 2, dur: 0.25, vol: 0.02, attack: 0.002 });
  },
  chatOpen: () => tone({ freq: 1500, dur: 0.04, type: 'square', vol: 0.02 }),
  mob: (kind: MobSound, pan?: number) => {
    if (kind === 'pig') {
      tone({ freq: vary(200), to: 140, dur: 0.14, type: 'sawtooth', vol: 0.06, vibrato: [45, 25], filter: ['lowpass', 900], pan });
      tone({ freq: vary(240), to: 160, dur: 0.16, type: 'sawtooth', vol: 0.06, vibrato: [45, 25], filter: ['lowpass', 900], delay: 0.18, pan });
    } else if (kind === 'sheep') {
      tone({ freq: vary(430), to: 370, dur: 0.6, type: 'sawtooth', vol: 0.045, attack: 0.04, vibrato: [11, 28], filter: ['bandpass', 1100], pan });
    } else if (kind === 'chicken') {
      [0, 0.1, 0.22].forEach((delay) =>
        tone({ freq: vary(1150), to: 1550, dur: 0.05, type: 'square', vol: 0.025, filter: ['bandpass', 1800], delay, pan }),
      );
    } else {
      tone({ freq: vary(3800), to: 4600, dur: 0.05, vol: 0.03, pan });
      tone({ freq: vary(4000), to: 4800, dur: 0.05, vol: 0.025, delay: 0.09, pan });
    }
  },
  /** The whoosh of stepping through a Nether portal. */
  portal: () => {
    tone({ freq: 90, to: 320, dur: 2.2, type: 'sawtooth', vol: 0.04, attack: 0.6, vibrato: [5, 12], filter: ['lowpass', 700] });
    noise({ dur: 2, vol: 0.12, type: 'bandpass', freq: 600, q: 1.2, attack: 0.7 });
  },
  explode: () => {
    noise({ dur: 0.12, vol: 0.5, type: 'highpass', freq: 1500 });
    noise({ dur: 1.4, vol: 0.7, freq: 320, attack: 0.01 });
    tone({ freq: 70, to: 30, dur: 0.9, vol: 0.12 });
  },
  thunder: () => {
    noise({ dur: 0.2, vol: 0.35, type: 'highpass', freq: 1800 });
    noise({ dur: 2.2, vol: 0.55, freq: 240, attack: 0.05, delay: 0.05 });
    noise({ dur: 1.4, vol: 0.25, freq: 120, delay: 0.6, attack: 0.2 });
  },
};

/** Sounds that can be played by name from the chat (/playsound). */
export const PLAYABLE: Record<string, () => void> = {
  pig: () => sfx.mob('pig'),
  sheep: () => sfx.mob('sheep'),
  chicken: () => sfx.mob('chicken'),
  bat: () => sfx.mob('bat'),
  xp: sfx.xp,
  levelup: sfx.levelUp,
  chest: sfx.chest,
  teleport: sfx.teleport,
  portal: sfx.portal,
  tnt: sfx.explode,
  thunder: sfx.thunder,
  stone: () => sfx.dig('stone'),
  grass: () => sfx.dig('grass'),
  wood: () => sfx.dig('wood'),
  note: () => sfx.noteBlock(Math.floor(Math.random() * 9)),
};
