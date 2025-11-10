import { Grid, Position } from '../types/game';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/game';

/**
 * Checks if a position is valid on the grid
 */
export function isValidPosition(position: Position): boolean {
  return (
    position.x >= 0 &&
    position.x < GRID_WIDTH &&
    position.y >= 0 &&
    position.y < GRID_HEIGHT
  );
}

/**
 * Checks if a block can be placed at a position
 */
export function canPlaceBlock(position: Position, grid: Grid): boolean {
  // Check boundaries
  if (
    position.x < 0 ||
    position.x >= GRID_WIDTH ||
    position.y >= GRID_HEIGHT
  ) {
    return false;
  }
  
  // Allow blocks to spawn above grid
  if (position.y < 0) {
    return true;
  }
  
  // Check if position is occupied
  return grid[position.y][position.x] === null;
}

/**
 * Gets the lowest valid position for a block (hard drop position)
 */
export function getDropPosition(startPosition: Position, grid: Grid): Position {
  let dropY = startPosition.y;
  
  while (canPlaceBlock({ x: startPosition.x, y: dropY + 1 }, grid)) {
    dropY++;
  }
  
  return { x: startPosition.x, y: dropY };
}
