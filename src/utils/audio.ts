// Web Audio API ambient chime and sound effects

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: number | null = null;
  private isMusicPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft woosh / gentle breath sound for blowing out candle
  playBlowCandle() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // White noise with pink fade
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Audio context might be restricted
    }
  }

  // Playful bubble/comic tap sound
  playPop() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // ignore
    }
  }

  // Gentle bell / music box chime when wish is made
  playWishChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch {
      // Audio fallback
    }
  }

  // Soft envelope open paper sound
  playEnvelopeOpen() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // Audio fallback
    }
  }

  // Greeting card opening sound (crisp paper unfold with gentle sparkle)
  playCardOpen() {
    this.playEnvelopeOpen();
    setTimeout(() => {
      try {
        const ctx = this.getContext();
        if (!ctx) return;
        const chime = ctx.createOscillator();
        const gain = ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(880, ctx.currentTime);
        chime.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        chime.connect(gain);
        gain.connect(ctx.destination);
        chime.start();
        chime.stop(ctx.currentTime + 0.45);
      } catch {
        // ignore
      }
    }, 120);
  }

  // Toggle ambient music box melody
  toggleAmbientMusic(onStateChange?: (playing: boolean) => void) {
    if (this.isMusicPlaying) {
      this.stopAmbientMusic();
      onStateChange?.(false);
      return false;
    } else {
      this.startAmbientMusic();
      onStateChange?.(true);
      return true;
    }
  }

  getIsMusicPlaying() {
    return this.isMusicPlaying;
  }

  startAmbientMusic() {
    const ctx = this.getContext();
    if (!ctx) return;
    this.stopAmbientMusic();
    this.isMusicPlaying = true;

    // A cozy, dreamy music box melody: Happy Birthday motif in pentatonic warmth
    const melody = [
      { note: 261.63, dur: 0.4 }, // C4
      { note: 261.63, dur: 0.4 }, // C4
      { note: 293.66, dur: 0.8 }, // D4
      { note: 261.63, dur: 0.8 }, // C4
      { note: 349.23, dur: 0.8 }, // F4
      { note: 329.63, dur: 1.4 }, // E4
      { note: 261.63, dur: 0.4 }, // C4
      { note: 261.63, dur: 0.4 }, // C4
      { note: 293.66, dur: 0.8 }, // D4
      { note: 261.63, dur: 0.8 }, // C4
      { note: 392.00, dur: 0.8 }, // G4
      { note: 349.23, dur: 1.4 }, // F4
      { note: 261.63, dur: 0.4 }, // C4
      { note: 261.63, dur: 0.4 }, // C4
      { note: 523.25, dur: 0.8 }, // C5
      { note: 440.00, dur: 0.8 }, // A4
      { note: 349.23, dur: 0.8 }, // F4
      { note: 329.63, dur: 0.8 }, // E4
      { note: 293.66, dur: 1.2 }, // D4
      { note: 466.16, dur: 0.4 }, // Bb4
      { note: 466.16, dur: 0.4 }, // Bb4
      { note: 440.00, dur: 0.8 }, // A4
      { note: 349.23, dur: 0.8 }, // F4
      { note: 392.00, dur: 0.8 }, // G4
      { note: 349.23, dur: 1.6 }, // F4
    ];

    let noteIndex = 0;
    const playNext = () => {
      if (!this.isMusicPlaying) return;
      const cur = melody[noteIndex % melody.length];
      noteIndex++;

      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Music box timbre with sine + slight overtone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(cur.note, ctx.currentTime);

        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + cur.dur + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + cur.dur + 0.6);
      } catch {
        // ignore
      }

      this.musicInterval = window.setTimeout(playNext, (cur.dur + 0.25) * 1000);
    };

    playNext();
  }

  stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // Celebratory fanfare sound effect ("Haaaa / Yaaay! / Tadaaa!")
  playCelebrationFanfare(customAudioSrc?: string) {
    if (customAudioSrc) {
      try {
        const audio = new Audio(customAudioSrc);
        audio.volume = 0.9;
        audio.play().catch(() => {
          this.playSynthesizedFanfare();
        });
        return;
      } catch {
        // Fallback to synth
      }
    }
    this.playSynthesizedFanfare();
  }

  playSynthesizedFanfare() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Joyful celebratory fanfare chords ("Tadaaa! / Haaaa!")
      const chords = [
        // Quick upward flourish
        { freq: 523.25, time: 0.0, dur: 0.15, vol: 0.25 }, // C5
        { freq: 659.25, time: 0.08, dur: 0.15, vol: 0.3 }, // E5
        { freq: 783.99, time: 0.16, dur: 0.2, vol: 0.35 }, // G5
        // Big triumphant sustained chord (C5 + E5 + G5 + C6)
        { freq: 523.25, time: 0.24, dur: 1.25, vol: 0.28 }, // C5
        { freq: 659.25, time: 0.24, dur: 1.25, vol: 0.32 }, // E5
        { freq: 783.99, time: 0.24, dur: 1.25, vol: 0.35 }, // G5
        { freq: 1046.50, time: 0.24, dur: 1.35, vol: 0.38 }, // C6
        { freq: 1318.51, time: 0.28, dur: 1.1, vol: 0.18 }, // E6 sparkle
      ];

      chords.forEach(({ freq, time, dur, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm harmonic wave (triangle with soft vibrato)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);
        osc.frequency.linearRampToValueAtTime(freq * 1.01, now + time + dur * 0.5);
        osc.frequency.linearRampToValueAtTime(freq, now + time + dur);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.linearRampToValueAtTime(vol, now + time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });

      // Party blower buzz overtone
      const buzzOsc = ctx.createOscillator();
      const buzzGain = ctx.createGain();
      buzzOsc.type = 'sawtooth';
      buzzOsc.frequency.setValueAtTime(440, now + 0.24);
      buzzOsc.frequency.exponentialRampToValueAtTime(520, now + 0.5);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now + 0.24);
      filter.Q.setValueAtTime(3, now + 0.24);

      buzzGain.gain.setValueAtTime(0.001, now + 0.24);
      buzzGain.gain.linearRampToValueAtTime(0.12, now + 0.32);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      buzzOsc.connect(filter);
      filter.connect(buzzGain);
      buzzGain.connect(ctx.destination);

      buzzOsc.start(now + 0.24);
      buzzOsc.stop(now + 0.95);
    } catch {
      // Audio fallback
    }
  }
}

export const sounds = new SoundEngine();
