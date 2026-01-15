import React from 'react';
import { AnimatedBackground, StaticDottedBackground } from './AnimatedBackground';
import { usePerformanceMode } from '@/hooks/usePerformanceMode';

interface PageBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'landing' | 'auth' | 'dashboard' | 'course' | 'contest';
  className?: string;
}

export const PageBackground: React.FC<PageBackgroundProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const { isHighPerformance } = usePerformanceMode();

  const getBackgroundConfig = () => {
    switch (variant) {
      case 'landing':
        return {
          dotSize: 2.5,
          dotSpacing: 35,
          animationSpeed: 0.3,
          glowIntensity: 0.4
        };
      case 'auth':
        return {
          dotSize: 2,
          dotSpacing: 25,
          animationSpeed: 0.6,
          glowIntensity: 0.5
        };
      case 'dashboard':
        return {
          dotSize: 1.5,
          dotSpacing: 30,
          animationSpeed: 0.4,
          glowIntensity: 0.3
        };
      case 'course':
        return {
          dotSize: 2,
          dotSpacing: 28,
          animationSpeed: 0.5,
          glowIntensity: 0.35
        };
      case 'contest':
        return {
          dotSize: 3,
          dotSpacing: 32,
          animationSpeed: 0.8,
          glowIntensity: 0.6
        };
      default:
        return {
          dotSize: 2,
          dotSpacing: 30,
          animationSpeed: 0.5,
          glowIntensity: 0.3
        };
    }
  };

  const config = getBackgroundConfig();

  return (
    <div className={`relative min-h-screen ${className}`}>
      {isHighPerformance ? (
        <AnimatedBackground {...config} />
      ) : (
        <StaticDottedBackground />
      )}
      {children}
    </div>
  );
};