import { Block } from '../types/game';
import { LETTER_VALUES, LETTER_DISTRIBUTION, LETTER_COLORS } from '../constants/game';

/**
 * Gets a random letter based on Scrabble tile distribution
 */
export function getRandomLetter(): string {
  const letters = Object.keys(LETTER_DISTRIBUTION);
  const weights = Object.values(LETTER_DISTRIBUTION);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < letters.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return letters[i];
    }
  }
  
  return 'E'; // Fallback to most common letter
}

/**
 * Creates a new block with a random letter
 */
export function createBlock(): Block {
  const letter = getRandomLetter();
  const value = LETTER_VALUES[letter];
  const color = LETTER_COLORS[value] || LETTER_COLORS[1];
  
  return {
    letter,
    value,
    color,
  };
}

/**
 * Gets the color for a letter based on its point value
 */
export function getColorForValue(value: number): string {
  return LETTER_COLORS[value] || LETTER_COLORS[1];
}

