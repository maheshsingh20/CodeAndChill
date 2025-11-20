import { ActivityService } from '@/services/activityService';
import { collaborativeService } from '@/services/collaborativeService';
import { STORAGE_KEYS } from '@/constants';

export const performAppCleanup = async () => {
  try {
    console.log('Performing app cleanup...');
    
    // 1. Clear localStorage first to prevent further API calls
    const keysToRemove = [
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.IS_AUTHENTICATED,
      // Add any other app-specific keys
    ];
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key ${key}:`, error);
      }
    });
    
    // 2. Cleanup activity tracking (after clearing tokens to avoid API calls)
    try {
      await ActivityService.cleanup();
    } catch (error) {
      console.log('Activity service cleanup completed (with expected errors)');
    }
    
    // 3. Disconnect collaborative service
    try {
      collaborativeService.disconnect();
    } catch (error) {
      console.error('Error disconnecting collaborative service:', error);
    }
    
    // 4. Clear any session storage
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
    
    console.log('App cleanup completed');
  } catch (error) {
    console.error('Error during app cleanup:', error);
  }
};

export const performFreshLogin = async () => {
  try {
    console.log('Preparing for fresh login...');
    
    // Only cleanup services, don't clear localStorage yet
    // (localStorage will be cleared and set by the login process)
    try {
      collaborativeService.disconnect();
    } catch (error) {
      console.error('Error disconnecting collaborative service:', error);
    }
    
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
    
    // Small delay to ensure cleanup is complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Ready for fresh login');
  } catch (error) {
    console.error('Error preparing for fresh login:', error);
  }
};