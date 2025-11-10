import { audioManager } from '../utils/audio';
import styles from './Menu.module.css';

interface MenuProps {
  onStart: () => void;
  highScore: number;
  dictionaryLoading?: boolean;
}

export function Menu({ onStart, highScore, dictionaryLoading = false }: MenuProps) {
  const handleStart = () => {
    if (dictionaryLoading) return;
    audioManager.play('menuClick');
    onStart();
  };
  
  const handleMouseEnter = () => {
    audioManager.play('menuHover', 0.3);
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Word Tetris</h1>
      <p className={styles.subtitle}>Form words with falling letters!</p>
      
      <div className={styles.highScore}>
        <span>High Score</span>
        <span className={styles.score}>{highScore.toLocaleString()}</span>
      </div>
      
      {dictionaryLoading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading Scrabble Dictionary...</p>
          <p className={styles.loadingSubtext}>178,000+ words</p>
        </div>
      ) : (
        <button
          className={styles.playButton}
          onClick={handleStart}
          onMouseEnter={handleMouseEnter}
        >
          Play Game
        </button>
      )}
      
      <div className={styles.controls}>
        <h3>Controls</h3>
        <div className={styles.controlList}>
          <div className={styles.controlItem}>
            <span className={styles.key}>← →</span>
            <span>Move Block</span>
          </div>
          <div className={styles.controlItem}>
            <span className={styles.key}>↓</span>
            <span>Soft Drop</span>
          </div>
          <div className={styles.controlItem}>
            <span className={styles.key}>Space</span>
            <span>Hard Drop</span>
          </div>
          <div className={styles.controlItem}>
            <span className={styles.key}>P / Esc</span>
            <span>Pause</span>
          </div>
        </div>
      </div>
      
      <div className={styles.howToPlay}>
        <h3>How to Play</h3>
        <ul>
          <li>Single letter blocks fall from the top</li>
          <li>Position them to form words (3+ letters)</li>
          <li>Words can be horizontal or vertical</li>
          <li>Scoring follows Scrabble letter values</li>
          <li><strong>Only the highest scoring word is scored each turn</strong></li>
          <li>After scoring, word letters disappear and blocks fall</li>
          <li>Chain reactions form new words for bonus multipliers!</li>
          <li>Rare letters (Q, Z, X, J) are worth more!</li>
          <li>Form longer words for bigger bonuses</li>
          <li>Level up every 10 words formed</li>
        </ul>
      </div>
    </div>
  );
}
