import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    // Start exit animation
    setIsVisible(false);

    // After exit animation, update children and start enter animation
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  useEffect(() => {
    // Initial mount animation
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-98'
        }
        ${className}
      `}
    >
      {displayChildren}
    </div>
  );
};

// Modal/Dialog transition component
export const ModalTransition: React.FC<{
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ isOpen, children, className = '' }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-300 ease-out
        ${isOpen
          ? 'opacity-100 backdrop-blur-sm bg-black/50'
          : 'opacity-0 backdrop-blur-none bg-black/0'
        }
      `}
    >
      <div
        className={`
          transition-all duration-300 ease-out
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
          }
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
};