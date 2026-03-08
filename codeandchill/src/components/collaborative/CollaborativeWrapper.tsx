import { useEffect, useState } from 'react';
import { CollaborativeCodingPage } from '@/pages/CollaborativeCodingPage';
import { TokenManager } from '@/utils/tokenManager';
import { useNavigate } from 'react-router-dom';

export function CollaborativeWrapper() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      console.log('CollaborativeWrapper: Loading user data...');
      try {
        const authToken = TokenManager.getToken();
        console.log('CollaborativeWrapper: Token exists:', !!authToken);

        if (!authToken) {
          console.log('No auth token found, redirecting to auth');
          navigate('/auth');
          return;
        }

        setToken(authToken);

        // Try to get user from localStorage first
        const userStr = localStorage.getItem('user');
        console.log('CollaborativeWrapper: User in localStorage:', !!userStr);

        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            console.log('CollaborativeWrapper: Parsed user:', userData);

            // Handle nested user object
            const user = userData.user || userData;
            console.log('CollaborativeWrapper: Actual user object:', user);

            const extractedUserId = user._id || user.id || '';
            const extractedUserName = user.name || 'User';
            console.log('CollaborativeWrapper: Extracted userId:', extractedUserId, 'userName:', extractedUserName);
            setUserId(extractedUserId);
            setUserName(extractedUserName);
            setLoading(false);
            console.log('CollaborativeWrapper: User loaded from localStorage');
            return;
          } catch (e) {
            console.error('Error parsing user from localStorage:', e);
          }
        }

        // If not in localStorage, fetch from API
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        console.log('CollaborativeWrapper: Fetching from API:', `${API_URL}/user/profile`);

        const response = await fetch(`${API_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('CollaborativeWrapper: User data from API:', userData);
          setUserId(userData._id || userData.id || '');
          setUserName(userData.name || 'User');
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (response.status === 401) {
          console.log('Token invalid, redirecting to auth');
          TokenManager.clearToken();
          navigate('/auth');
          return;
        } else {
          // If API fails but we have a token, try to decode it
          console.log('API failed, trying to decode token');
          try {
            const payload = JSON.parse(atob(authToken.split('.')[1]));
            console.log('CollaborativeWrapper: Decoded token payload:', payload);
            setUserId(payload.userId || '');
            setUserName('User');
          } catch (e) {
            console.error('Error decoding token:', e);
            navigate('/auth');
            return;
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // On error, try to use token payload
        const authToken = TokenManager.getToken();
        if (authToken) {
          try {
            const payload = JSON.parse(atob(authToken.split('.')[1]));
            console.log('CollaborativeWrapper: Decoded token on error:', payload);
            setUserId(payload.userId || '');
            setUserName('User');
            setToken(authToken);
          } catch (e) {
            console.error('Error decoding token:', e);
            navigate('/auth');
            return;
          }
        }
      } finally {
        console.log('CollaborativeWrapper: Setting loading to false');
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  console.log('CollaborativeWrapper: Rendering, loading:', loading, 'userId:', userId, 'token:', !!token);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId || !token) {
    console.log('CollaborativeWrapper: No userId or token, should redirect');
    return null; // Will redirect to auth
  }

  console.log('CollaborativeWrapper: Rendering CollaborativeCodingPage');
  return <CollaborativeCodingPage userId={userId} userName={userName} token={token} />;
}
