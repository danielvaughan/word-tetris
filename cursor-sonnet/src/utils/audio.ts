/**
 * Audio manager for game sounds
 * Implements sound effects using Web Audio API
 */

export type SoundEffect =
  | 'move'
  | 'softDrop'
  | 'hardDrop'
  | 'lock'
  | 'wordShort'
  | 'wordMedium'
  | 'wordLong'
  | 'rareLetterPlace'
  | 'wordRemove'
  | 'cascade'
  | 'chain1'
  | 'chain2'
  | 'chain3'
  | 'scoreMilestone'
  | 'lineClear'
  | 'levelUp'
  | 'gameOver'
  | 'newHighScore'
  | 'pause'
  | 'resume'
  | 'menuHover'
  | 'menuClick'
  | 'invalidAction';

class AudioManager {
  private enabled: boolean = true;
  private volume: number = 0.5;
  private musicEnabled: boolean = false; // Off by default
  private sfxEnabled: boolean = true;
  private audioContext: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private musicPlaying: boolean = false;
  private musicIntervalId: number | null = null;
  
  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }
  
  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.musicGainNode = this.audioContext.createGain();
      this.musicGainNode.connect(this.audioContext.destination);
      this.musicGainNode.gain.value = this.volume * 0.3; // Music at 30% of main volume
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }
  
  private ensureAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    // Resume context if suspended (browser autoplay policy)
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
    
    return this.audioContext;
  }
  
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.volume * 0.3;
    }
  }
  
  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    } else if (this.audioContext && !this.musicPlaying) {
      // If music was disabled and now enabled during gameplay, start it
      this.playMusic();
    }
  }
  
  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }
  
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volumeMultiplier: number = 1): void {
    const ctx = this.ensureAudioContext();
    if (!ctx || !this.enabled || !this.sfxEnabled) return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    const finalVolume = this.volume * volumeMultiplier;
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }
  
  private playChord(frequencies: number[], duration: number, type: OscillatorType = 'sine', volumeMultiplier: number = 1): void {
    frequencies.forEach(freq => {
      this.playTone(freq, duration, type, volumeMultiplier / frequencies.length);
    });
  }
  
  play(sound: SoundEffect, volumeMultiplier: number = 1): void {
    if (!this.enabled || !this.sfxEnabled) return;
    
    switch (sound) {
      case 'move':
      case 'softDrop':
      case 'hardDrop':
        // Silent - no sound for block movements
        break;
        
      case 'lock':
        // Satisfying click when block comes to rest
        this.playTone(440, 0.08, 'triangle', 0.6 * volumeMultiplier);
        setTimeout(() => this.playTone(550, 0.06, 'sine', 0.4 * volumeMultiplier), 30);
        break;
        
      case 'wordShort':
        // Low pitch chime for 3-letter words
        this.playChord([523.25, 659.25], 0.3, 'sine', 0.7 * volumeMultiplier);
        break;
        
      case 'wordMedium':
        // Medium pitch chime for 4-5 letter words
        this.playChord([659.25, 783.99], 0.35, 'sine', 0.8 * volumeMultiplier);
        break;
        
      case 'wordLong':
        // High pitch chime with flourish for 6+ letter words
        setTimeout(() => this.playChord([783.99, 987.77], 0.15, 'sine', 0.6 * volumeMultiplier), 0);
        setTimeout(() => this.playChord([987.77, 1174.66], 0.4, 'sine', 0.9 * volumeMultiplier), 100);
        break;
        
      case 'rareLetterPlace':
        // Sparkle sound for Q, X, Z, J
        [800, 1000, 1200, 1400].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 0.08, 'sine', 0.4 * volumeMultiplier), i * 40);
        });
        break;
        
      case 'wordRemove':
        // Whoosh/disappear sound
        const ctx = this.ensureAudioContext();
        if (ctx) {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(800, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
          
          gainNode.gain.setValueAtTime(0.3 * volumeMultiplier * this.volume, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.3);
        }
        break;
        
      case 'cascade':
        // Falling blocks sound
        [600, 500, 400].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 0.08, 'triangle', 0.3 * volumeMultiplier), i * 50);
        });
        break;
        
      case 'chain1':
        // First chain - escalating tone
        this.playChord([523.25, 659.25, 783.99], 0.4, 'sine', 0.8 * volumeMultiplier);
        break;
        
      case 'chain2':
        // Second chain - higher escalating tone
        this.playChord([659.25, 783.99, 987.77], 0.4, 'sine', 0.9 * volumeMultiplier);
        break;
        
      case 'chain3':
        // Third+ chain - highest escalating tone
        this.playChord([783.99, 987.77, 1174.66], 0.5, 'sine', 1.0 * volumeMultiplier);
        break;
        
      case 'scoreMilestone':
        // Achievement sound
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 0.2, 'triangle', 0.7 * volumeMultiplier), i * 100);
        });
        break;
        
      case 'lineClear':
        this.playChord([440, 554.37], 0.3, 'square', 0.5 * volumeMultiplier);
        break;
        
      case 'levelUp':
        // Triumphant fanfare
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 0.15, 'triangle', 0.8 * volumeMultiplier), i * 80);
        });
        setTimeout(() => this.playChord([1046.50, 1318.51, 1568], 0.6, 'sine', 0.9 * volumeMultiplier), 450);
        break;
        
      case 'gameOver':
        // Descending tone sequence
        [523.25, 466.16, 415.30, 369.99, 329.63].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.7 * volumeMultiplier), i * 150);
        });
        break;
        
      case 'newHighScore':
        // Victory fanfare
        [783.99, 987.77, 1174.66, 1318.51, 1568].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 0.2, 'triangle', 0.8 * volumeMultiplier), i * 100);
        });
        setTimeout(() => {
          this.playChord([1046.50, 1318.51, 1568, 2093], 0.8, 'sine', 1.0 * volumeMultiplier);
        }, 600);
        break;
        
      case 'pause':
        this.playChord([440, 554.37], 0.2, 'sine', 0.5 * volumeMultiplier);
        break;
        
      case 'resume':
        this.playChord([554.37, 659.25], 0.2, 'sine', 0.5 * volumeMultiplier);
        break;
        
      case 'menuHover':
        this.playTone(600, 0.05, 'sine', 0.3 * volumeMultiplier);
        break;
        
      case 'menuClick':
        this.playTone(800, 0.1, 'triangle', 0.6 * volumeMultiplier);
        break;
        
      case 'invalidAction':
        this.playTone(200, 0.15, 'square', 0.4 * volumeMultiplier);
        break;
    }
  }
  
  playWordSound(wordLength: number): void {
    if (wordLength === 3) {
      this.play('wordShort');
    } else if (wordLength <= 5) {
      this.play('wordMedium');
    } else {
      this.play('wordLong');
    }
  }
  
  playChainSound(chainLevel: number): void {
    if (chainLevel === 1) {
      this.play('chain1');
    } else if (chainLevel === 2) {
      this.play('chain2');
    } else {
      this.play('chain3');
    }
  }
  
  checkScoreMilestone(oldScore: number, newScore: number): void {
    const milestones = [1000, 5000, 10000, 25000, 50000];
    
    for (const milestone of milestones) {
      if (oldScore < milestone && newScore >= milestone) {
        this.play('scoreMilestone', 1.0);
        break;
      }
    }
  }
  
  private playNote(
    frequency: number,
    startTime: number,
    duration: number,
    volume: number = 0.15
  ): void {
    if (!this.audioContext || !this.musicGainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    // Square wave for classic 8-bit sound
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    noteGain.gain.setValueAtTime(volume, startTime + duration - 0.05);
    noteGain.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.connect(noteGain);
    noteGain.connect(this.musicGainNode);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  private playMelody(): void {
    if (!this.audioContext || !this.musicEnabled || !this.enabled) return;

    const currentTime = this.audioContext.currentTime;
    const beatDuration = 0.3; // 200 BPM

    // Extended 8-bit Tetris-inspired melody (much longer before repeating)
    // Part A - Main theme
    const melody = [
      // Phrase 1
      { note: 659.25, duration: 1 },   // E5
      { note: 493.88, duration: 0.5 }, // B4
      { note: 523.25, duration: 0.5 }, // C5
      { note: 587.33, duration: 1 },   // D5
      { note: 523.25, duration: 0.5 }, // C5
      { note: 493.88, duration: 0.5 }, // B4
      { note: 440.00, duration: 1 },   // A4
      { note: 440.00, duration: 0.5 }, // A4
      { note: 523.25, duration: 0.5 }, // C5
      { note: 659.25, duration: 1 },   // E5
      { note: 587.33, duration: 0.5 }, // D5
      { note: 523.25, duration: 0.5 }, // C5
      { note: 493.88, duration: 1.5 }, // B4
      { note: 523.25, duration: 0.5 }, // C5
      { note: 587.33, duration: 1 },   // D5
      { note: 659.25, duration: 1 },   // E5
      { note: 523.25, duration: 1 },   // C5
      { note: 440.00, duration: 1 },   // A4
      { note: 440.00, duration: 1 },   // A4
      { note: 0, duration: 0.5 },      // Rest
      
      // Phrase 2 - Variation
      { note: 587.33, duration: 1.5 }, // D5
      { note: 698.46, duration: 0.5 }, // F5
      { note: 880.00, duration: 1 },   // A5
      { note: 783.99, duration: 0.5 }, // G5
      { note: 698.46, duration: 0.5 }, // F5
      { note: 659.25, duration: 1.5 }, // E5
      { note: 523.25, duration: 0.5 }, // C5
      { note: 659.25, duration: 1 },   // E5
      { note: 587.33, duration: 0.5 }, // D5
      { note: 523.25, duration: 0.5 }, // C5
      { note: 493.88, duration: 1 },   // B4
      { note: 493.88, duration: 0.5 }, // B4
      { note: 523.25, duration: 0.5 }, // C5
      { note: 587.33, duration: 1 },   // D5
      { note: 659.25, duration: 1 },   // E5
      { note: 523.25, duration: 1 },   // C5
      { note: 440.00, duration: 1 },   // A4
      { note: 440.00, duration: 1 },   // A4
      { note: 0, duration: 0.5 },      // Rest
      
      // Phrase 3 - Bridge
      { note: 659.25, duration: 1 },   // E5
      { note: 523.25, duration: 0.5 }, // C5
      { note: 587.33, duration: 0.5 }, // D5
      { note: 493.88, duration: 1 },   // B4
      { note: 523.25, duration: 0.5 }, // C5
      { note: 440.00, duration: 0.5 }, // A4
      { note: 392.00, duration: 1 },   // G4
      { note: 392.00, duration: 0.5 }, // G4
      { note: 523.25, duration: 0.5 }, // C5
      { note: 659.25, duration: 1 },   // E5
      { note: 587.33, duration: 0.5 }, // D5
      { note: 523.25, duration: 0.5 }, // C5
      { note: 493.88, duration: 1.5 }, // B4
      { note: 523.25, duration: 0.5 }, // C5
      { note: 587.33, duration: 1 },   // D5
      { note: 659.25, duration: 1 },   // E5
      { note: 523.25, duration: 1 },   // C5
      { note: 440.00, duration: 1 },   // A4
      { note: 440.00, duration: 1 },   // A4
      { note: 0, duration: 0.5 },      // Rest
      
      // Phrase 4 - Finale variation
      { note: 587.33, duration: 1 },   // D5
      { note: 698.46, duration: 1 },   // F5
      { note: 880.00, duration: 1 },   // A5
      { note: 783.99, duration: 1 },   // G5
      { note: 698.46, duration: 1 },   // F5
      { note: 659.25, duration: 1 },   // E5
      { note: 523.25, duration: 1 },   // C5
      { note: 659.25, duration: 1 },   // E5
      { note: 587.33, duration: 1 },   // D5
      { note: 523.25, duration: 1 },   // C5
      { note: 493.88, duration: 2 },   // B4
      { note: 0, duration: 1 },        // Rest
    ];

    // Extended bass line (matches longer melody)
    const bass = [
      // Section 1
      { note: 164.81, duration: 2 },   // E3
      { note: 220.00, duration: 2 },   // A3
      { note: 196.00, duration: 2 },   // G3
      { note: 164.81, duration: 2 },   // E3
      { note: 146.83, duration: 2 },   // D3
      { note: 220.00, duration: 2 },   // A3
      { note: 196.00, duration: 2 },   // G3
      { note: 164.81, duration: 2 },   // E3
      { note: 164.81, duration: 2 },   // E3
      { note: 220.00, duration: 2 },   // A3
      
      // Section 2
      { note: 146.83, duration: 2 },   // D3
      { note: 174.61, duration: 2 },   // F3
      { note: 220.00, duration: 2 },   // A3
      { note: 164.81, duration: 2 },   // E3
      { note: 130.81, duration: 2 },   // C3
      { note: 220.00, duration: 2 },   // A3
      { note: 196.00, duration: 2 },   // G3
      { note: 164.81, duration: 2 },   // E3
      { note: 164.81, duration: 2 },   // E3
      { note: 220.00, duration: 2 },   // A3
      
      // Section 3
      { note: 164.81, duration: 2 },   // E3
      { note: 196.00, duration: 2 },   // G3
      { note: 146.83, duration: 2 },   // D3
      { note: 164.81, duration: 2 },   // E3
      { note: 130.81, duration: 2 },   // C3
      { note: 220.00, duration: 2 },   // A3
      { note: 196.00, duration: 2 },   // G3
      { note: 164.81, duration: 2 },   // E3
      { note: 164.81, duration: 2 },   // E3
      { note: 220.00, duration: 2 },   // A3
      
      // Section 4
      { note: 146.83, duration: 2 },   // D3
      { note: 174.61, duration: 2 },   // F3
      { note: 220.00, duration: 2 },   // A3
      { note: 196.00, duration: 2 },   // G3
      { note: 164.81, duration: 2 },   // E3
      { note: 130.81, duration: 2 },   // C3
      { note: 164.81, duration: 3 },   // E3
    ];

    let time = currentTime;

    // Play melody
    melody.forEach((note) => {
      if (note.note > 0) {
        this.playNote(note.note, time, note.duration * beatDuration, 0.12);
      }
      time += note.duration * beatDuration;
    });

    // Play bass line
    time = currentTime;
    bass.forEach((note) => {
      if (note.note > 0) {
        this.playNote(note.note, time, note.duration * beatDuration, 0.08);
      }
      time += note.duration * beatDuration;
    });

    // Calculate total melody duration and schedule next loop
    const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0) * beatDuration;
    
    if (this.musicPlaying) {
      this.musicIntervalId = setTimeout(() => {
        this.playMelody();
      }, (totalDuration * 1000) - 100) as unknown as number; // Schedule next iteration slightly early
    }
  }

  playMusic(): void {
    if (!this.audioContext || !this.enabled || !this.musicEnabled || this.musicPlaying) return;
    
    this.ensureAudioContext();
    this.musicPlaying = true;
    this.playMelody();
    console.log('🎵 Playing 8-bit background music');
  }

  stopMusic(): void {
    this.musicPlaying = false;
    if (this.musicIntervalId !== null) {
      clearTimeout(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    console.log('🎵 Stopping background music');
  }

  pauseMusic(): void {
    this.musicPlaying = false;
    if (this.musicIntervalId !== null) {
      clearTimeout(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    console.log('🎵 Pausing background music');
  }

  resumeMusic(): void {
    if (!this.audioContext || !this.enabled || !this.musicEnabled) return;
    if (!this.musicPlaying) {
      this.playMusic();
    }
    console.log('🎵 Resuming background music');
  }
}

export const audioManager = new AudioManager();
