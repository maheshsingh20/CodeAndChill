import React, { useEffect, useState, useMemo } from 'react';

interface FloatingParticlesProps {
  particleCount?: number;
  className?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  particleCount = 50,
  className = ''
}) => {
  // Temporarily disabled to test auto refresh issue
  return null;

  /*
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    animationDelay: number;
    animationDuration: number;
    size: number;
    opacity: number;
  }>>([]);

  // Reduce particle count on mobile devices for better performance
  const effectiveParticleCount = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    return isMobile ? Math.floor(particleCount * 0.6) : particleCount; // Increased mobile ratio from 0.5 to 0.6
  }, [particleCount]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: effectiveParticleCount }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        animationDelay: Math.random() * 12,
        animationDuration: 8 + Math.random() * 6,
        size: 1.5 + Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.3,
      }));
      setParticles(newParticles);
    };

    generateParticles();

    // Regenerate particles less frequently to prevent performance issues
    const interval = setInterval(generateParticles, 30000); // Every 30 seconds instead of 12

    return () => clearInterval(interval);
  }, [effectiveParticleCount]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-10 ${className}`}
      style={{
        height: '100vh',
        width: '100vw',
        top: 0,
        left: 0
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="floating-particle"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, ${particle.opacity}) 0%, rgba(255, 255, 255, ${particle.opacity * 0.5}) 50%, transparent 100%)`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            zIndex: 10,
          }}
        />
      ))}
    </div>
  );
  */
};