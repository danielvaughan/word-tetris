import { create } from 'zustand';
import { GameState, ScoredWord, GameSettings } from '../types/game';
import { createEmptyGrid, lockBlockToGrid, clearLines, isGameOver } from '../utils/grid';
import { createBlock } from '../utils/letters';
import { canPlaceBlock } from '../utils/collision';
import { findWords, findHighestScoringWord, removeWordBlocks } from '../utils/words';
import { calculateLevel, calculateLineScore, calculateWordScore } from '../utils/score';
import { loadHighScore, saveHighScore, loadSettings, saveSettings } from '../utils/storage';
import { audioManager } from '../utils/audio';
import { LETTER_VALUES } from '../constants/game';

interface GameStore extends GameState {
  settings: GameSettings;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  resetGame: () => void;
  
  moveBlock: (dx: number) => boolean;
  softDrop: () => void;
  hardDrop: () => number;
  
  tick: () => void;
  lockBlock: () => void;
  
  updateSettings: (settings: Partial<GameSettings>) => void;
}

const ANIMATION_DURATION = 450; // ms for flash and fade
const LOCK_DELAY = 500; // ms grace period before locking

const initialState: GameState = {
  grid: createEmptyGrid(),
  currentBlock: null,
  currentPosition: { x: 4, y: 0 },
  nextBlocks: [],
  score: 0,
  level: 1,
  wordsFormed: 0,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  highScore: loadHighScore(),
  recentWords: [],
  currentChain: 0,
  animatingBlocks: [],
  lockDelayActive: false,
  lockDelayTimer: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  settings: loadSettings(),
  
  startGame: () => {
    const nextBlocks = Array(5).fill(null).map(() => createBlock());
    const currentBlock = nextBlocks.shift()!;
    nextBlocks.push(createBlock());

    // Don't auto-start music - let user control it with toggle button

    set({
      ...initialState,
      currentBlock,
      currentPosition: { x: 4, y: 0 },
      nextBlocks,
      isPlaying: true,
      highScore: get().highScore,
    });
  },
  
  pauseGame: () => {
    audioManager.play('pause');
    audioManager.pauseMusic();
    set({ isPaused: true });
  },
  
  resumeGame: () => {
    audioManager.play('resume');
    audioManager.resumeMusic();
    set({ isPaused: false });
  },
  
  gameOver: () => {
    const { score, highScore } = get();
    
    audioManager.stopMusic();
    
    if (score > highScore) {
      audioManager.play('newHighScore');
      saveHighScore(score);
      set({ highScore: score });
    } else {
      audioManager.play('gameOver');
    }
    
    set({ isGameOver: true, isPlaying: false });
  },
  
  resetGame: () => {
    get().startGame();
  },
  
  moveBlock: (dx: number): boolean => {
    const { currentBlock, currentPosition, grid, isPaused, isPlaying, lockDelayTimer } = get();
    
    if (!isPlaying || isPaused || !currentBlock) return false;
    
    const newPosition = {
      x: currentPosition.x + dx,
      y: currentPosition.y,
    };
    
    if (canPlaceBlock(newPosition, grid)) {
      audioManager.play('move', 0.3);
      set({ currentPosition: newPosition });
      
      // Check if block can now fall further - cancel lock delay if so
      const canFallFurther = canPlaceBlock(
        { x: newPosition.x, y: newPosition.y + 1 },
        grid
      );
      
      if (canFallFurther && lockDelayTimer !== null) {
        // Cancel lock delay - block can fall again
        clearTimeout(lockDelayTimer);
        set({ lockDelayActive: false, lockDelayTimer: null });
      }
      
      return true;
    } else {
      audioManager.play('invalidAction', 0.2);
    }
    
    return false;
  },
  
  softDrop: () => {
    const { currentPosition, grid, lockDelayTimer } = get();
    const newPosition = { x: currentPosition.x, y: currentPosition.y + 1 };
    
    if (canPlaceBlock(newPosition, grid)) {
      audioManager.play('softDrop', 0.4);
      
      // Cancel lock delay if active
      if (lockDelayTimer !== null) {
        clearTimeout(lockDelayTimer);
        set({ lockDelayActive: false, lockDelayTimer: null });
      }
      
      set({
        currentPosition: newPosition,
        score: get().score + 1,
      });
    } else {
      // Start lock delay instead of immediate lock
      const { lockDelayActive } = get();
      if (!lockDelayActive) {
        const timer = setTimeout(() => {
          get().lockBlock();
          set({ lockDelayActive: false, lockDelayTimer: null });
        }, LOCK_DELAY) as unknown as number;
        
        set({ lockDelayActive: true, lockDelayTimer: timer });
      }
    }
  },
  
  hardDrop: (): number => {
    const { currentPosition, grid, lockDelayTimer } = get();
    
    // Cancel any active lock delay
    if (lockDelayTimer !== null) {
      clearTimeout(lockDelayTimer);
      set({ lockDelayActive: false, lockDelayTimer: null });
    }
    
    let dropDistance = 0;
    let newY = currentPosition.y;
    
    while (canPlaceBlock({ x: currentPosition.x, y: newY + 1 }, grid)) {
      newY++;
      dropDistance++;
    }
    
    audioManager.play('hardDrop', 0.7);
    
    set({
      currentPosition: { x: currentPosition.x, y: newY },
      score: get().score + dropDistance * 2,
    });
    
    // Lock immediately - no delay for hard drop
    get().lockBlock();
    return dropDistance;
  },
  
  tick: () => {
    const { isPlaying, isPaused, currentPosition, grid, lockDelayActive, lockDelayTimer } = get();
    
    if (!isPlaying || isPaused) return;
    
    const newPosition = { x: currentPosition.x, y: currentPosition.y + 1 };
    
    if (canPlaceBlock(newPosition, grid)) {
      set({ currentPosition: newPosition });
      
      // Cancel any active lock delay since block is falling
      if (lockDelayTimer !== null) {
        clearTimeout(lockDelayTimer);
        set({ lockDelayActive: false, lockDelayTimer: null });
      }
    } else {
      // Block can't move down - start lock delay if not already active
      if (!lockDelayActive) {
        const timer = setTimeout(() => {
          get().lockBlock();
          set({ lockDelayActive: false, lockDelayTimer: null });
        }, LOCK_DELAY) as unknown as number;
        
        set({ lockDelayActive: true, lockDelayTimer: timer });
      }
    }
  },
  
  lockBlock: () => {
    const { currentBlock, currentPosition, grid, nextBlocks, lockDelayTimer, level } = get();
    
    // Clear any active lock delay timer
    if (lockDelayTimer !== null) {
      clearTimeout(lockDelayTimer);
      set({ lockDelayActive: false, lockDelayTimer: null });
    }
    
    if (!currentBlock) return;
    
    // Play lock sound
    audioManager.play('lock', 0.5);
    
    // Check for rare letter placement
    const letterValue = LETTER_VALUES[currentBlock.letter];
    if (letterValue >= 8) {
      audioManager.play('rareLetterPlace', 0.8);
    }
    
    // Save grid state before locking (for premium square calculations)
    const gridBeforeLock = grid.map(row => [...row]);
    
    // Lock block to grid
    let newGrid = lockBlockToGrid(currentBlock, currentPosition, grid);
    
    // Check for game over
    if (isGameOver(newGrid)) {
      get().gameOver();
      return;
    }
    
    // Find all valid words first (pass gridBeforeLock for premium square calculation)
    const foundWords = findWords(newGrid, gridBeforeLock);
    
    if (foundWords.length === 0) {
      // No words found, just spawn next block
      const newCurrentBlock = nextBlocks[0];
      const newNextBlocks = [...nextBlocks.slice(1), createBlock()];
      
      set({
        grid: newGrid,
        currentBlock: newCurrentBlock,
        currentPosition: { x: 4, y: 0 },
        nextBlocks: newNextBlocks,
      });
      return;
    }
    
    // Find the highest scoring word
    const highestWord = findHighestScoringWord(foundWords, level);
    
    if (!highestWord) {
      // No valid word, spawn next block
      const newCurrentBlock = nextBlocks[0];
      const newNextBlocks = [...nextBlocks.slice(1), createBlock()];
      
      set({
        grid: newGrid,
        currentBlock: newCurrentBlock,
        currentPosition: { x: 4, y: 0 },
        nextBlocks: newNextBlocks,
      });
      return;
    }
    
    // Start animation for the word blocks
    const startTime = Date.now();
    const animatingBlocks = highestWord.positions.map(pos => ({
      position: pos,
      letter: newGrid[pos.y][pos.x]!.letter,
      value: newGrid[pos.y][pos.x]!.value,
      color: newGrid[pos.y][pos.x]!.color,
      startTime,
    }));
    
    // Play sound
    audioManager.playWordSound(highestWord.word.length);
    
    // Set animating state AND update grid with locked block
    set({ 
      grid: newGrid,
      animatingBlocks 
    });
    
    // After animation completes, process the removal
    setTimeout(() => {
      processWordRemoval(0);
    }, ANIMATION_DURATION);
    
    function processWordRemoval(chainLevel: number) {
      const state = get();
      let currentGrid = state.grid;
      let totalScore = state.score;
      let allWordsFound: ScoredWord[] = [...state.recentWords];
      
      // Find words again (in case of chain)
      const words = findWords(currentGrid);
      if (words.length === 0) {
        // No more words, finalize
        finalizeBlockLock(totalScore, allWordsFound, chainLevel);
        return;
      }
      
      const word = findHighestScoringWord(words, state.level);
      if (!word) {
        finalizeBlockLock(totalScore, allWordsFound, chainLevel);
        return;
      }
      
      // Calculate score
      const scoredWord = calculateWordScore(word, state.level, 1, chainLevel);
      totalScore += scoredWord.finalScore;
      allWordsFound = [scoredWord, ...allWordsFound].slice(0, 3);
      
      // Play chain sound if applicable
      if (chainLevel > 0) {
        audioManager.play('cascade', 0.6);
        audioManager.playChainSound(chainLevel);
      }
      
      audioManager.play('wordRemove', 0.5);
      
      // Remove blocks and apply gravity
      currentGrid = removeWordBlocks(currentGrid, word);
      
      // Update state
      set({
        grid: currentGrid,
        score: totalScore,
        recentWords: allWordsFound,
        animatingBlocks: [],
      });
      
      // Check for more words (chain reaction)
      const nextWords = findWords(currentGrid);
      if (nextWords.length > 0 && chainLevel < 10) {
        const nextWord = findHighestScoringWord(nextWords, state.level);
        if (nextWord) {
          // Start animation for next word
          const startTime = Date.now();
          const animatingBlocks = nextWord.positions.map(pos => ({
            position: pos,
            letter: currentGrid[pos.y][pos.x]!.letter,
            value: currentGrid[pos.y][pos.x]!.value,
            color: currentGrid[pos.y][pos.x]!.color,
            startTime,
          }));
          
          set({ animatingBlocks });
          
          // Continue chain after animation
          setTimeout(() => {
            processWordRemoval(chainLevel + 1);
          }, ANIMATION_DURATION);
          return;
        }
      }
      
      // No more chains, finalize
      finalizeBlockLock(totalScore, allWordsFound, chainLevel);
    }
    
    function finalizeBlockLock(totalScore: number, allWordsFound: ScoredWord[], chainLevel: number) {
      const state = get();
      const oldScore = state.score;
      
      // Check for score milestones
      audioManager.checkScoreMilestone(oldScore, totalScore);
      
      // Clear completed lines
      const { grid: clearedGrid, linesCleared } = clearLines(state.grid);
      if (linesCleared > 0) {
        audioManager.play('lineClear', 0.7);
        const newLevel = calculateLevel(state.wordsFormed + allWordsFound.length);
        totalScore += calculateLineScore(linesCleared, newLevel);
      }
      
      // Update level
      const newWordsFormed = state.wordsFormed + allWordsFound.length;
      const newLevel = calculateLevel(newWordsFormed);
      
      if (newLevel > state.level) {
        audioManager.play('levelUp', 1.0);
      }
      
      // Get next block
      const newCurrentBlock = state.nextBlocks[0];
      const newNextBlocks = [...state.nextBlocks.slice(1), createBlock()];
      
      set({
        grid: clearedGrid,
        currentBlock: newCurrentBlock,
        currentPosition: { x: 4, y: 0 },
        nextBlocks: newNextBlocks,
        score: totalScore,
        level: newLevel,
        wordsFormed: newWordsFormed,
        currentChain: chainLevel,
        animatingBlocks: [],
      });
    }
  },
  
  updateSettings: (newSettings: Partial<GameSettings>) => {
    const settings = { ...get().settings, ...newSettings };
    saveSettings(settings);
    
    // Update audio manager settings
    if (newSettings.soundEnabled !== undefined) {
      audioManager.setEnabled(newSettings.soundEnabled);
    }
    if (newSettings.volume !== undefined) {
      audioManager.setVolume(newSettings.volume);
    }
    if (newSettings.musicEnabled !== undefined) {
      audioManager.setMusicEnabled(newSettings.musicEnabled);
    }
    
    set({ settings });
  },
}));
