import { GameSettings } from '../types/game';

const HIGH_SCORE_KEY = 'wordTetris_highScore';
const SETTINGS_KEY = 'wordTetris_settings';

/**
 * Loads high score from localStorage
 */
export function loadHighScore(): number {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.error('Failed to load high score:', error);
    return 0;
  }
}

/**
 * Saves high score to localStorage
 */
export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.error('Failed to save high score:', error);
  }
}

/**
 * Loads game settings from localStorage
 */
export function loadSettings(): GameSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  
  return {
    soundEnabled: true,
    musicEnabled: true,
    volume: 0.7,
  };
}

/**
 * Saves game settings to localStorage
 */
export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

