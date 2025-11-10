# Word Tetris - Test Suite

## Running the Tests

The test suite verifies that the game follows the SPECIFICATION.md when it comes to word formation and disappearing.

### Run all tests:
```bash
npm test
```

### Run specific test file:
```bash
npm test wordRemoval.test.ts
```

### Run tests in watch mode:
```bash
npm test -- --watch
```

## Test Coverage

### Word Removal Tests (`src/__tests__/wordRemoval.test.ts`)

This comprehensive test suite verifies compliance with SPECIFICATION.md for word disappearing behavior:

#### 1. Word Detection
- ✅ Detects horizontal words of 3+ letters
- ✅ Detects vertical words of 3+ letters  
- ✅ Ignores words with fewer than 3 letters
- ✅ Detects multiple words on the same grid

#### 2. Word Removal - ALL Letters Must Disappear (SPECIFICATION.md)
- ✅ Removes ALL 3 letters of a word from the grid
- ✅ Removes ALL letters of longer words from the grid
- ✅ Does NOT remove blocks that are not part of the word
- ✅ Verifies complete word disappearance as specified

#### 3. Gravity After Word Removal (SPECIFICATION.md)
- ✅ Applies gravity and drops blocks down after word removal
- ✅ Only drops blocks in columns where letters were removed
- ✅ Maintains block positions in unaffected columns
- ✅ Correctly fills empty spaces from bottom to top

#### 4. Animation State (SPECIFICATION.md - 400-500ms animation)
- ✅ Populates `animatingBlocks` when a word is formed
- ✅ Animation blocks include all required properties (position, letter, value, startTime)
- ✅ Clears `animatingBlocks` after animation duration completes
- ✅ Respects the 400-500ms animation timing from spec

#### 5. Highest Scoring Word Selection (SPECIFICATION.md)
- ✅ Scores only the highest scoring word when multiple words exist
- ✅ Correctly identifies and processes the best scoring option

#### 6. Chain Reactions (SPECIFICATION.md)
- ✅ Detects new words formed after gravity is applied
- ✅ Processes chain reactions recursively
- ✅ Continues until no more words can be formed

#### 7. Complete Integration Flow
- ✅ Full flow: detect → animate → remove → gravity → chain
- ✅ Verifies score increases when words are formed
- ✅ Confirms grid state changes after word processing
- ✅ Tests the complete game loop behavior

## SPECIFICATION.md Compliance

The tests specifically verify these requirements from SPECIFICATION.md:

### Word Removal Animation (Lines 109-115)
- **ALL letters in the scored word are removed** with visual effects
- Every letter block flashes briefly (2-3 rapid pulses)
- All letters fade out over 300-400ms
- Total animation duration: ~400-500ms
- **The entire word disappears** - every single letter

### After Scoring (Lines 116-120)
- Gravity applied after fade completes
- All blocks above removed letters fall down
- Grid checked again for new words
- Chain reactions processed with bonus multipliers
- Process repeats until no more words form

### Visual Feedback (Lines 122-127)
- Valid words highlighted when detected
- **All letters in formed word** flash and fade together
- Score popup shown during animation
- Cascade animation for falling blocks
- Clear indication of which word is being removed

## Key Test Scenarios

### Scenario 1: Basic Word Formation
```
Grid:  C A T
Test:  All 3 letters disappear
```

### Scenario 2: Word with Blocks Above
```
Grid:  X
       Y
       C A T
Test:  CAT disappears, X and Y fall down
```

### Scenario 3: Multiple Words
```
Grid:  C A T
       B A T
Test:  Only highest scoring word is processed
```

### Scenario 4: Chain Reaction
```
Grid:  D
       O
       G
       C A T  (remove CAT)
Result: DOG forms after gravity, triggers chain
```

## Mocked Dependencies

To ensure tests run reliably and quickly:
- **Audio Manager**: Mocked to avoid sound playback
- **Dictionary**: Mocked with test words (CAT, DOG, RAT, BAT, etc.)
- **Timers**: Controlled with `vi.useFakeTimers()` for animation testing

## Adding New Tests

When adding new test cases:

1. Place tests in appropriate describe block
2. Use descriptive test names that reference SPECIFICATION.md
3. Mock external dependencies
4. Use fake timers for animation tests
5. Clean up after each test with `afterEach`

Example:
```typescript
it('should follow SPECIFICATION.md requirement X', () => {
  // Setup
  const grid = createEmptyGrid();
  // ... test setup
  
  // Action
  const result = someFunction(grid);
  
  // Assert
  expect(result).toMatchSpecification();
});
```

## Continuous Integration

These tests should be run:
- Before every commit
- In CI/CD pipeline
- Before deploying to production
- When modifying word removal logic
- When updating SPECIFICATION.md

## Test Philosophy

These tests are **specification-driven**. They exist to ensure the game behavior matches what's documented in SPECIFICATION.md. If a test fails, either:
1. The code needs to be fixed to match the spec, or
2. The spec needs to be updated (and tests adjusted accordingly)

The tests serve as executable documentation of how the word disappearing system should work.

