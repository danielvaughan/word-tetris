import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { calculateFallSpeed } from '../utils/score';

/**
 * Custom hook for the game loop
 */
export function useGameLoop() {
  const { isPlaying, isPaused, level, tick } = useGameStore();
  const lastTickRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  
  useEffect(() => {
    if (!isPlaying || isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }
    
    const fallSpeed = calculateFallSpeed(level);
    
    const gameLoop = (timestamp: number) => {
      if (!lastTickRef.current) {
        lastTickRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastTickRef.current;
      
      if (elapsed >= fallSpeed) {
        tick();
        lastTickRef.current = timestamp;
      }
      
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isPaused, level, tick]);
}

