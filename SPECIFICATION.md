# Word Tetris - Game Specification

## Overview
Word Tetris is a browser-based puzzle game focused on word-building gameplay. Players guide falling single-letter blocks to form words and clear lines, combining elements of word puzzles with falling block mechanics.

## Game Mechanics

### Core Gameplay
- **Playfield**: 10 columns x 10 rows grid (square board)
- **Falling Pieces**: Single blocks, each containing one random letter
- **Letter Distribution**: Letters generated based on English language frequency
- **Fall Speed**: 
  - Initial speed: 500ms per row (faster than traditional Tetris)
  - Decreases by 30ms per level
  - Minimum speed: 100ms per row
- **Block Control**: Players can move and drop blocks (no rotation needed for single blocks)

### Premium Squares (Scrabble-Style Multipliers)

The game board features special colored squares that multiply letter or word scores, similar to Scrabble:

#### Square Types and Colors
- **Double Letter Score (DLS)**: Light blue squares - Letter value × 2
- **Triple Letter Score (TLS)**: Dark blue squares - Letter value × 3
- **Double Word Score (DWS)**: Light pink/salmon squares - Total word score × 2
- **Triple Word Score (TWS)**: Red/dark pink squares - Total word score × 3

#### Premium Square Placement Pattern
The premium squares are **sparsely placed** in random positions across the board (~4% of total squares):

**Total Premium Squares: ~4 squares out of 100 (4% coverage)**

**Approximate Distribution:**
- **Double Letter Score (Light Blue #4ecdc4)**: 2 squares randomly placed
- **Triple Letter Score (Dark Blue #0891b2)**: 1 square randomly placed
- **Double Word Score (Light Pink #f09bb9)**: 1 square randomly placed
- **Triple Word Score (Red #e94560)**: 0-1 squares randomly placed (typically in corners or edges)

**Placement Strategy:**
- Premium squares are scattered randomly across the 10x10 board
- No predictable patterns or symmetry
- Squares appear more commonly in middle rows (3-7) to encourage strategic play
- Corner squares may occasionally have Triple Word Score
- Players must adapt their strategy based on available premium squares
- The rarity makes hitting premium squares more rewarding and strategic

#### Multiplier Rules
1. **Letter multipliers** apply only to the letter placed on that square
2. **Word multipliers** apply to the entire word score (after letter multipliers)
3. **Multiple multipliers**: If a word covers multiple premium squares, all multipliers are applied
4. **One-time use**: Once a letter is placed on a premium square, that square becomes inactive (standard Scrabble rule - optional)
5. **Calculation order**: Letter multipliers first, then word multipliers
6. **Example**: 
   - Word "CAT" where C=3, A=1, T=1
   - If A lands on Double Letter and the word covers Double Word:
   - Score = ((3 + (1×2) + 1) × 2) × level = (6 × 2) × level = 12 × level

### Block Movement
- **Left/Right**: Move block horizontally within grid boundaries
- **Soft Drop**: Accelerate block descent
- **Hard Drop**: Instantly drop block to lowest valid position
- **Lock Delay**: Brief delay before block locks to allow final adjustments

#### Lock Delay Mechanics
Lock delay is a grace period that activates when a falling block touches the ground or another block, giving players time to make last-second positioning adjustments before the block permanently locks in place.

**How It Works:**
1. When a block can no longer move down (collision detected), a 500ms timer starts
2. During this 500ms window, the block remains in its current position
3. Players can still move the block left or right during the delay period
4. After 500ms expires, the block locks permanently to the grid
5. If the block is moved such that it can fall further, the lock delay is cancelled and normal falling resumes

**Purpose:**
- Allows players to slide blocks into tight spaces after landing
- Reduces frustration from accidental or imprecise placements
- Enables more strategic word formation and positioning
- Standard mechanic in falling block puzzle games

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

**Visual Feedback (Optional):**
- Subtle pulsing or color change during lock delay period
- Helps players recognize they have time to adjust positioning

### Scoring System
- **Word Formation**: Scrabble-style scoring based on letter values
  - Base Score = Sum of all letter values in the word
  - Letter values follow standard Scrabble points (see Letter Distribution section)
  - **Premium Square Multipliers**: Applied to letters/words on special squares
    - Double Letter Score (DLS): Letter value × 2
    - Triple Letter Score (TLS): Letter value × 3
    - Double Word Score (DWS): Word total × 2
    - Triple Word Score (TWS): Word total × 3
    - Multiple word multipliers stack multiplicatively (DWS + DWS = 4x)
  - **Length Bonus**: Multiply word score by word length bonus
    - 3 letters: 1x
    - 4 letters: 1.5x
    - 5 letters: 2x
    - 6 letters: 2.5x
    - 7+ letters: 3x + 0.5x per additional letter
  - **Level Multiplier**: Final score multiplied by current level
  - **Final Formula**: ((Letter Values with DLS/TLS) × DWS/TWS × Length Bonus) × Level
- **Line Clear Bonus**: When a complete line is filled
  - 1 line: 25 points × level
  - 2+ lines: 50 points × level × number of lines
- **Chain Bonus**: Words formed from falling blocks after word removal
  - First chain: 1.5x
  - Second chain: 2x
  - Third+ chain: 2.5x

### Word Formation & Scoring Process

#### When Words Are Scored
- Word validation occurs immediately after each block comes to rest (locks in place)
- All valid words on the grid are detected (horizontal and vertical)
- **Only the highest scoring word is scored** if multiple valid words exist
- The highest scoring word is determined by calculating: (Letter Values Sum) × Length Bonus × Level
- **All letters that make up the scored word are removed from the grid** (not just marked - they completely disappear)

#### Word Detection Rules
- Words can be formed:
  - Horizontally (left-to-right in a row)
  - Vertically (top-to-bottom in a column)
  - Diagonal words are NOT counted
- Minimum word length: 3 letters
- Maximum word length: 10 letters
- Words must be valid English words from the game dictionary

#### After Scoring
1. **Word Removal Animation**: **ALL letters in the scored word are removed** with visual effects:
   - Every letter block that makes up the word flashes briefly (2-3 rapid color/brightness pulses)
   - All letters in the word fade out smoothly over 300-400ms
   - Optional: Slight scale-up effect before disappearing
   - Total animation duration: ~400-500ms
   - **Important**: The entire word disappears - every single letter that forms the word is removed from the grid
2. **Gravity Applied**: After fade completes, all blocks above the removed letters fall down to fill empty spaces
3. **Chain Reaction**: After blocks fall, the grid is checked again for new words
   - If a new word is formed, it is scored with a chain bonus multiplier
   - The process repeats until no more words are formed
   - Each successive chain increases the multiplier

#### Visual Feedback
- Valid words are highlighted/outlined when detected
- **All letters in the formed word** flash and fade out smoothly together (not instant disappearance)
- Score popup shows the word and points earned during the fade animation
- Cascade animation when blocks fall after removal completes
- Players clearly see which complete word is being removed

### Level Progression
- Start at Level 1
- Level up every 10 words formed (not lines cleared)
- Fall speed increases with each level
- Maximum level: 20
- Each level increases difficulty and point multipliers

### Game Over Conditions
- Game ends when a new block cannot be placed (blocks reach top of playfield)
- Final score, words formed, and statistics displayed
- High score saved if achieved

## User Interface

### Main Game Screen
- Game grid (central focus)
- Next block preview (shows upcoming 3 letter blocks with point values)
- Score display (prominent, with last word score popup)
- Level indicator
- Words formed counter
- Current combo/chain counter
- High score display
- **Recently formed words list (last 3 words with scores)** - displays word and points earned
- Letter point value reference (collapsible)

### Menus
- **Start Screen**: Play, Options, High Scores, How to Play
- **Pause Menu**: Resume, Restart, Options, Quit to Menu
- **Game Over Screen**: Final score, High scores, Play Again, Main Menu

### Visual Design
- **Classic Scrabble Board Aesthetic**
  - Tan/beige game board background (#d4c4a8, #e8dcc8)
  - Burgundy/maroon border and frame (#6b2d2d, #8b4545)
  - Vintage, traditional board game appearance
  - Grid squares with subtle borders matching Scrabble board style

- **Scrabble Tile Appearance**
  - Authentic Scrabble tile design with beige/tan gradient (#f5e6d3 to #e8d4b8)
  - Brown borders and subtle 3D depth effect
  - Large serif letter (Georgia font) centered on tile
  - Small point value in bottom-right corner (Scrabble convention)
  - All tiles have uniform appearance regardless of point value
  - No color coding - maintaining classic Scrabble look

- **UI Panels**
  - Sidebar panels match board background with tan/beige tones
  - Brown borders (#8b7355, #c4a57b) consistent with Scrabble theme
  - Serif typography (Georgia font) throughout
  - Warm, vintage color palette

- **Game Board**
  - Thick burgundy border (8px) around main game grid
  - Subtle shadow effects for depth
  - Grid squares visible in lighter beige with premium square colors:
    - **Double Letter Score**: Light blue (#4ecdc4) with "DL" or "2L" label
    - **Triple Letter Score**: Dark blue (#0891b2) with "TL" or "3L" label
    - **Double Word Score**: Light pink (#f09bb9) with "DW" or "2W" label
    - **Triple Word Score**: Red (#e94560) with "TW" or "3W" label
  - Premium square text in small, centered, white/cream lettering
  - Ghost piece shown as dashed brown outline

- **Animations**
  - Smooth animations for block movement
  - **Word removal animation**: 
    - **All letters in the word** flash together (2-3 rapid pulses)
    - **All letters in the word** fade out smoothly over 300-400ms
    - Optional scale/pulse effect
    - Duration: 400-500ms total before gravity applies
    - **Complete word disappears** - every letter is removed
  - Visual feedback for word formation (highlight/outline)
  - Cascade animation when blocks fall after word removal completes
  - Score popup showing word score calculation (appears during fade)
  - All animations maintain the classic Scrabble aesthetic

### Audio

#### Background Music
- **8-bit chiptune style background music** inspired by classic NES Tetris
- **Off by default** - players must enable it using the toggle button
- **Extended looping melodic theme** (~50 seconds duration before repeating) for variety
- **Music toggle button** in game UI - players can turn music on/off during gameplay (🔊/🔇 icon)
- **Square wave synthesis** for authentic retro sound
- Multi-phrase melody structure with bass line accompaniment:
  - Main theme (Phrase 1)
  - Variation with higher notes (Phrase 2)
  - Bridge section (Phrase 3)
  - Finale variation (Phrase 4)
- Approximately 200 BPM tempo for engaging gameplay rhythm
- Volume control (music at 30% of master volume by default)
- Pauses during pause screen, resumes on unpause
- Stops on game over
- Music preference persists during gameplay session

#### Sound Effects
Sound effects should be played for the following game events:

**Block Placement:**
- **Block lock** - Satisfying click sound when a block comes to rest and locks into place on the grid

**Word Formation & Scoring:**
- **Word formed** - Pleasant chime sound, pitch varies by word length:
  - 3-letter word: Low pitch chime
  - 4-5 letter words: Medium pitch chime
  - 6+ letter words: High pitch chime with additional flourish
- **High-value letter** - Special sparkle sound when placing Q, X, Z, J (8-10 point letters)
- **Word removal** - Whoosh/disappear sound as letters vanish
- **Cascade/gravity** - Falling blocks sound as they drop down

**Combos & Chains:**
- **Chain reaction** - Escalating tone for each chain level (1st, 2nd, 3rd+)
- **Score milestone** - Achievement sound for crossing 1000, 5000, 10000 points

**Game Events:**
- **Level up** - Triumphant fanfare sound
- **Line clear** - Bonus secondary sound (since words are primary)
- **Game over** - Descending tone sequence
- **New high score** - Victory fanfare
- **Pause** - Soft pause sound
- **Resume** - Soft unpause sound

**UI Sounds:**
- **Menu navigation** - Soft click for button hover
- **Menu selection** - Confirm sound for button clicks
- **Invalid action** - Subtle error tone (e.g., can't move block)

#### Audio Settings
- Master volume control (0-100%)
- Separate controls for music and sound effects
- **In-game music toggle button** (🔊 Music / 🔇 Music) in sidebar UI
- Mute all option
- Audio preferences saved to localStorage (future enhancement)

## Controls

### Keyboard
- **Arrow Left/Right**: Move block horizontally
- **Arrow Down**: Soft drop
- **Space**: Hard drop
- **P** or **Escape**: Pause game
- **H**: Show hint (highlights possible word formations - optional feature)

### Touch Controls (Mobile)
- **Swipe Left/Right**: Move block
- **Swipe Down**: Soft drop
- **Tap empty space**: Hard drop at that column
- **Pause button**: Pause game

### Gamepad Support (Optional)
- D-pad or Left stick for movement
- A button for hard drop
- Start button for pause

## Features

### Must-Have (MVP)
- Single letter block falling mechanics
- Letter display on blocks with frequency-based distribution
- Word detection (horizontal and vertical)
- Dictionary validation system
- Scoring system with word-based points and premium square multipliers
- Premium squares (Double/Triple Letter/Word) with visual indicators
- Level progression (based on words formed)
- Game over detection
- Responsive keyboard controls
- Next 3-5 blocks preview
- Basic UI with score/level/words display
- Gravity system (blocks fall after word removal)

### Should-Have
- High score persistence (localStorage)
- **Recently formed words display** - Shows last 3 words scored with their points in a compact list
- **Word removal animations** (flash and fade effect, 400-500ms duration)
- Sound effects for different events (higher pitch for higher value letters)
- Smooth cascade animations
- Pause functionality
- Touch controls for mobile
- Settings (sound, controls)
- Visual highlighting for valid words
- Score calculation popup (showing letter values and bonuses)
- Letter point value reference chart

### Nice-to-Have
- Hint system (shows possible words with potential scores)
- Combo counter and multiplier display with animations
- Chain reaction word formations with visual feedback
- **8-bit chiptune background music** (Tetris-inspired melody with square wave synthesis)
- Advanced particle effects (more intense for high-value letters)
- Gamepad support
- Online leaderboards (daily, weekly, all-time)
- Statistics tracking:
  - Highest scoring word
  - Total words formed
  - Highest single-turn score
  - Average word length
  - Favorite letters used
- Daily challenges with special letter distributions
- Achievement system:
  - Use all high-value letters (Q, Z, X, J)
  - Form 7+ letter word
  - Score 50+ points in one word
  - Chain 3+ consecutive words
- Word definition lookup (educational feature)
- Letter frequency statistics display

## Technical Requirements

### Performance
- Maintain 60 FPS during gameplay
- Smooth animations without frame drops
- Responsive input (< 16ms input lag)
- Fast game state updates

### Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Desktop and tablet support (minimum 768px width)
- Mobile support (minimum 375px width)
- Touch and keyboard input support

### Data Storage
- High scores stored locally (localStorage)
- Game settings persistence
- Optional: Save game state for resume later

### Accessibility
- Keyboard navigation in menus
- High contrast mode option
- Colorblind-friendly palette option
- Screen reader support for UI elements
- Adjustable game speed

## Dictionary & Letter Distribution

### Letter Distribution (Scrabble-Based)
Letters are distributed following standard Scrabble tile distribution and point values:

#### Letter Values & Distribution
- **1 point** (68 tiles total):
  - E (12 tiles) - Most common
  - A (9 tiles), I (9 tiles)
  - O (8 tiles)
  - N (6 tiles), R (6 tiles), T (6 tiles)
  - L (4 tiles), S (4 tiles), U (4 tiles)
  
- **2 points** (6 tiles total):
  - D (4 tiles)
  - G (2 tiles)
  
- **3 points** (8 tiles total):
  - B (2 tiles), C (2 tiles)
  - M (2 tiles), P (2 tiles)
  
- **4 points** (10 tiles total):
  - F (2 tiles), H (2 tiles)
  - V (2 tiles), W (2 tiles), Y (2 tiles)
  
- **5 points** (1 tile):
  - K (1 tile)
  
- **8 points** (2 tiles total):
  - J (1 tile), X (1 tile)
  
- **10 points** (2 tiles total):
  - Q (1 tile), Z (1 tile)

**Total: 98 letter tiles** (Scrabble has 2 blank tiles which are omitted in this game)

### Letter Selection Algorithm
- Weighted random selection based on Scrabble distribution
- Each letter has a probability proportional to its tile count
- Higher point letters appear less frequently
- Ensures balanced and strategic gameplay

### Dictionary
- Use standard Scrabble dictionary (TWL or SOWPODS)
- Minimum 3 letters, maximum 10 letters
- Valid Scrabble words only
- Filter out offensive words
- No proper nouns or abbreviations (following Scrabble rules)

## Future Enhancements
- Multiplayer mode (compete for highest word score)
- Custom themes and color schemes
- Power-ups and special blocks:
  - Wildcard letters (can be any letter)
  - Bomb blocks (clear surrounding blocks)
  - Freeze time blocks
  - Double points blocks
- Story mode with word-themed challenges
- Tournament mode with leaderboards
- Replay system to watch best games
- Comprehensive achievement system
- Word of the day challenges
- Educational mode with definitions
- Custom word lists (medical, technical, etc.)
- Multiplayer co-op (build words together)
