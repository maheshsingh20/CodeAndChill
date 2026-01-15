import React, { useEffect } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
  speed?: number;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({
  children,
  speed = 1
}) => {
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Custom smooth scroll implementation for better control
    const smoothScrollTo = (target: number, duration: number = 800) => {
      const start = window.pageYOffset;
      const distance = target - start;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-cubic)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, start + distance * easeOutCubic);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    };

    // Override default anchor link behavior
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
          smoothScrollTo(offsetTop, 800 / speed);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [speed]);

  return <>{children}</>;
};

// Hook for programmatic smooth scrolling
export const useSmoothScroll = () => {
  const scrollTo = (target: string | number, duration: number = 800) => {
    let targetPosition: number;

    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (!element) return;
      targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
    } else {
      targetPosition = target;
    }

    const start = window.pageYOffset;
    const distance = targetPosition - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, start + distance * easeOutCubic);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const scrollToTop = (duration: number = 800) => {
    scrollTo(0, duration);
  };

  return { scrollTo, scrollToTop };
};