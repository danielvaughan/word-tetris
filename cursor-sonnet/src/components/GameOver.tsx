import { audioManager } from '../utils/audio';
import styles from './GameOver.module.css';

interface GameOverProps {
  score: number;
  level: number;
  wordsFormed: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOver({
  score,
  level,
  wordsFormed,
  highScore,
  isNewHighScore,
  onRestart,
  onMenu,
}: GameOverProps) {
  const handleRestart = () => {
    audioManager.play('menuClick');
    onRestart();
  };
  
  const handleMenu = () => {
    audioManager.play('menuClick');
    onMenu();
  };
  
  const handleMouseEnter = () => {
    audioManager.play('menuHover', 0.3);
  };
  
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Game Over</h1>
        
        {isNewHighScore && (
          <div className={styles.newHighScore}>
            🎉 New High Score! 🎉
          </div>
        )}
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>Final Score</span>
            <span className={styles.value}>{score.toLocaleString()}</span>
          </div>
          
          <div className={styles.stat}>
            <span className={styles.label}>High Score</span>
            <span className={styles.value}>{highScore.toLocaleString()}</span>
          </div>
          
          <div className={styles.stat}>
            <span className={styles.label}>Level Reached</span>
            <span className={styles.value}>{level}</span>
          </div>
          
          <div className={styles.stat}>
            <span className={styles.label}>Words Formed</span>
            <span className={styles.value}>{wordsFormed}</span>
          </div>
        </div>
        
        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={handleRestart}
            onMouseEnter={handleMouseEnter}
          >
            Play Again
          </button>
          <button
            className={`${styles.button} ${styles.secondary}`}
            onClick={handleMenu}
            onMouseEnter={handleMouseEnter}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
