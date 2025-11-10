import { RefObject, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { GRID_WIDTH, BLOCK_SIZE } from '../constants/game';

/**
 * Custom hook for handling keyboard controls
 */
export function useGameControls(playAreaRef?: RefObject<HTMLElement | null>) {
  const {
    isPlaying,
    isPaused,
    moveBlock,
    hardDrop,
    softDrop,
    pauseGame,
    resumeGame,
  } = useGameStore();
  const getState = useGameStore.getState;
  const playAreaElement = playAreaRef?.current ?? null;

  useEffect(() => {
    if (!isPlaying) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }
      
      // Pause/Resume
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (isPaused) {
          resumeGame();
        } else {
          pauseGame();
        }
        return;
      }
      
      if (isPaused) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          moveBlock(-1);
          break;
        case 'ArrowRight':
          moveBlock(1);
          break;
        case 'ArrowDown':
          softDrop();
          break;
        case ' ':
          hardDrop();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, moveBlock, hardDrop, softDrop, pauseGame, resumeGame]);

  useEffect(() => {
    if (!isPlaying || !playAreaElement) return;

    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const SWIPE_THRESHOLD = 30;
    const TAP_MOVEMENT_THRESHOLD = 10;
    const TAP_TIME_THRESHOLD = 300;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (event: TouchEvent) => {
      if (!isPlaying || isPaused) return;
      if (event.touches.length !== 1) return;

      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = event.timeStamp;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isPlaying || isPaused) return;
      if (event.touches.length !== 1) return;

      const touch = event.touches[0];
      const deltaY = Math.abs(touch.clientY - touchStartY);
      if (deltaY > SWIPE_THRESHOLD) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!isPlaying || isPaused) return;
      if (event.changedTouches.length !== 1) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const elapsed = event.timeStamp - touchStartTime;

      // Horizontal swipe
      if (absX > SWIPE_THRESHOLD && absX > absY) {
        event.preventDefault();
        moveBlock(deltaX > 0 ? 1 : -1);
        return;
      }

      // Downward swipe for soft drop
      if (deltaY > SWIPE_THRESHOLD && absY > absX) {
        event.preventDefault();
        softDrop();
        return;
      }

      // Tap for hard drop at column
      if (absX <= TAP_MOVEMENT_THRESHOLD && absY <= TAP_MOVEMENT_THRESHOLD && elapsed <= TAP_TIME_THRESHOLD) {
        const rect = canvas.getBoundingClientRect();
        if (touch.clientY < rect.top || touch.clientY > rect.bottom) {
          return;
        }

        const relativeX = touch.clientX - rect.left;
        if (relativeX < 0 || relativeX > rect.width) {
          return;
        }

        event.preventDefault();
        const desiredColumn = Math.max(0, Math.min(GRID_WIDTH - 1, Math.floor(relativeX / BLOCK_SIZE)));
        const { currentPosition } = getState();
        const difference = desiredColumn - currentPosition.x;

        if (difference !== 0) {
          const direction = difference > 0 ? 1 : -1;
          let stepsRemaining = Math.abs(difference);

          while (stepsRemaining > 0) {
            const moved = moveBlock(direction);
            if (!moved) {
              break;
            }
            stepsRemaining -= 1;
          }
        }

        if (getState().currentPosition.x === desiredColumn) {
          hardDrop();
        }
      }
    };

    const handleTouchCancel = () => {
      touchStartX = 0;
      touchStartY = 0;
      touchStartTime = 0;
    };

    playAreaElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    playAreaElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    playAreaElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    playAreaElement.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    return () => {
      playAreaElement.removeEventListener('touchstart', handleTouchStart);
      playAreaElement.removeEventListener('touchmove', handleTouchMove);
      playAreaElement.removeEventListener('touchend', handleTouchEnd);
      playAreaElement.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [isPlaying, isPaused, moveBlock, softDrop, hardDrop, playAreaElement, getState]);
}
