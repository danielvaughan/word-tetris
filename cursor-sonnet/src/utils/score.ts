import {
  WORD_LENGTH_BONUS,
  COMBO_MULTIPLIERS,
  CHAIN_MULTIPLIERS,
  WORDS_PER_LEVEL,
  MAX_LEVEL,
  LINE_CLEAR_BASE_SCORE,
  LETTER_VALUES,
} from '../constants/game';
import { WordMatch, ScoredWord, Position, Grid } from '../types/game';
import { getPremiumSquareDetails } from '../constants/premiumSquares';

/**
 * Calculates the base score for a word (sum of letter values)
 * Simple version without premium squares
 */
export function calculateWordBaseScore(word: string): number {
  return word
    .split('')
    .reduce((sum, letter) => sum + (LETTER_VALUES[letter] || 0), 0);
}

/**
 * Calculates the base score for a word with premium square multipliers
 */
export function calculateWordScoreWithPremiumSquares(
  word: string,
  positions: Position[],
  grid: Grid
): { baseScore: number; wordMultiplier: number } {
  let totalLetterScore = 0;
  let wordMultiplier = 1;
  
  positions.forEach((pos, index) => {
    const letter = word[index];
    const letterValue = LETTER_VALUES[letter] || 0;
    const premiumSquare = getPremiumSquareDetails(pos.x, pos.y);
    
    // Check if there's already a block on this square (premium square is "used")
    const isOccupied = grid[pos.y][pos.x] !== null;
    
    // Apply premium square multipliers only if the square was empty before
    if (!isOccupied && premiumSquare.type) {
      if (premiumSquare.letterMultiplier) {
        // Apply letter multiplier (DLS or TLS)
        totalLetterScore += letterValue * premiumSquare.letterMultiplier;
      } else if (premiumSquare.wordMultiplier) {
        // Track word multiplier (DWS or TWS)
        wordMultiplier *= premiumSquare.wordMultiplier;
        totalLetterScore += letterValue;
      }
    } else {
      // No premium square or already occupied
      totalLetterScore += letterValue;
    }
  });
  
  return {
    baseScore: totalLetterScore * wordMultiplier,
    wordMultiplier,
  };
}

/**
 * Calculates the final score for a word with all bonuses
 */
export function calculateWordScore(
  wordMatch: WordMatch,
  level: number,
  comboCount: number = 1,
  chainLevel: number = 0
): ScoredWord {
  const baseScore = wordMatch.score;
  const wordLength = wordMatch.word.length;
  
  // Length bonus
  const lengthBonus = WORD_LENGTH_BONUS[wordLength] || 
    (wordLength > 10 ? 4.5 + (wordLength - 10) * 0.5 : 1);
  
  // Combo multiplier
  const comboMultiplier = COMBO_MULTIPLIERS[Math.min(comboCount, COMBO_MULTIPLIERS.length - 1)];
  
  // Chain multiplier
  const chainMultiplier = CHAIN_MULTIPLIERS[Math.min(chainLevel, CHAIN_MULTIPLIERS.length - 1)];
  
  // Calculate final score
  const finalScore = Math.floor(
    baseScore * lengthBonus * level * comboMultiplier * chainMultiplier
  );
  
  return {
    ...wordMatch,
    finalScore,
    lengthBonus,
    levelMultiplier: level,
    comboMultiplier: comboCount > 1 ? comboMultiplier : undefined,
    chainMultiplier: chainLevel > 0 ? chainMultiplier : undefined,
  };
}

/**
 * Calculates score for line clears
 */
export function calculateLineScore(linesCleared: number, level: number): number {
  if (linesCleared === 0) return 0;
  if (linesCleared === 1) return LINE_CLEAR_BASE_SCORE * level;
  return LINE_CLEAR_BASE_SCORE * 2 * level * linesCleared;
}

/**
 * Calculates the level based on words formed
 */
export function calculateLevel(wordsFormed: number): number {
  return Math.min(Math.floor(wordsFormed / WORDS_PER_LEVEL) + 1, MAX_LEVEL);
}

/**
 * Calculates fall speed based on level
 */
export function calculateFallSpeed(level: number): number {
  const baseSpeed = 1000;
  const speedDecrease = 50;
  const minSpeed = 100;
  
  return Math.max(baseSpeed - (level - 1) * speedDecrease, minSpeed);
}
