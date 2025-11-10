import { Grid, Position, WordMatch } from '../types/game';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/game';
import { isValidWord } from '../data/dictionary';
import { calculateWordBaseScore, calculateWordScoreWithPremiumSquares } from './score';

/**
 * Finds all valid words in the grid
 * @param grid - The game grid
 * @param gridBeforeLock - Optional: the grid state before the last block was locked (for premium square calculation)
 */
export function findWords(grid: Grid, gridBeforeLock?: Grid): WordMatch[] {
  const words: WordMatch[] = [];
  
  // Check horizontal words
  for (let y = 0; y < GRID_HEIGHT; y++) {
    let currentWord = '';
    let startX = 0;
    
    for (let x = 0; x <= GRID_WIDTH; x++) {
      const cell = x < GRID_WIDTH ? grid[y][x] : null;
      
      if (cell !== null) {
        if (currentWord === '') {
          startX = x;
        }
        currentWord += cell.letter;
      } else {
        if (currentWord.length >= 3 && isValidWord(currentWord)) {
          const positions: Position[] = [];
          for (let i = 0; i < currentWord.length; i++) {
            positions.push({ x: startX + i, y });
          }
          
          // Calculate score with premium squares if we have the before-lock grid
          let score: number;
          if (gridBeforeLock) {
            const result = calculateWordScoreWithPremiumSquares(currentWord, positions, gridBeforeLock);
            score = result.baseScore;
          } else {
            score = calculateWordBaseScore(currentWord);
          }
          
          words.push({
            word: currentWord,
            positions,
            direction: 'horizontal',
            score,
          });
        }
        currentWord = '';
      }
    }
  }
  
  // Check vertical words
  for (let x = 0; x < GRID_WIDTH; x++) {
    let currentWord = '';
    let startY = 0;
    
    for (let y = 0; y <= GRID_HEIGHT; y++) {
      const cell = y < GRID_HEIGHT ? grid[y][x] : null;
      
      if (cell !== null) {
        if (currentWord === '') {
          startY = y;
        }
        currentWord += cell.letter;
      } else {
        if (currentWord.length >= 3 && isValidWord(currentWord)) {
          const positions: Position[] = [];
          for (let i = 0; i < currentWord.length; i++) {
            positions.push({ x, y: startY + i });
          }
          
          // Calculate score with premium squares if we have the before-lock grid
          let score: number;
          if (gridBeforeLock) {
            const result = calculateWordScoreWithPremiumSquares(currentWord, positions, gridBeforeLock);
            score = result.baseScore;
          } else {
            score = calculateWordBaseScore(currentWord);
          }
          
          words.push({
            word: currentWord,
            positions,
            direction: 'vertical',
            score,
          });
        }
        currentWord = '';
      }
    }
  }
  
  return words;
}

/**
 * Finds the highest scoring word from a list of words
 * Considers base score and length bonus
 */
export function findHighestScoringWord(
  words: WordMatch[],
  level: number
): WordMatch | null {
  if (words.length === 0) return null;
  
  // Calculate effective score for each word (base × length bonus × level)
  let highestWord = words[0];
  let highestEffectiveScore = calculateEffectiveScore(words[0], level);
  
  for (let i = 1; i < words.length; i++) {
    const effectiveScore = calculateEffectiveScore(words[i], level);
    if (effectiveScore > highestEffectiveScore) {
      highestWord = words[i];
      highestEffectiveScore = effectiveScore;
    }
  }
  
  return highestWord;
}

function calculateEffectiveScore(word: WordMatch, level: number): number {
  const lengthBonus = getLengthBonus(word.word.length);
  return word.score * lengthBonus * level;
}

function getLengthBonus(length: number): number {
  const bonuses: Record<number, number> = {
    3: 1.0,
    4: 1.5,
    5: 2.0,
    6: 2.5,
    7: 3.0,
    8: 3.5,
    9: 4.0,
    10: 4.5,
  };
  return bonuses[length] || (length > 10 ? 4.5 + (length - 10) * 0.5 : 1);
}

/**
 * Removes a specific word's blocks from the grid
 */
export function removeWordBlocks(grid: Grid, word: WordMatch): Grid {
  const newGrid = grid.map((row) => [...row]);
  
  word.positions.forEach((pos) => {
    newGrid[pos.y][pos.x] = null;
  });
  
  // Apply gravity - make blocks fall down
  return applyGravity(newGrid);
}

/**
 * Applies gravity to floating blocks
 */
export function applyGravity(grid: Grid): Grid {
  const newGrid: Grid = Array(GRID_HEIGHT)
    .fill(null)
    .map(() => Array(GRID_WIDTH).fill(null));
  
  // Process each column from bottom to top
  for (let x = 0; x < GRID_WIDTH; x++) {
    let writeY = GRID_HEIGHT - 1;
    
    // Collect all non-null cells in this column from bottom to top
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      if (grid[y][x] !== null) {
        newGrid[writeY][x] = grid[y][x];
        writeY--;
      }
    }
  }
  
  return newGrid;
}
