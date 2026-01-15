import React from 'react';

interface AnimatedBackgroundProps {
  className?: string;
  dotSize?: number;
  dotSpacing?: number;
  animationSpeed?: number;
  glowIntensity?: number;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = ''
}) => {
  // Animation disabled to prevent auto-refresh issues
  // Using static background instead
  return <StaticDottedBackground className={className} />;
};

// CSS-only fallback for better performance on low-end devices
export const StaticDottedBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`fixed inset-0 ${className}`}
      style={{
        background: '#000000',
        zIndex: -10,
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
          radial-gradient(circle at center, rgba(255,255,255,0.15) 1px, transparent 1px)
        `,
          backgroundSize: '30px 30px',
          animation: 'dotPulse 4s ease-in-out infinite'
        }}
      />
    </div>
  )
};