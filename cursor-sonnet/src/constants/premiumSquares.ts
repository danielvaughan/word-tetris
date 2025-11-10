/**
 * Premium squares configuration (Scrabble-style multipliers)
 */

export type PremiumSquareType = 'DLS' | 'TLS' | 'DWS' | 'TWS' | null;

export interface PremiumSquare {
  type: PremiumSquareType;
  color: string;
  label: string;
  letterMultiplier?: number;
  wordMultiplier?: number;
}

// Premium square colors from specification
export const PREMIUM_SQUARE_COLORS = {
  DLS: '#4ecdc4', // Double Letter Score - Light Blue
  TLS: '#0891b2', // Triple Letter Score - Dark Blue
  DWS: '#f09bb9', // Double Word Score - Light Pink
  TWS: '#e94560', // Triple Word Score - Red
};

// Premium square definitions
export const PREMIUM_SQUARES: Record<string, PremiumSquare> = {
  DLS: {
    type: 'DLS',
    color: PREMIUM_SQUARE_COLORS.DLS,
    label: 'DL',
    letterMultiplier: 2,
  },
  TLS: {
    type: 'TLS',
    color: PREMIUM_SQUARE_COLORS.TLS,
    label: 'TL',
    letterMultiplier: 3,
  },
  DWS: {
    type: 'DWS',
    color: PREMIUM_SQUARE_COLORS.DWS,
    label: 'DW',
    wordMultiplier: 2,
  },
  TWS: {
    type: 'TWS',
    color: PREMIUM_SQUARE_COLORS.TWS,
    label: 'TW',
    wordMultiplier: 3,
  },
};

// Default empty premium square
export const EMPTY_PREMIUM_SQUARE: PremiumSquare = {
  type: null,
  color: '',
  label: '',
};

/**
 * Premium square layout for the game board (10x10 grid)
 * Positions are [row, column] pairs
 * ~4% of squares are premium (4 out of 100 squares)
 * More random and sparse distribution
 */
export const PREMIUM_SQUARE_LAYOUT: Map<string, PremiumSquareType> = new Map([
  // Double Letter Score (Light Blue) - 2 positions
  ['3,2', 'DLS'],
  ['7,6', 'DLS'],

  // Triple Letter Score (Dark Blue) - 1 position
  ['5,8', 'TLS'],

  // Double Word Score (Light Pink) - 1 position
  ['8,4', 'DWS'],

  // Triple Word Score (Red) - 0 positions (can be added for harder levels)
  // ['9,9', 'TWS'],
]);

/**
 * Get premium square type at a given position
 */
export function getPremiumSquare(x: number, y: number): PremiumSquareType {
  const key = `${y},${x}`;
  return PREMIUM_SQUARE_LAYOUT.get(key) || null;
}

/**
 * Check if a position has a premium square
 */
export function hasPremiumSquare(x: number, y: number): boolean {
  return getPremiumSquare(x, y) !== null;
}

/**
 * Get premium square details at a position
 */
export function getPremiumSquareDetails(x: number, y: number): PremiumSquare {
  const type = getPremiumSquare(x, y);
  if (type === null) {
    return EMPTY_PREMIUM_SQUARE;
  }
  return PREMIUM_SQUARES[type];
}

