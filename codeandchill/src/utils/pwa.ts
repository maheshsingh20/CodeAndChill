// PWA utilities for service worker registration and management
import { API_BASE_URL } from '@/constants';

interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAManager {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isInstalled = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Check if already installed
    this.isInstalled = this.checkIfInstalled();

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as PWAInstallPrompt;
      this.notifyInstallAvailable();
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notifyInstalled();
    });

    // Register service worker
    await this.registerServiceWorker();
  }

  private checkIfInstalled(): boolean {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    // Check if running as PWA on mobile
    if ((window.navigator as any).standalone === true) {
      return true;
    }

    return false;
  }

  private async registerServiceWorker(): Promise<void> {
    // Service worker disabled - not needed for this application
    console.log('Service Worker: Disabled');
    return;
  }

  // Public methods
  public async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during app installation:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  public canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  public isAppInstalled(): boolean {
    return this.isInstalled;
  }

  public async updateApp(): Promise<void> {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      // Removed auto refresh - let user manually refresh if needed
      console.log('App update applied - please refresh manually if needed');
    }
  }

  public async cacheForOffline(courseId: string): Promise<void> {
    if (this.registration?.active) {
      this.registration.active.postMessage({
        type: 'CACHE_COURSE',
        courseId
      });
    }
  }

  public async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  public async subscribeToNotifications(): Promise<PushSubscription | null> {
    if (!this.registration) {
      return null;
    }

    try {
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey ? this.urlBase64ToUint8Array(vapidKey) as any : undefined
      });

      // Send subscription to server
      await fetch(`${API_BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(subscription)
      });

      return subscription;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Event handlers (can be overridden)
  private notifyInstallAvailable(): void {
    console.log('PWA install available');
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  }

  private notifyInstalled(): void {
    console.log('PWA installed');
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  }

  private notifyUpdateAvailable(): void {
    console.log('PWA update available');
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }
}

// Singleton instance
export const pwaManager = new PWAManager();

import { useState, useEffect } from 'react';

// React hook for PWA functionality
export const usePWA = () => {
  const [canInstall, setCanInstall] = useState(pwaManager.canInstall());
  const [isInstalled, setIsInstalled] = useState(pwaManager.isAppInstalled());
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const handleInstallAvailable = () => setCanInstall(true);
    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };
    const handleUpdateAvailable = () => setUpdateAvailable(true);

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-installed', handleInstalled);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  return {
    canInstall,
    isInstalled,
    updateAvailable,
    installApp: () => pwaManager.installApp(),
    updateApp: () => pwaManager.updateApp(),
    cacheForOffline: (courseId: string) => pwaManager.cacheForOffline(courseId),
    requestNotificationPermission: () => pwaManager.requestNotificationPermission(),
    subscribeToNotifications: () => pwaManager.subscribeToNotifications()
  };
};

// Utility functions
export const isOnline = (): boolean => navigator.onLine;

export const onNetworkChange = (callback: (online: boolean) => void): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

export default pwaManager;