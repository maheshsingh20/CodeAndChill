import React, { useEffect, useRef } from 'react';

interface BinaryRainProps {
  className?: string;
  density?: number;
  speed?: number;
}

export const BinaryRain: React.FC<BinaryRainProps> = ({
  className = '',
  density = 0.5,
  speed = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createBinaryDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'binary-drop';
      drop.textContent = Math.random() > 0.5 ? '1' : '0';

      // Random position
      drop.style.left = Math.random() * 100 + '%';
      drop.style.animationDuration = (Math.random() * 3 + 2) / speed + 's';
      drop.style.opacity = (Math.random() * 0.5 + 0.1).toString();
      drop.style.fontSize = (Math.random() * 8 + 10) + 'px';

      // Random color from blue spectrum
      const colors = ['#3B82F6', '#1D4ED8', '#2563EB', '#1E40AF', '#60A5FA'];
      drop.style.color = colors[Math.floor(Math.random() * colors.length)];

      container.appendChild(drop);

      // Remove after animation
      setTimeout(() => {
        if (container.contains(drop)) {
          container.removeChild(drop);
        }
      }, (3 + 2) / speed * 1000);
    };

    const interval = setInterval(createBinaryDrop, 100 / density);

    return () => {
      clearInterval(interval);
      // Clean up any remaining drops
      const drops = container.querySelectorAll('.binary-drop');
      drops.forEach(drop => drop.remove());
    };
  }, [density, speed]);

  return (
    <>
      <div
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        style={{ zIndex: -1 }}
      />
      <style jsx>{`
        .binary-drop {
          position: absolute;
          top: -20px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-weight: bold;
          animation: binary-fall linear forwards;
          text-shadow: 0 0 5px currentColor;
        }

        @keyframes binary-fall {
          to {
            transform: translateY(calc(100vh + 20px));
          }
        }
      `}</style>
    </>
  );
};