/**
 * Tiny synth that plays the demo tracks in the Spotify Clone preview. Each
 * track is an original chiptune loop generated with Web Audio oscillators and
 * noise (no audio files, nothing copyrighted). A lookahead scheduler queues
 * sixteenth notes slightly ahead of time so playback stays steady.
 */

export interface Track {
  title: string;
  artist: string;
  cover: string;
  bpm: number;
  /** MIDI note of the key's root. */
  root: number;
  /** One chord per bar, as semitone offsets from the root (4 bars, looped twice). */
  chords: number[][];
  /** Arpeggio pattern over the 16 steps of a bar: index into the chord, or -1 for rest. */
  arp: number[];
  lead: OscillatorType;
  drums: boolean;
}

export const TRACKS: Track[] = [
  {
    title: 'Overworld Dawn',
    artist: 'Block Synth',
    cover: 'linear-gradient(135deg, #0B1F3A 0%, #2563EB 55%, #22D3EE 100%)',
    bpm: 104,
    root: 60,
    chords: [[0, 4, 7, 12], [-3, 0, 4, 9], [-7, -3, 0, 5], [-5, -1, 2, 7]],
    arp: [0, -1, 1, 2, 3, -1, 2, 1, 0, -1, 1, 2, 3, 2, 1, -1],
    lead: 'triangle',
    drums: false,
  },
  {
    title: 'Redstone Pulse',
    artist: 'Circuit Choir',
    cover: 'radial-gradient(circle at 30% 30%, #60A5FA, #0B1F3A 70%)',
    bpm: 124,
    root: 57,
    chords: [[0, 3, 7, 12], [-4, 0, 3, 8], [-2, 2, 5, 10], [-5, -2, 2, 7]],
    arp: [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 3, 2, 1, 2],
    lead: 'square',
    drums: true,
  },
  {
    title: 'Deep Dark',
    artist: 'Cave Echo',
    cover: 'conic-gradient(from 200deg, #111111, #3B82F6, #D7E2EA, #111111)',
    bpm: 88,
    root: 50,
    chords: [[0, 3, 7, 10], [-2, 2, 5, 9], [-4, 0, 3, 7], [-5, -1, 2, 5]],
    arp: [0, -1, -1, 2, -1, -1, 1, -1, 3, -1, -1, 2, -1, 1, -1, -1],
    lead: 'sine',
    drums: false,
  },
  {
    title: 'End Drift',
    artist: 'Void Arcade',
    cover: 'linear-gradient(200deg, #22D3EE 0%, #0C0C0C 80%)',
    bpm: 116,
    root: 62,
    chords: [[0, 4, 7, 11], [5, 9, 12, 16], [-3, 0, 4, 7], [2, 5, 9, 12]],
    arp: [3, 2, 1, 0, 1, 2, 3, -1, 3, 2, 1, 0, 2, -1, 1, -1],
    lead: 'sawtooth',
    drums: true,
  },
];

export const STEPS_PER_TRACK = 16 * 8; // 8 bars of sixteenths

export function trackLength(t: Track) {
  return (STEPS_PER_TRACK * 60) / t.bpm / 4;
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

export class MusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  analyser: AnalyserNode | null = null;
  private timer = 0;
  private nextTime = 0;
  private step = 0;
  private track: Track = TRACKS[0];
  private startedAt = 0;
  private startStep = 0;
  onEnd: (() => void) | null = null;

  private setup() {
    if (this.ctx) return true;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return false;
    const ctx = new Ctor();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.5;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.75;
    const limiter = ctx.createDynamicsCompressor();
    this.master.connect(this.analyser).connect(limiter).connect(ctx.destination);
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buf;
    return true;
  }

  get playing() {
    return this.timer !== 0;
  }

  /** Seconds into the current track. */
  position() {
    if (!this.ctx) return 0;
    const sixteenth = 60 / this.track.bpm / 4;
    if (!this.playing) return this.startStep * sixteenth;
    return Math.min(trackLength(this.track), this.startStep * sixteenth + (this.ctx.currentTime - this.startedAt));
  }

  load(track: Track, fraction = 0) {
    this.track = track;
    this.step = Math.floor(fraction * STEPS_PER_TRACK);
    this.startStep = this.step;
    if (this.ctx && this.playing) {
      this.nextTime = this.ctx.currentTime + 0.05;
      this.startedAt = this.nextTime;
    }
  }

  play() {
    if (!this.setup() || !this.ctx) return false;
    void this.ctx.resume();
    if (this.playing) return true;
    this.startStep = this.step;
    this.nextTime = this.ctx.currentTime + 0.06;
    this.startedAt = this.nextTime;
    this.timer = window.setInterval(() => this.schedule(), 40);
    return true;
  }

  pause() {
    window.clearInterval(this.timer);
    this.timer = 0;
    this.startStep = this.step;
    void this.ctx?.suspend();
  }

  dispose() {
    this.pause();
    void this.ctx?.close();
    this.ctx = null;
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx) return;
    const sixteenth = 60 / this.track.bpm / 4;
    while (this.nextTime < ctx.currentTime + 0.15) {
      if (this.step >= STEPS_PER_TRACK) {
        this.pause();
        this.step = 0;
        this.startStep = 0;
        this.onEnd?.();
        return;
      }
      this.playStep(this.step, this.nextTime, sixteenth);
      this.step += 1;
      this.nextTime += sixteenth;
    }
  }

  private playStep(step: number, t: number, len: number) {
    const tr = this.track;
    const s = step % 16;
    const chord = tr.chords[Math.floor(step / 16) % tr.chords.length];
    // Pad: the whole chord, held for the bar
    if (s === 0) chord.forEach((n) => this.voice(midi(tr.root + n), t, len * 16, 'sawtooth', 0.018, 900));
    // Bass on the beat
    if (s % 4 === 0) this.voice(midi(tr.root - 24 + chord[0]), t, len * 3, 'triangle', 0.12, 600);
    // Arpeggio lead
    const a = tr.arp[s];
    if (a >= 0) this.voice(midi(tr.root + 12 + chord[a % chord.length]), t, len * 0.9, tr.lead, tr.lead === 'sine' ? 0.07 : 0.035, 3200);
    if (tr.drums) {
      if (s % 4 === 0) this.kick(t);
      if (s % 4 === 2) this.hat(t, 0.05);
      if (s === 4 || s === 12) this.hat(t, 0.09, 1800);
    } else if (s % 8 === 4) {
      this.hat(t, 0.025);
    }
  }

  private voice(freq: number, t: number, dur: number, type: OscillatorType, vol: number, cutoff: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(filter).connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private kick(t: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  private hat(t: number, vol: number, freq = 7000) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(f).connect(g).connect(this.master!);
    src.start(t);
    src.stop(t + 0.06);
  }
}
