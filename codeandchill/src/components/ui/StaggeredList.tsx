import React from 'react';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'scaleUp';
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  className = '',
  itemClassName = '',
  staggerDelay = 100,
  animation = 'slideUp'
}) => {
  const { containerRef, visibleItems } = useStaggeredAnimation(children.length, staggerDelay);

  const getItemClasses = (index: number) => {
    const isVisible = visibleItems.has(index);
    const baseClasses = 'transition-all duration-600 ease-out';

    if (!isVisible) {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} opacity-0`;
        case 'slideUp':
          return `${baseClasses} opacity-0 translate-y-8`;
        case 'slideLeft':
          return `${baseClasses} opacity-0 translate-x-8`;
        case 'scaleUp':
          return `${baseClasses} opacity-0 scale-95`;
        default:
          return `${baseClasses} opacity-0`;
      }
    } else {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} opacity-100`;
        case 'slideUp':
          return `${baseClasses} opacity-100 translate-y-0`;
        case 'slideLeft':
          return `${baseClasses} opacity-100 translate-x-0`;
        case 'scaleUp':
          return `${baseClasses} opacity-100 scale-100`;
        default:
          return `${baseClasses} opacity-100`;
      }
    }
  };

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={className}
    >
      {children.map((child, index) => (
        <div
          key={index}
          className={`${getItemClasses(index)} ${itemClassName}`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};