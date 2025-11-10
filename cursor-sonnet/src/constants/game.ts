export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 10;

export const BLOCK_SIZE = 30;

export const INITIAL_FALL_SPEED = 500; // ms (faster starting speed)
export const MIN_FALL_SPEED = 100; // ms
export const FALL_SPEED_DECREASE = 30; // ms per level

export const LOCK_DELAY = 500; // ms

// Scrabble letter point values
export const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};

// Scrabble tile distribution (number of tiles for each letter)
export const LETTER_DISTRIBUTION: Record<string, number> = {
  A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9, J: 1,
  K: 1, L: 4, M: 2, N: 6, O: 8, P: 2, Q: 1, R: 6, S: 4, T: 6,
  U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1,
};

// Color coding based on point values
export const LETTER_COLORS: Record<number, string> = {
  1: '#4ecdc4',  // Light blue - 1 point letters
  2: '#45b7d1',  // Cyan - 2 points
  3: '#96ceb4',  // Green - 3 points
  4: '#ffa351',  // Orange - 4 points
  5: '#ff8b94',  // Pink - 5 points
  8: '#ffd93d',  // Gold - 8 points
  10: '#ff6b6b', // Red - 10 points (rare!)
};

// Word length bonus multipliers
export const WORD_LENGTH_BONUS: Record<number, number> = {
  3: 1.0,
  4: 1.5,
  5: 2.0,
  6: 2.5,
  7: 3.0,
  8: 3.5,
  9: 4.0,
  10: 4.5,
};

// Combo multipliers (multiple words at once)
export const COMBO_MULTIPLIERS = [1, 1, 1.5, 2.0, 2.5];

// Chain multipliers (cascade words)
export const CHAIN_MULTIPLIERS = [1, 1.5, 2.0, 2.5];

export const WORDS_PER_LEVEL = 10;
export const MAX_LEVEL = 20;

export const LINE_CLEAR_BASE_SCORE = 25;
