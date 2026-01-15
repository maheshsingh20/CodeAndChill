import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TokenManager } from '@/utils/tokenManager';

interface OAuthCallbackProps {
  login: (token: string) => void;
}

export function OAuthCallback({ login }: OAuthCallbackProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/auth?error=' + error);
      return;
    }

    if (token) {
      try {
        TokenManager.setToken(token);
        login(token);
        navigate('/dashboard');
      } catch (error) {
        console.error('Token processing error:', error);
        navigate('/auth?error=token_error');
      }
    } else {
      navigate('/auth?error=no_token');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
      </div>
    </div>
  );
}