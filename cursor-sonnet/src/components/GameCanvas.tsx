import { useEffect, useRef, useState } from 'react';
import { Grid, Block, Position, AnimatingBlock } from '../types/game';
import { GRID_WIDTH, GRID_HEIGHT, BLOCK_SIZE } from '../constants/game';
import { getDropPosition } from '../utils/collision';
import { getPremiumSquareDetails } from '../constants/premiumSquares';

interface GameCanvasProps {
  grid: Grid;
  currentBlock: Block | null;
  currentPosition: Position;
  isPaused: boolean;
  animatingBlocks: AnimatingBlock[];
  lockDelayActive: boolean;
}

const ANIMATION_DURATION = 450; // ms

export function GameCanvas({ grid, currentBlock, currentPosition, isPaused, animatingBlocks, lockDelayActive }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setAnimationFrame] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  
  // Re-render animation frames
  useEffect(() => {
    if (animatingBlocks.length === 0 && !lockDelayActive) return;

    let animationId: number;
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      if (lockDelayActive) {
        setPulsePhase(prev => (prev + 0.1) % (Math.PI * 2));
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [animatingBlocks, lockDelayActive]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Scrabble board background (tan/beige)
    ctx.fillStyle = '#d4c4a8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid squares with premium squares
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const px = x * BLOCK_SIZE;
        const py = y * BLOCK_SIZE;
        
        const premiumSquare = getPremiumSquareDetails(x, y);
        
        if (premiumSquare.type) {
          // Draw premium square background
          ctx.fillStyle = premiumSquare.color;
          ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          
          // Draw premium square border
          ctx.strokeStyle = adjustBrightness(premiumSquare.color, 0.8);
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          
          // Draw premium square label
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.9;
          ctx.font = `bold ${Math.floor(BLOCK_SIZE * 0.25)}px Georgia, serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(premiumSquare.label, px + BLOCK_SIZE / 2, py + BLOCK_SIZE / 2);
          ctx.globalAlpha = 1.0;
        } else {
          // Empty square background (lighter beige)
          ctx.fillStyle = '#e8dcc8';
          ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          
          // Square border (darker tan)
          ctx.strokeStyle = '#c4a57b';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        }
      }
    }
    
    // Create set of animating positions for quick lookup
    const animatingPositions = new Set(
      animatingBlocks.map(block => `${block.position.x},${block.position.y}`)
    );
    
    // Draw locked blocks (Scrabble tiles) - skip animating ones
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && !animatingPositions.has(`${x},${y}`)) {
          drawScrabbleTile(ctx, x, y, cell.letter, cell.value);
        }
      });
    });
    
    // Draw animating blocks with flash and fade effect
    animatingBlocks.forEach(block => {
      const elapsed = Date.now() - block.startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      
      // Flash effect (first 150ms: 3 pulses)
      let flashBrightness = 1;
      if (elapsed < 150) {
        const flashProgress = elapsed / 150;
        const pulseCount = 3;
        const pulse = Math.sin(flashProgress * Math.PI * pulseCount * 2);
        flashBrightness = 1 + pulse * 0.5; // Oscillate between 1 and 1.5
      }
      
      // Fade effect (entire duration)
      const fadeAlpha = 1 - progress;
      
      // Optional scale effect (slight grow)
      const scale = 1 + progress * 0.1;
      
      drawAnimatingTile(
        ctx,
        block.position.x,
        block.position.y,
        block.letter,
        block.value,
        fadeAlpha,
        flashBrightness,
        scale
      );
    });
    
    // Draw ghost block (drop preview)
    if (currentBlock && currentPosition.y >= 0) {
      const ghostPos = getDropPosition(currentPosition, grid);
      if (ghostPos.y !== currentPosition.y) {
        drawGhostTile(ctx, ghostPos.x, ghostPos.y);
      }
    }
    
    // Draw current block with lock delay visual feedback
    if (currentBlock && currentPosition.y >= 0) {
      if (lockDelayActive) {
        // Lock delay active - draw with pulsing effect
        const pulseIntensity = (Math.sin(pulsePhase) + 1) / 2; // 0 to 1
        const brightness = 1 + pulseIntensity * 0.3; // 1.0 to 1.3
        drawScrabbleTileWithGlow(
          ctx,
          currentPosition.x,
          currentPosition.y,
          currentBlock.letter,
          currentBlock.value,
          brightness
        );
      } else {
        // Normal drawing
        drawScrabbleTile(
          ctx,
          currentPosition.x,
          currentPosition.y,
          currentBlock.letter,
          currentBlock.value
        );
      }
    }
    
    // Draw pause overlay
    if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#f5e6d3';
      ctx.font = 'bold 32px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
  }, [grid, currentBlock, currentPosition, isPaused, animatingBlocks]);
  
  return (
    <canvas
      id="game-canvas"
      ref={canvasRef}
      width={GRID_WIDTH * BLOCK_SIZE}
      height={GRID_HEIGHT * BLOCK_SIZE}
      style={{ 
        border: '6px solid #6b2d2d',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '2px'
      }}
    />
  );
}

function drawScrabbleTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  letter: string,
  value: number
) {
  const px = x * BLOCK_SIZE;
  const py = y * BLOCK_SIZE;
  const size = BLOCK_SIZE - 2;
  
  // Scrabble tile background color (beige/tan)
  const gradient = ctx.createLinearGradient(px, py, px, py + size);
  gradient.addColorStop(0, '#f5e6d3');
  gradient.addColorStop(1, '#e8d4b8');
  ctx.fillStyle = gradient;
  ctx.fillRect(px + 1, py + 1, size, size);
  
  // Tile border (darker brown)
  ctx.strokeStyle = '#c4a57b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(px + 1.5, py + 1.5, size - 1, size - 1);
  
  // Inner shadow for depth
  ctx.strokeStyle = '#d4c4a8';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(px + 2, py + 2, size - 2, size - 2);
  
  // Subtle highlight on top-left
  ctx.strokeStyle = '#ffffff';
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(px + 2, py + size - 2);
  ctx.lineTo(px + 2, py + 2);
  ctx.lineTo(px + size - 2, py + 2);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  
  // Draw letter (large, bold, black - Scrabble style)
  ctx.fillStyle = '#1a1a1a';
  ctx.font = `bold ${Math.floor(size * 0.65)}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, px + size / 2, py + size / 2);
  
  // Draw point value (small, bottom-right corner - Scrabble style)
  ctx.fillStyle = '#1a1a1a';
  ctx.font = `${Math.floor(size * 0.28)}px Georgia, serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(value.toString(), px + size - 3, py + size - 2);
}

function drawScrabbleTileWithGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  letter: string,
  value: number,
  brightness: number
) {
  const px = x * BLOCK_SIZE;
  const py = y * BLOCK_SIZE;
  const size = BLOCK_SIZE - 2;
  
  // Add subtle glow around the tile during lock delay
  ctx.shadowColor = 'rgba(255, 200, 100, 0.6)';
  ctx.shadowBlur = 8 * brightness;
  
  // Scrabble tile background - slightly brighter during lock delay
  const gradient = ctx.createLinearGradient(px, py, px, py + size);
  const color1 = adjustBrightness('#f5e6d3', brightness);
  const color2 = adjustBrightness('#e8d4b8', brightness);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(px + 1, py + 1, size, size);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
  // Tile border - slightly emphasized
  ctx.strokeStyle = adjustBrightness('#c4a57b', brightness);
  ctx.lineWidth = 2; // Slightly thicker border
  ctx.strokeRect(px + 1.5, py + 1.5, size - 1, size - 1);
  
  // Inner glow for depth
  ctx.strokeStyle = adjustBrightness('#d4c4a8', brightness * 1.2);
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 2, py + 2, size - 2, size - 2);
  
  // Stronger highlight on top-left
  ctx.strokeStyle = '#ffffff';
  ctx.globalAlpha = 0.4 + (brightness - 1) * 0.3;
  ctx.beginPath();
  ctx.moveTo(px + 2, py + size - 2);
  ctx.lineTo(px + 2, py + 2);
  ctx.lineTo(px + size - 2, py + 2);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  
  // Draw letter (large, bold, black - Scrabble style)
  ctx.fillStyle = '#1a1a1a';
  ctx.font = `bold ${Math.floor(size * 0.65)}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, px + size / 2, py + size / 2);
  
  // Draw point value (small, bottom-right corner - Scrabble style)
  ctx.fillStyle = '#1a1a1a';
  ctx.font = `${Math.floor(size * 0.28)}px Georgia, serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(value.toString(), px + size - 3, py + size - 2);
}

function drawGhostTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) {
  const px = x * BLOCK_SIZE;
  const py = y * BLOCK_SIZE;
  const size = BLOCK_SIZE - 2;
  
  // Ghost tile - dashed outline in brown
  ctx.strokeStyle = '#8b7355';
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(px + 2, py + 2, size - 2, size - 2);
  ctx.setLineDash([]);
  ctx.globalAlpha = 1.0;
}

function drawAnimatingTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  letter: string,
  value: number,
  alpha: number,
  brightness: number,
  scale: number
) {
  const centerX = x * BLOCK_SIZE + BLOCK_SIZE / 2;
  const centerY = y * BLOCK_SIZE + BLOCK_SIZE / 2;
  const size = (BLOCK_SIZE - 2) * scale;
  
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // Translate to center for scaling
  ctx.translate(centerX, centerY);
  ctx.translate(-size / 2, -size / 2);
  
  // Apply brightness to tile color
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  const brightnessFactor = Math.min(brightness, 2);
  gradient.addColorStop(0, adjustBrightness('#f5e6d3', brightnessFactor));
  gradient.addColorStop(1, adjustBrightness('#e8d4b8', brightnessFactor));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Tile border
  ctx.strokeStyle = adjustBrightness('#c4a57b', brightnessFactor);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(1, 1, size - 2, size - 2);
  
  // Inner shadow
  ctx.strokeStyle = adjustBrightness('#d4c4a8', brightnessFactor);
  ctx.lineWidth = 0.5;
  ctx.strokeRect(2, 2, size - 4, size - 4);
  
  // Draw letter
  ctx.fillStyle = '#1a1a1a';
  ctx.font = `bold ${Math.floor(size * 0.65)}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, size / 2, size / 2);
  
  // Draw point value
  ctx.fillStyle = '#1a1a1a';
  ctx.font = `${Math.floor(size * 0.28)}px Georgia, serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(value.toString(), size - 3, size - 2);
  
  ctx.restore();
}

function adjustBrightness(color: string, factor: number): string {
  // Simple brightness adjustment for hex colors
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor));
  const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor));
  const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor));
  return `rgb(${r}, ${g}, ${b})`;
}
