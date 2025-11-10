import { useEffect, useRef } from 'react';
import { Block } from '../types/game';

interface NextBlockProps {
  block: Block;
  size?: number;
}

export function NextBlock({ block, size = 30 }: NextBlockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background (Scrabble board color)
    ctx.fillStyle = '#d4c4a8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Center the block
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const tileSize = size - 2;
    
    // Scrabble tile background
    const gradient = ctx.createLinearGradient(
      centerX - tileSize / 2,
      centerY - tileSize / 2,
      centerX - tileSize / 2,
      centerY + tileSize / 2
    );
    gradient.addColorStop(0, '#f5e6d3');
    gradient.addColorStop(1, '#e8d4b8');
    ctx.fillStyle = gradient;
    ctx.fillRect(
      centerX - tileSize / 2,
      centerY - tileSize / 2,
      tileSize,
      tileSize
    );
    
    // Tile border
    ctx.strokeStyle = '#c4a57b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(
      centerX - tileSize / 2 + 1,
      centerY - tileSize / 2 + 1,
      tileSize - 2,
      tileSize - 2
    );
    
    // Inner shadow
    ctx.strokeStyle = '#d4c4a8';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(
      centerX - tileSize / 2 + 2,
      centerY - tileSize / 2 + 2,
      tileSize - 4,
      tileSize - 4
    );
    
    // Draw letter
    ctx.fillStyle = '#1a1a1a';
    ctx.font = `bold ${Math.floor(tileSize * 0.65)}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(block.letter, centerX, centerY);
    
    // Draw point value
    ctx.fillStyle = '#1a1a1a';
    ctx.font = `${Math.floor(tileSize * 0.28)}px Georgia, serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(
      block.value.toString(),
      centerX + tileSize / 2 - 3,
      centerY + tileSize / 2 - 2
    );
  }, [block, size]);
  
  return (
    <canvas
      ref={canvasRef}
      width={size * 2}
      height={size * 2}
      style={{ 
        border: '2px solid #8b7355',
        borderRadius: '2px'
      }}
    />
  );
}
