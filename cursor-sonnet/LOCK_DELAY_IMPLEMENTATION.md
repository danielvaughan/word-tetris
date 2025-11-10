# Lock Delay Implementation

## Overview

Lock delay is a grace period mechanic that activates when a falling block touches the ground or another block, giving players 500ms to make last-second positioning adjustments before the block permanently locks in place.

## SPECIFICATION.md Compliance

This implementation follows the detailed requirements specified in SPECIFICATION.md (Block Movement section).

### Core Mechanics

**Timer Activation:**
- When a block can no longer move down (collision detected), a 500ms timer starts
- During this window, the block remains in its current position
- Players can still move the block left or right

**Timer Cancellation:**
- If the block is moved such that it can fall further, the lock delay is cancelled
- Normal falling resumes immediately
- This allows for advanced techniques like sliding under overhangs

**Lock Completion:**
- After 500ms expires, the block locks permanently to the grid
- Word detection and scoring begins

## Implementation Details

### State Management (`gameStore.ts`)

```typescript
interface GameState {
  // ... other properties
  lockDelayActive: boolean;
  lockDelayTimer: number | null;
}
```

**Key Functions Modified:**

1. **`tick()`** - Game loop
   - Detects when block can't move down
   - Starts lock delay timer if not already active
   - Cancels timer if block can fall again

2. **`moveBlock(dx)`** - Horizontal movement
   - Allows movement during lock delay
   - Cancels lock delay if block can now fall further

3. **`softDrop()`** - Accelerated descent
   - Cancels lock delay if block continues falling
   - Starts lock delay if block hits bottom

4. **`hardDrop()`** - Instant drop
   - Cancels any active lock delay
   - Locks immediately (no delay for hard drop)

5. **`lockBlock()`** - Permanent placement
   - Clears lock delay timer
   - Resets lock delay state

### Visual Feedback (`GameCanvas.tsx`)

**Pulsing Glow Effect:**
- Subtle golden glow around tile during lock delay
- Brightness pulses from 1.0 to 1.3 using sine wave
- Glow intensity: `rgba(255, 200, 100, 0.6)`
- Glow blur: 8-10px based on pulse phase

**Enhanced Tile Appearance:**
- Slightly brighter background colors
- Thicker border (2px vs 1.5px)
- Stronger highlight on top-left
- More prominent depth effects

**Animation Loop:**
- `requestAnimationFrame` continuously updates during lock delay
- Pulse phase advances by 0.1 radians per frame
- Smooth, continuous animation at 60 FPS

### Visual Implementation Code

```typescript
// Drawing function with pulsing effect
function drawScrabbleTileWithGlow(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  letter: string, value: number,
  brightness: number
) {
  // Add subtle glow
  ctx.shadowColor = 'rgba(255, 200, 100, 0.6)';
  ctx.shadowBlur = 8 * brightness;
  
  // Adjust colors for brightness
  const color1 = adjustBrightness('#f5e6d3', brightness);
  const color2 = adjustBrightness('#e8d4b8', brightness);
  
  // ... rest of drawing code
}
```

## Player Experience

### Visual Cues

**When Lock Delay Activates:**
1. Block lands on surface
2. Tile begins pulsing with golden glow
3. Glow brightness oscillates smoothly
4. Border becomes slightly more prominent

**During Lock Delay:**
- Player can see they have time to adjust
- Visual feedback is subtle but noticeable
- Doesn't distract from gameplay
- Maintains Scrabble aesthetic

**When Lock Delay Expires:**
- Glow disappears
- Block locks with satisfying click sound
- Word detection begins

### Gameplay Benefits

**Strategic Advantages:**
- Slide blocks into tight spaces after landing
- Correct last-second misplacements
- Set up complex word formations
- Reduced frustration from imprecise drops

**Example Scenario:**
```
Before:           During Lock Delay:      After Lock:
  [T]                                     
   |                    [T]                  
C A E            →  C A T E         →    C A T E
─────                ─────                ─────
Block lands          Player slides         "CAT" formed!
on C                 right during          Block locked
                     500ms window
```

## Technical Constants

```typescript
const LOCK_DELAY = 500; // ms grace period before locking

// Visual feedback timing
const PULSE_RATE = 0.1; // radians per frame (approx 3 Hz at 60 FPS)
const BRIGHTNESS_RANGE = [1.0, 1.3]; // min/max brightness multiplier
const GLOW_COLOR = 'rgba(255, 200, 100, 0.6)'; // warm golden glow
const GLOW_BLUR_RANGE = [8, 10]; // px
```

## Testing the Feature

### Manual Testing

**Test 1: Basic Lock Delay**
1. Drop a block
2. Observe pulsing glow when it lands
3. Wait 500ms without moving
4. Confirm block locks

**Test 2: Horizontal Adjustment**
1. Drop a block
2. When it lands, quickly press left/right
3. Observe block moving during lock delay
4. Confirm block locks in new position

**Test 3: Cancel Lock Delay**
1. Drop a block onto elevated surface
2. During lock delay, move block off edge
3. Observe lock delay cancelled
4. Confirm block continues falling

**Test 4: Hard Drop Override**
1. Press space for hard drop
2. Confirm no lock delay occurs
3. Block locks immediately

### Automated Testing

Lock delay tests can be added to the test suite:

```typescript
describe('Lock Delay Mechanism', () => {
  it('should activate lock delay when block lands', () => {
    // ... test implementation
  });
  
  it('should allow horizontal movement during lock delay', () => {
    // ... test implementation
  });
  
  it('should cancel lock delay if block can fall further', () => {
    // ... test implementation
  });
  
  it('should lock after 500ms expires', () => {
    // ... test implementation
  });
});
```

## Performance Considerations

**Efficient Animation:**
- Only animates when `lockDelayActive` is true
- Uses `requestAnimationFrame` for smooth 60 FPS
- Minimal computational overhead (simple sine calculation)
- No DOM manipulation, pure canvas rendering

**State Management:**
- Single boolean flag for lock delay state
- One timer ID stored (number)
- Timer properly cleared on all state changes
- No memory leaks

## Future Enhancements

Potential improvements (not in current scope):

1. **Configurable Delay Duration**
   - Let players adjust delay time in settings
   - Range: 200ms - 800ms

2. **Visual Variations**
   - Different glow colors per difficulty level
   - Intensity changes based on remaining time

3. **Sound Feedback**
   - Subtle tick sound when lock delay starts
   - Warning sound at 90% elapsed

4. **Extended Lock Delay (Infinite Finesse)**
   - Reset timer on each movement
   - Cap at maximum number of resets
   - Advanced technique for expert players

## Conclusion

The lock delay implementation provides a polished, player-friendly mechanic that:
- ✅ Follows SPECIFICATION.md exactly (500ms timer)
- ✅ Includes optional visual feedback (pulsing glow)
- ✅ Maintains gameplay flow
- ✅ Reduces player frustration
- ✅ Enables strategic play
- ✅ Matches Scrabble aesthetic
- ✅ Performs efficiently

The visual feedback is subtle enough to not distract, but clear enough to inform players they have time to adjust their block placement. This creates a more forgiving and enjoyable gameplay experience while maintaining the challenge of word formation.

