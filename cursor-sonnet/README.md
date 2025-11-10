# Word Tetris

A browser-based word puzzle game where single letter blocks fall from the top and players form words using Scrabble-style scoring!

## ✨ Features

### Core Gameplay
- **Single letter blocks** fall one at a time (no tetrominos!)
- **Scrabble letter distribution** - rare letters (Q, Z, X, J) appear less frequently
- **Scrabble point values** - letters worth 1-10 points each
- **Word formation** - form valid English words horizontally or vertically (3+ letters)
- **Smart scoring system** - base score × length bonus × level × combos × chains
- **Chain reactions** - blocks fall after words are removed, can form new words!
- **Progressive difficulty** - 20 levels, speeds up as you form more words
- **Visual point values** - each block shows its letter and point value

### Scoring System
```
Final Score = (Sum of letter values) × Length Bonus × Level × Combo × Chain
```

**Letter Values (Scrabble-based):**
- 1 point: E, A, I, O, N, R, T, L, S, U
- 2-3 points: D, G, B, C, M, P
- 4-5 points: F, H, V, W, Y, K
- 8-10 points: J, X, Q, Z (rare and valuable!)

**Length Bonuses:**
- 3 letters: 1x
- 4 letters: 1.5x
- 5 letters: 2x
- 6 letters: 2.5x
- 7+ letters: 3x+ (increases further)

**Combo Multipliers** (multiple words at once):
- 2 words: 1.5x
- 3 words: 2x
- 4+ words: 2.5x

**Chain Multipliers** (cascade words):
- 1st chain: 1.5x
- 2nd chain: 2x
- 3rd+ chain: 2.5x

### User Interface
- **Color-coded blocks** based on point values:
  - Blue: 1-point letters
  - Green: 2-3 points
  - Orange: 4-5 points
  - Gold/Red: 8-10 points (rare!)
- **Ghost block** shows where current block will land
- **Next 5 blocks** preview
- **Recent words** display with scores
- **Real-time stats** - score, level, words formed, high score
- **Smooth animations** for word removal and cascading blocks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Node.js 20 LTS (recommended)
- npm 10+ (comes with Node.js)

### Installation

1. **Navigate to the project directory**:
```bash
cd cursor-sonnet
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open your browser** and visit:
```
http://localhost:3000
```

### Available Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check for code issues
- `npm run format` - Format code with Prettier

## 🎯 Controls

### Keyboard Controls
| Key | Action |
|-----|--------|
| `←` / `→` | Move block left/right |
| `↓` | Soft drop (faster descent + 1 point per cell) |
| `Space` | Hard drop (instant drop + 2 points per cell) |
| `P` or `Esc` | Pause/Resume game |

**Note:** No rotation controls needed since blocks are single letters!

## 🎮 How to Play

1. **Position falling letters** using arrow keys
2. **Form words** of 3+ letters (horizontal or vertical)
3. **Higher value letters** (Q, Z, X, J) are rare but worth more points
4. **Longer words** get bigger bonuses (7+ letters = 3x multiplier!)
5. **Create combos** by forming multiple words at once
6. **Chain reactions** happen when blocks fall after word removal
7. **Level up** every 10 words formed
8. **Game ends** when blocks reach the top

## 💡 Strategy Tips

- **Save rare letters** (Q, Z, X, J) for longer words - they're worth 8-10 points each!
- **Go for length** - a 7-letter word gets 3x multiplier
- **Create combos** - multiple words at once multiply your score
- **Plan for chains** - think about what happens after words are removed
- **Use soft drop** for precise placement
- **Use hard drop** when you're certain of position (saves time, gives bonus points)

## 📊 Example Scores

**Word: "CAT" (3 letters)**
- C (3) + A (1) + T (1) = 5 base
- × 1 (3-letter bonus) = 5
- × Level 2 = **10 points**

**Word: "QUIZ" (4 letters)**
- Q (10) + U (1) + I (1) + Z (10) = 22 base
- × 1.5 (4-letter bonus) = 33
- × Level 3 = **99 points**

**Word: "PLAYING" (7 letters) in a 3-word combo**
- P (3) + L (1) + A (1) + Y (4) + I (1) + N (1) + G (2) = 13 base
- × 3 (7-letter bonus) = 39
- × Level 5 = 195
- × 2 (3-word combo) = **390 points!**

## 🏗️ Tech Stack

### Core Technologies
- **React 18.2+** - UI framework
- **TypeScript 5.3+** - Type safety
- **Vite 5.0+** - Build tool and dev server
- **Zustand 4.4+** - State management
- **HTML5 Canvas** - Game rendering

### Architecture
- **Single letter blocks** - simplified from tetrominos
- **Scrabble mechanics** - letter distribution and scoring
- **Word validation** - dictionary with 500+ common words
- **Chain reaction system** - cascading word formation
- **Type-safe** - Full TypeScript coverage

## 📁 Project Structure

```
cursor-sonnet/
├── src/
│   ├── components/         # React components
│   │   ├── GameCanvas.tsx  # Canvas renderer with point values
│   │   ├── Game.tsx        # Main game component
│   │   ├── GameInfo.tsx    # Stats & recent words display
│   │   ├── Menu.tsx        # Main menu
│   │   ├── GameOver.tsx    # Game over screen
│   │   └── NextPiece.tsx   # Next block preview
│   ├── hooks/              # Custom React hooks
│   │   ├── useGameControls.ts  # Keyboard handling
│   │   └── useGameLoop.ts      # Game tick loop
│   ├── store/              # Zustand state management
│   │   └── gameStore.ts    # Game state & actions
│   ├── utils/              # Game logic utilities
│   │   ├── letters.ts      # Letter generation (Scrabble)
│   │   ├── collision.ts    # Collision detection
│   │   ├── grid.ts         # Grid management
│   │   ├── words.ts        # Word finding & validation
│   │   ├── score.ts        # Scrabble scoring logic
│   │   └── storage.ts      # localStorage wrapper
│   ├── data/               # Static data
│   │   └── dictionary.ts   # Word dictionary
│   ├── types/              # TypeScript types
│   │   └── game.ts         # Game type definitions
│   ├── constants/          # Game constants
│   │   └── game.ts         # Scrabble values & config
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html              # HTML template
└── package.json            # Dependencies
```

## 🎨 Key Implementation Details

### Scrabble Letter Distribution
Letters appear with the same frequency as Scrabble tiles:
- E: 12 tiles (most common, 1 point)
- A, I: 9 tiles each (1 point)
- Q, Z: 1 tile each (10 points, rare!)

### Word Detection
- Scans grid horizontally and vertically after each block placement
- Validates against dictionary (500+ words)
- Calculates base score from letter values
- Applies length bonus, level multiplier, combo multiplier, and chain multiplier

### Chain Reactions
- After words are removed, blocks above fall down
- System checks for new words after gravity is applied
- Chain continues until no more words are formed
- Each chain level increases the multiplier

### Visual Feedback
- Blocks are color-coded by point value
- Point values visible in corner of each block
- Recent words display with final scores
- Ghost block shows drop position

## 🎯 Changes from Original Specification

This implementation follows the **updated SPECIFICATION.md**:

✅ **Single letter blocks** instead of tetrominos
✅ **Scrabble-based scoring** with letter point values
✅ **Scrabble tile distribution** for letter frequency
✅ **Simplified controls** (no rotation)
✅ **Word-based progression** (level up every 10 words)
✅ **Chain reaction scoring** (cascading words)
✅ **Color coding** by point value
✅ **Recent words display** with scores
✅ **Maximum 20 levels**

## 🐛 Troubleshooting

### Port already in use
Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Module not found errors
Try deleting `node_modules` and reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
Make sure you're using Node.js 18+ and TypeScript 5.3+:
```bash
node --version
npx tsc --version
```

## 📝 License

MIT License - feel free to use this project for learning or building your own version!

## 🎓 Learning Resources

This project demonstrates:
- **Scrabble mechanics** in a falling block game
- **Word validation** and dictionary lookups
- **Chain reaction systems** with cascading effects
- **Complex scoring calculations** with multiple multipliers
- **Canvas rendering** with dynamic colors
- **State management** with Zustand
- **TypeScript** best practices

---

**Ready to form some high-scoring words? 🎮 Try to spell QUIZ or JAZZ for massive points!**
