import { useEffect, useRef } from 'react';

interface MatrixWaterfallProps {
  side: 'left' | 'right';
  isDisappearing?: boolean;
}

export const MatrixWaterfall = ({ side, isDisappearing = false }: MatrixWaterfallProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 150;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -50);
    const chars = '01';
    const trailLength = 20;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        
        // Draw trail
        for (let j = 0; j < trailLength; j++) {
          const y = (drops[i] - j) * fontSize;
          if (y < 0 || y > height) continue;
          
          const char = chars[Math.floor(Math.random() * chars.length)];
          const opacity = 1 - (j / trailLength) * 0.7;
          
          ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
          ctx.fillText(char, x, y);
        }

        if (drops[i] * fontSize > height && Math.random() > 0.95) {
          drops[i] = Math.random() * -10;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={isDisappearing ? 'waterfall-disappear' : ''}
      style={{
        position: 'fixed',
        top: 0,
        [side]: '100px',
        width: '150px',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 1,
      }}
    />
  );
};
