export interface Position {
  x: number;
  y: number;
}

export interface Block {
  letter: string;
  value: number; // Scrabble point value
  color: string;
}

export interface Cell {
  letter: string;
  value: number;
  color: string;
}

export type Grid = (Cell | null)[][];

export interface WordMatch {
  word: string;
  positions: Position[];
  direction: 'horizontal' | 'vertical';
  score: number; // Base score (sum of letter values)
}

export interface ScoredWord extends WordMatch {
  finalScore: number; // Score after all bonuses
  lengthBonus: number;
  levelMultiplier: number;
  comboMultiplier?: number;
  chainMultiplier?: number;
}

export interface AnimatingBlock {
  position: Position;
  letter: string;
  value: number;
  color: string;
  startTime: number;
}

export interface GameState {
  grid: Grid;
  currentBlock: Block | null;
  currentPosition: Position;
  nextBlocks: Block[];
  score: number;
  level: number;
  wordsFormed: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  highScore: number;
  recentWords: ScoredWord[];
  currentChain: number;
  animatingBlocks: AnimatingBlock[];
  lockDelayActive: boolean;
  lockDelayTimer: number | null;
}

export type GameScreen = 'menu' | 'playing' | 'paused' | 'gameOver';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
}
