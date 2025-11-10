import { Grid, Block, Position } from '../types/game';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/game';

/**
 * Creates an empty grid
 */
export function createEmptyGrid(): Grid {
  return Array(GRID_HEIGHT)
    .fill(null)
    .map(() => Array(GRID_WIDTH).fill(null));
}

/**
 * Locks a block into the grid at a specific position
 */
export function lockBlockToGrid(block: Block, position: Position, grid: Grid): Grid {
  const newGrid = grid.map((row) => [...row]);
  
  if (position.y >= 0 && position.y < GRID_HEIGHT) {
    newGrid[position.y][position.x] = {
      letter: block.letter,
      value: block.value,
      color: block.color,
    };
  }
  
  return newGrid;
}

/**
 * Clears completed lines from the grid
 * Returns the new grid and the number of lines cleared
 */
export function clearLines(grid: Grid): { grid: Grid; linesCleared: number } {
  const newGrid: Grid = [];
  let linesCleared = 0;
  
  for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
    const isLineFull = grid[y].every((cell) => cell !== null);
    
    if (!isLineFull) {
      newGrid.unshift(grid[y]);
    } else {
      linesCleared++;
    }
  }
  
  // Add empty lines at the top
  while (newGrid.length < GRID_HEIGHT) {
    newGrid.unshift(Array(GRID_WIDTH).fill(null));
  }
  
  return { grid: newGrid, linesCleared };
}

/**
 * Checks if the game is over (blocks at the top)
 */
export function isGameOver(grid: Grid): boolean {
  // Check if any cell in the top two rows is filled
  return grid[0].some((cell) => cell !== null) || grid[1].some((cell) => cell !== null);
}
