import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { ensureDictionaryLoaded } from './data/dictionary';
import { Menu } from './components/Menu';
import { Game } from './components/Game';
import { GameOver } from './components/GameOver';
import './App.css';

function App() {
  const { isPlaying, isGameOver, score, level, wordsFormed, highScore, startGame, resetGame } =
    useGameStore();
  const [showMenu, setShowMenu] = useState(true);
  const [previousHighScore, setPreviousHighScore] = useState(highScore);
  const [dictionaryLoading, setDictionaryLoading] = useState(true);
  
  // Load dictionary on app start
  useEffect(() => {
    ensureDictionaryLoaded()
      .then(() => {
        console.log('✅ Dictionary loaded and ready');
        setDictionaryLoading(false);
      })
      .catch(error => {
        console.error('❌ Failed to load dictionary:', error);
        setDictionaryLoading(false);
      });
  }, []);
  
  useEffect(() => {
    if (isPlaying) {
      setShowMenu(false);
    }
  }, [isPlaying]);
  
  const handleStart = () => {
    if (dictionaryLoading) {
      console.warn('Dictionary still loading, please wait...');
      return;
    }
    startGame();
    setPreviousHighScore(highScore);
    setShowMenu(false);
  };
  
  const handleRestart = () => {
    resetGame();
    setPreviousHighScore(highScore);
  };
  
  const handleMenu = () => {
    setShowMenu(true);
  };
  
  if (showMenu) {
    return (
      <Menu
        onStart={handleStart}
        highScore={highScore}
        dictionaryLoading={dictionaryLoading}
      />
    );
  }
  
  return (
    <>
      <Game />
      {isGameOver && (
        <GameOver
          score={score}
          level={level}
          wordsFormed={wordsFormed}
          highScore={highScore}
          isNewHighScore={score > previousHighScore}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}
    </>
  );
}

export default App;
