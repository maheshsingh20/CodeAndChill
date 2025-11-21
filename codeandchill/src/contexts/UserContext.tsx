import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserService } from '@/services/userService';
import { ActivityService } from '@/services/activityService';
import { TokenManager } from '@/utils/tokenManager';

interface User {
  _id: string;
  name: string;
  email: string;
  location: string;
  occupation: string;
  bio: string;
  phone?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  skills: string[];
  joinDate: string;
  profilePicture?: string;
  totalProblemsAttempted: number;
  totalProblemsSolved: number;
  totalQuizzesTaken: number;
  totalCoursesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      achievements: boolean;
    };
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: any) => Promise<void>;
  recordActivity: (activityType: 'problem_solved' | 'quiz_completed' | 'course_completed' | 'skill_test_passed') => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = TokenManager.getToken();
      
      if (!token) {
        setUser(null);
        return;
      }

      const userData = await UserService.getProfile();
      setUser(userData.user);
      
      // Initialize activity tracking when user is loaded
      await ActivityService.initializeTracking();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await UserService.updateProfile(userData);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  };

  const updatePreferences = async (preferences: any) => {
    try {
      setError(null);
      const result = await UserService.updatePreferences(preferences);
      
      if (user) {
        setUser({
          ...user,
          preferences: result.preferences
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      throw err;
    }
  };

  const recordActivity = async (activityType: 'problem_solved' | 'quiz_completed' | 'course_completed' | 'skill_test_passed') => {
    try {
      setError(null);
      const result = await UserService.recordActivity(activityType);
      
      if (user) {
        setUser({
          ...user,
          ...result.stats,
          lastActiveDate: new Date().toISOString()
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record activity');
      console.error('Error recording activity:', err);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      setError(null);
      const result = await UserService.uploadProfilePicture(file);
      
      // Force a complete user refresh to ensure all components update
      await fetchUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload profile picture');
      throw err;
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const logout = async () => {
    try {
      // Clear user state
      setUser(null);
      setError(null);
      
      // Clear tokens using TokenManager
      TokenManager.removeToken();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Listen for auth token changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        if (e.newValue) {
          console.log('Auth token changed, fetching new user data');
          // Force clear any cached user data
          setUser(null);
          setError(null);
          // Fetch fresh user data
          fetchUser();
        } else {
          console.log('Auth token removed, clearing user');
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: UserContextType = {
    user,
    loading,
    error,
    updateUser,
    updatePreferences,
    recordActivity,
    uploadProfilePicture,
    refreshUser,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};