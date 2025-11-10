# Word Tetris

A modern browser-based puzzle game that combines classic Tetris mechanics with word-building gameplay. Stack falling letter blocks, form words, and clear lines to achieve the highest score!

## Project Overview

Word Tetris takes the beloved Tetris gameplay and adds a linguistic twist. Each block in a tetromino contains a letter, and players can earn bonus points by forming valid English words horizontally or vertically as they play.

## Key Features

- Classic Tetris mechanics with 7 standard tetromino shapes
- Letter-based blocks with intelligent distribution
- Word detection and validation system
- Progressive difficulty with increasing levels
- Comprehensive scoring system with word bonuses
- Smooth 60 FPS gameplay
- Responsive design for desktop and mobile
- High score persistence
- Touch and keyboard controls

## Documentation

- **[SPECIFICATION.md](./SPECIFICATION.md)** - Complete game specification including mechanics, scoring, features, and requirements
- **[TECH_STACK.md](./TECH_STACK.md)** - Detailed technology stack and architecture decisions

## Tech Stack

### Core
- **TypeScript 5.3+** - Type-safe development
- **React 18.2+** - UI framework
- **Vite 5.0+** - Build tool and dev server

### Key Libraries
- **Zustand** - State management
- **Howler.js** - Audio management
- **HTML5 Canvas** - Game rendering

### Development
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **ESLint + Prettier** - Code quality
- **pnpm** - Package management

See [TECH_STACK.md](./TECH_STACK.md) for complete details.

## Getting Started

### Prerequisites

- Node.js 18 LTS or 20 LTS
- pnpm 8.0+ (or npm 10+)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd WordTetris

# Install dependencies
pnpm install
# or
npm install
```

### Development

```bash
# Start development server
pnpm dev
# or
npm run dev

# Open http://localhost:5173 in your browser
```

### Building

```bash
# Create production build
pnpm build
# or
npm run build

# Preview production build locally
pnpm preview
# or
npm run preview
```

### Testing

```bash
# Run unit tests
pnpm test
# or
npm test

# Run tests in watch mode
pnpm test:watch
# or
npm run test:watch

# Generate coverage report
pnpm test:coverage
# or
npm run test:coverage
```

### Code Quality

```bash
# Lint code
pnpm lint
# or
npm run lint

# Format code
pnpm format
# or
npm run format

# Type check
pnpm type-check
# or
npm run type-check
```

## Project Structure

```
WordTetris/
├── src/
│   ├── components/        # React components
│   │   ├── Game/         # Game board and UI
│   │   ├── Menus/        # Menu screens
│   │   └── UI/           # Reusable UI components
│   ├── game/             # Game logic
│   │   ├── engine/       # Core game engine
│   │   ├── pieces/       # Tetromino definitions
│   │   ├── board/        # Game board logic
│   │   └── scoring/      # Scoring system
│   ├── stores/           # Zustand state stores
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── assets/           # Static assets
│   │   ├── audio/        # Sound effects and music
│   │   ├── images/       # Images and sprites
│   │   └── dictionary/   # Word lists
│   ├── styles/           # Global styles
│   ├── App.tsx           # Root component
│   └── main.tsx          # Application entry point
├── public/               # Public static files
├── tests/                # Test files
├── SPECIFICATION.md      # Game specification
├── TECH_STACK.md        # Technology documentation
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── .eslintrc.cjs        # ESLint configuration
└── .prettierrc          # Prettier configuration
```

## Game Controls

### Keyboard
- **Arrow Left/Right** - Move piece horizontally
- **Arrow Down** - Soft drop (accelerate fall)
- **Arrow Up** or **Space** - Hard drop (instant drop)
- **Z** or **Ctrl** - Rotate counterclockwise
- **X** or **Up Arrow** - Rotate clockwise
- **C** or **Shift** - Hold piece
- **P** or **Escape** - Pause game

### Touch (Mobile)
- **Swipe Left/Right** - Move piece
- **Swipe Down** - Soft drop
- **Tap** - Rotate clockwise
- **Two-finger tap** - Rotate counterclockwise
- **Hold button** - Hold piece
- **Pause button** - Pause game

## Development Roadmap

### Phase 1: MVP (Minimum Viable Product)
- [ ] Core Tetris engine and mechanics
- [ ] Basic game board rendering
- [ ] Keyboard controls
- [ ] Letter generation and display
- [ ] Horizontal word detection
- [ ] Basic scoring system
- [ ] Game over detection
- [ ] Simple UI (score, level, next piece)

### Phase 2: Enhanced Features
- [ ] Vertical word detection
- [ ] Dictionary integration and validation
- [ ] Sound effects
- [ ] Smooth animations
- [ ] High score persistence
- [ ] Pause functionality
- [ ] Responsive mobile layout
- [ ] Touch controls

### Phase 3: Polish
- [ ] Hold piece functionality
- [ ] Multiple next piece previews
- [ ] Background music
- [ ] Visual effects and particles
- [ ] Settings menu (sound, controls)
- [ ] Ghost piece preview
- [ ] Accessibility features

### Phase 4: Advanced Features
- [ ] Statistics tracking
- [ ] Achievement system
- [ ] Daily challenges
- [ ] Online leaderboards
- [ ] Multiplayer mode
- [ ] Custom themes
- [ ] PWA support

## Contributing

This is currently a personal project. Contribution guidelines will be added if the project becomes open for contributions.

## Performance Goals

- **Initial Load**: < 100 KB (gzipped)
- **Frame Rate**: Solid 60 FPS
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 8+)

## License

[License TBD]

## Acknowledgments

- Tetris gameplay inspired by the original Tetris by Alexey Pajitnov
- Letter distribution based on English language frequency analysis
- Dictionary sourced from SOWPODS/TWL word lists

## Contact

[Contact information TBD]

---

**Status**: In Development

**Version**: 0.1.0 (Initial Setup)
