# Changelog

## Version 2.0.0 - Scrabble Edition (Current)

Complete rewrite to follow updated SPECIFICATION.md with Scrabble mechanics.

### Major Changes

#### Game Mechanics
- 🔄 **Changed from tetrominos to single letter blocks**
  - Removed all tetromino shapes (I, O, T, S, Z, J, L)
  - Simplified to single blocks with one letter each
  - Removed rotation mechanics entirely
  
- 🎯 **Scrabble-based scoring system**
  - Letter values: 1-10 points (E=1, Q=10, Z=10, etc.)
  - Word score = sum of letter values
  - Length bonuses (3 letters = 1x, 7+ letters = 3x+)
  - Level multipliers
  - Combo multipliers (multiple words at once)
  - Chain multipliers (cascade reactions)

- 📊 **Scrabble tile distribution**
  - 98 total tiles following Scrabble distribution
  - E appears 12 times (most common)
  - Q, Z appear once each (rare and valuable)
  - Weighted random selection

#### Scoring Changes
- ✨ **Word formation is primary scoring**
  - Base score from letter values
  - Length bonus multipliers (1x to 4.5x+)
  - Level multiplier applied
  - Combo bonus for multiple words
  - Chain bonus for cascade reactions
  
- 💫 **Line clears are now secondary**
  - Bonus points only (25-100 × level)
  - No longer primary scoring mechanism

#### Progression Changes
- 📈 **Level based on words formed** (not lines cleared)
  - Level up every 10 words formed
  - Maximum level increased to 20 (from 15)
  - Fall speed increases with level

#### Visual Changes
- 🎨 **Color coding by point value**
  - Blue: 1-point letters
  - Green: 2-3 points
  - Orange: 4-5 points
  - Gold/Red: 8-10 points
  
- 📝 **Point values displayed on blocks**
  - Letter shown large and centered
  - Point value in top-right corner
  
- 📋 **Recent words display**
  - Shows last 5 words formed
  - Displays final score for each word
  - Includes combo and chain indicators

#### Control Changes
- ⌨️ **Simplified keyboard controls**
  - Removed: Z, X, Up, C (rotation and hold)
  - Kept: Arrow keys, Space, P, Escape
  - Only movement and drop controls needed

#### UI Changes
- 📊 **Stats updated**
  - Replaced "Lines Cleared" with "Words Formed"
  - Shows current chain level
  - Next 5 blocks preview (instead of 3)
  - Recent words with scores
  
- 🎯 **Menu improvements**
  - Added "How to Play" section
  - Explained Scrabble scoring
  - Simplified controls list

### Technical Changes

#### Code Structure
- 🗑️ **Removed files:**
  - `utils/tetromino.ts` (no longer needed)
  
- ➕ **Added files:**
  - `utils/letters.ts` (Scrabble letter generation)
  
- ✏️ **Modified files:**
  - `constants/game.ts` - Scrabble values and distribution
  - `types/game.ts` - Single block types, removed tetromino types
  - `utils/collision.ts` - Simplified for single blocks
  - `utils/grid.ts` - Updated for single blocks
  - `utils/score.ts` - Complete Scrabble scoring rewrite
  - `utils/words.ts` - Chain reaction support
  - `store/gameStore.ts` - New game logic with chains
  - `components/GameCanvas.tsx` - Single block rendering
  - `components/NextPiece.tsx` - Renamed to NextBlock
  - `components/GameInfo.tsx` - Recent words display
  - `hooks/useGameControls.ts` - Removed rotation controls
  - All component styles updated

#### New Features
- ✅ Chain reaction system
- ✅ Combo detection
- ✅ Recent words tracking
- ✅ Scrabble letter distribution
- ✅ Multi-level scoring calculation
- ✅ Color-coded blocks by value

### Performance
- ⚡ Simplified collision detection (single blocks vs tetrominos)
- ⚡ Faster rendering (fewer blocks to draw)
- ⚡ More efficient word finding with chain detection

---

## Version 1.0.0 - Tetromino Edition (Previous)

Original implementation with tetrominos.

### Features
- Classic Tetris with 7 tetromino shapes
- Letters on each block of tetromino
- Word formation (horizontal and vertical)
- Basic scoring (line clears + word bonuses)
- 15 levels
- Hold piece functionality
- Ghost piece indicator
- Next 3 pieces preview
- Rotation controls

### Tech Stack
- React 18.2+
- TypeScript 5.3+
- Vite 5.0+
- Zustand 4.4+
- HTML5 Canvas

---

## Migration Guide (1.0 → 2.0)

If you have saved games from v1.0, they are **not compatible** with v2.0 due to fundamental game mechanic changes.

**What's Different:**
1. No more tetrominos - single blocks only
2. Scrabble scoring instead of simple line clearing
3. Words are primary scoring (not lines)
4. No rotation or hold piece
5. Different progression (words vs lines)

**Recommendation:** Start fresh in v2.0 and enjoy the new Scrabble-inspired gameplay!

