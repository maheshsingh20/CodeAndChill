import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'rotate' | 'none';
  scrollAnimation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleUp';
  delay?: number;
  clickable?: boolean;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  hoverEffect = 'lift',
  scrollAnimation = 'slideUp',
  delay = 0,
  clickable = false,
  onClick
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    delay,
    threshold: 0.1,
    triggerOnce: true
  });

  const getHoverClasses = () => {
    switch (hoverEffect) {
      case 'lift':
        return 'hover:transform hover:-translate-y-2 hover:shadow-2xl';
      case 'scale':
        return 'hover:transform hover:scale-105';
      case 'glow':
        return 'hover:shadow-lg hover:shadow-blue-500/25';
      case 'rotate':
        return 'hover:transform hover:rotate-1 hover:scale-105';
      case 'none':
      default:
        return '';
    }
  };

  const getScrollAnimationClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';

    if (!isVisible) {
      switch (scrollAnimation) {
        case 'fadeIn':
          return `${baseClasses} opacity-0`;
        case 'slideUp':
          return `${baseClasses} opacity-0 translate-y-12`;
        case 'slideLeft':
          return `${baseClasses} opacity-0 translate-x-12`;
        case 'slideRight':
          return `${baseClasses} opacity-0 -translate-x-12`;
        case 'scaleUp':
          return `${baseClasses} opacity-0 scale-90`;
        default:
          return `${baseClasses} opacity-0`;
      }
    } else {
      return `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100`;
    }
  };

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`
        ${getScrollAnimationClasses()}
        ${getHoverClasses()}
        ${clickable ? 'cursor-pointer' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </div>
  );
};

// Specialized card variants
export const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}> = ({ icon, title, description, className = '', delay = 0 }) => {
  return (
    <AnimatedCard
      scrollAnimation="slideUp"
      hoverEffect="lift"
      delay={delay}
      className={`
        bg-gradient-to-br from-gray-800/50 to-gray-900/50 
        backdrop-blur-sm border border-gray-700/50 
        rounded-xl p-6 text-center group
        ${className}
      `}
    >
      <div className="mb-4 flex justify-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
        {description}
      </p>
    </AnimatedCard>
  );
};

export const CourseCard: React.FC<{
  title: string;
  description: string;
  image?: string;
  progress?: number;
  className?: string;
  delay?: number;
  onClick?: () => void;
}> = ({ title, description, image, progress, className = '', delay = 0, onClick }) => {
  return (
    <AnimatedCard
      scrollAnimation="scaleUp"
      hoverEffect="lift"
      delay={delay}
      clickable={!!onClick}
      onClick={onClick}
      className={`
        bg-gradient-to-br from-gray-800/60 to-gray-900/60 
        backdrop-blur-sm border border-gray-700/50 
        rounded-xl overflow-hidden group
        ${className}
      `}
    >
      {image && (
        <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>

        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-blue-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};