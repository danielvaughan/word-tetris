import { Block, ScoredWord } from '../types/game';
import { NextBlock } from './NextPiece';
import { audioManager } from '../utils/audio';
import styles from './GameInfo.module.css';
import { useState } from 'react';

interface GameInfoProps {
  score: number;
  level: number;
  wordsFormed: number;
  highScore: number;
  nextBlocks: Block[];
  recentWords: ScoredWord[];
}

export function GameInfo({
  score,
  level,
  wordsFormed,
  highScore,
  nextBlocks,
  recentWords,
}: GameInfoProps) {
  const [musicEnabled, setMusicEnabled] = useState(false);

  const toggleMusic = () => {
    const newState = !musicEnabled;
    setMusicEnabled(newState);
    audioManager.setMusicEnabled(newState);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.title}>Score</h3>
        <div className={styles.value}>{score.toLocaleString()}</div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.title}>High Score</h3>
        <div className={styles.value}>{highScore.toLocaleString()}</div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.title}>Level</h3>
        <div className={styles.value}>{level}</div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.title}>Words</h3>
        <div className={styles.value}>{wordsFormed}</div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.title}>Next</h3>
        <div className={styles.nextBlocks}>
          {nextBlocks.slice(0, 3).map((block, index) => (
            <div key={index} className={styles.preview}>
              <NextBlock block={block} size={18} />
            </div>
          ))}
        </div>
      </div>
      
      {recentWords.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.title}>Recent</h3>
          <div className={styles.recentWords}>
            {recentWords.map((word, index) => (
              <div key={index} className={styles.wordItem}>
                <span className={styles.word}>{word.word}</span>
                <span className={styles.wordScore}>+{word.finalScore}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.section}>
        <button 
          className={styles.musicToggle}
          onClick={toggleMusic}
          title={musicEnabled ? 'Music: On' : 'Music: Off'}
        >
          {musicEnabled ? '🔊 Music' : '🔇 Music'}
        </button>
      </div>
    </div>
  );
}
