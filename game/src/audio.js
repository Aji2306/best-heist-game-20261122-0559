// Procedural Web Audio API sound generator

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundFX = {
  beep(freq = 440, duration = 0.1, type = 'sine') {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio policy restrictions before user interaction
    }
  },

  alarm() {
    this.beep(880, 0.2, 'sawtooth');
    setTimeout(() => this.beep(660, 0.2, 'sawtooth'), 150);
  },

  hack() {
    this.beep(1200, 0.08, 'triangle');
    setTimeout(() => this.beep(1800, 0.08, 'triangle'), 80);
  },

  emp() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  },

  smoke() {
    this.beep(150, 0.3, 'sine');
  },

  loot() {
    this.beep(523.25, 0.15, 'sine');
    setTimeout(() => this.beep(659.25, 0.15, 'sine'), 120);
    setTimeout(() => this.beep(783.99, 0.25, 'sine'), 240);
  },

  win() {
    this.beep(440, 0.2);
    setTimeout(() => this.beep(554.37, 0.2), 200);
    setTimeout(() => this.beep(659.25, 0.2), 400);
    setTimeout(() => this.beep(880, 0.4), 600);
  }
};
