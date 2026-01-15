import { ActivityService } from '@/services/activityService';
import { STORAGE_KEYS } from '@/constants';

export const performAppCleanup = async () => {
  try {
    console.log('Performing app cleanup...');
    
    // 1. Clear localStorage first to prevent further API calls
    const keysToRemove = [
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.IS_AUTHENTICATED,
      'token', // Old token key
      'user', // Cached user data
      'userPreferences', // User preferences
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
    
    // Clear all old tokens and user data
    const keysToRemove = [
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.IS_AUTHENTICATED,
      'token', // Old token key
      'user', // Cached user data
      'userPreferences', // User preferences
    ];
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key ${key}:`, error);
      }
    });
    
    // Cleanup services
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