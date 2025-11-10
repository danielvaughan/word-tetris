import { useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useGameControls } from '../hooks/useGameControls';
import { useGameLoop } from '../hooks/useGameLoop';
import { GameCanvas } from './GameCanvas';
import { GameInfo } from './GameInfo';
import styles from './Game.module.css';

export function Game() {
  const playAreaRef = useRef<HTMLDivElement | null>(null);
  const {
    grid,
    currentBlock,
    currentPosition,
    nextBlocks,
    score,
    level,
    wordsFormed,
    highScore,
    isPaused,
    recentWords,
    animatingBlocks,
    lockDelayActive,
    pauseGame,
    resumeGame,
  } = useGameStore();
  
  useGameControls(playAreaRef);
  useGameLoop();
  
  return (
    <div className={styles.container}>
      <div className={styles.game}>
        <div ref={playAreaRef} className={styles.mainArea}>
          <GameCanvas
            grid={grid}
            currentBlock={currentBlock}
            currentPosition={currentPosition}
            isPaused={isPaused}
            animatingBlocks={animatingBlocks}
            lockDelayActive={lockDelayActive}
          />
        </div>
        
        <div className={styles.sidebar}>
          <GameInfo
            score={score}
            level={level}
            wordsFormed={wordsFormed}
            highScore={highScore}
            nextBlocks={nextBlocks}
            recentWords={recentWords}
          />
          
          <div className={styles.controls}>
            <button
              className={styles.pauseButton}
              onClick={isPaused ? resumeGame : pauseGame}
            >
              {isPaused ? 'Resume (P)' : 'Pause (P)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
