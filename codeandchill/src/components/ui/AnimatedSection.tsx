import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'rotateIn' | 'bounceIn';
  delay?: number;
  duration?: number;
  threshold?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  duration = 600,
  threshold = 0.1
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    delay,
    triggerOnce: true
  });

  const getAnimationClasses = () => {
    const baseClasses = `transition-all duration-${duration} ease-out`;

    if (!isVisible) {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} opacity-0`;
        case 'slideUp':
          return `${baseClasses} opacity-0 translate-y-8`;
        case 'slideDown':
          return `${baseClasses} opacity-0 -translate-y-8`;
        case 'slideLeft':
          return `${baseClasses} opacity-0 translate-x-8`;
        case 'slideRight':
          return `${baseClasses} opacity-0 -translate-x-8`;
        case 'scaleUp':
          return `${baseClasses} opacity-0 scale-95`;
        case 'rotateIn':
          return `${baseClasses} opacity-0 rotate-3 scale-95`;
        case 'bounceIn':
          return `${baseClasses} opacity-0 scale-50`;
        default:
          return `${baseClasses} opacity-0`;
      }
    } else {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} opacity-100`;
        case 'slideUp':
          return `${baseClasses} opacity-100 translate-y-0`;
        case 'slideDown':
          return `${baseClasses} opacity-100 translate-y-0`;
        case 'slideLeft':
          return `${baseClasses} opacity-100 translate-x-0`;
        case 'slideRight':
          return `${baseClasses} opacity-100 translate-x-0`;
        case 'scaleUp':
          return `${baseClasses} opacity-100 scale-100`;
        case 'rotateIn':
          return `${baseClasses} opacity-100 rotate-0 scale-100`;
        case 'bounceIn':
          return `${baseClasses} opacity-100 scale-100 animate-bounce-in`;
        default:
          return `${baseClasses} opacity-100`;
      }
    }
  };

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  );
};