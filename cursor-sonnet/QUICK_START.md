# Quick Start Guide

Get Word Tetris running in 3 simple steps!

## Prerequisites

Make sure you have Node.js installed. Check with:
```bash
node --version  # Should be 18+ or 20+
```

If you don't have Node.js, download it from [nodejs.org](https://nodejs.org/)

## Installation & Run

### Step 1: Navigate to project
```bash
cd cursor-sonnet
```

### Step 2: Install dependencies
```bash
npm install
```

This will install:
- React 18.2
- TypeScript 5.3
- Vite 5.0
- Zustand 4.4
- And other dev dependencies

### Step 3: Start the game
```bash
npm run dev
```

The game will open at `http://localhost:3000` (or the next available port).

## That's It! 🎉

You should now see the Word Tetris menu. Click "Play Game" to start!

## Quick Controls Reference

- **Arrow Keys**: Move and drop pieces
- **Space**: Hard drop (instant)
- **Z/X**: Rotate pieces
- **C**: Hold piece
- **P**: Pause

## Having Issues?

### Port 3000 is busy
Vite will automatically use another port. Check your terminal for the actual URL.

### Build errors
Try reinstalling dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Still stuck?
Check the full README.md for detailed troubleshooting steps.

---

**Pro Tip**: Form longer words for exponentially more points! A 6-letter word gives 400 points. 🎯

