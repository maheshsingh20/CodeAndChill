import { useState, useEffect } from 'react';

interface PerformanceInfo {
  isHighPerformance: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
  };
}

export const usePerformanceMode = (): PerformanceInfo => {
  const [performanceInfo, setPerformanceInfo] = useState<PerformanceInfo>({
    isHighPerformance: true
  });

  useEffect(() => {
    const detectPerformance = () => {
      let isHighPerformance = true;

      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      if (deviceMemory && deviceMemory < 4) {
        isHighPerformance = false;
      }

      // Check hardware concurrency (CPU cores)
      const hardwareConcurrency = navigator.hardwareConcurrency;
      if (hardwareConcurrency && hardwareConcurrency < 4) {
        isHighPerformance = false;
      }

      // Check network connection
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') {
          isHighPerformance = false;
        }
      }

      // Check for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      if (isMobile) {
        isHighPerformance = false;
      }

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        isHighPerformance = false;
      }

      // Check battery status (if available)
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          if (battery.level < 0.2 || battery.charging === false) {
            setPerformanceInfo(prev => ({ ...prev, isHighPerformance: false }));
          }
        });
      }

      setPerformanceInfo({
        isHighPerformance,
        deviceMemory,
        hardwareConcurrency,
        connection: connection ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink
        } : undefined
      });
    };

    detectPerformance();

    // Listen for network changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', detectPerformance);
      return () => connection.removeEventListener('change', detectPerformance);
    }
  }, []);

  return performanceInfo;
};