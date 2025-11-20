import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SessionBrowser } from '@/components/collaborative/SessionBrowser';
import { CollaborativeEditor } from '@/components/collaborative/CollaborativeEditor';
import { CollaborativeChat } from '@/components/collaborative/CollaborativeChat';
import { collaborativeService } from '@/services/collaborativeService';
import { useUser } from '@/contexts/UserContext';
// Simple notification helper
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // You can replace this with a proper toast library later
};

export const CollaborativePage: React.FC = () => {
  const { sessionToken } = useParams<{ sessionToken?: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    initializeCollaborativeService();

    return () => {
      collaborativeService.disconnect();
    };
  }, [user, navigate]);

  useEffect(() => {
    if (sessionToken && user && !currentSession) {
      handleJoinSession(sessionToken);
    }
  }, [sessionToken, user, currentSession]);

  const initializeCollaborativeService = async () => {
    try {
      setIsConnecting(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('No token found, proceeding without WebSocket connection');
        setIsConnecting(false);
        return;
      }

      // Try to connect, but don't block the UI if it fails
      setTimeout(async () => {
        try {
          await collaborativeService.connect(token);
        } catch (error) {
          console.log('WebSocket connection failed, using offline mode');
        }
      }, 100);
      
    } catch (error) {
      console.error('Failed to initialize collaborative service:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleJoinSession = async (token: string) => {
    try {
      setIsConnecting(true);
      await collaborativeService.joinSession(token);
      setCurrentSession(token);
      navigate(`/collaborative/${token}`, { replace: true });
      showNotification('Joined collaborative session!', 'success');
    } catch (error: any) {
      console.error('Failed to join session:', error);
      showNotification(error.message || 'Failed to join session', 'error');
      navigate('/collaborative', { replace: true });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLeaveSession = async () => {
    try {
      await collaborativeService.leaveSession();
      setCurrentSession(null);
      setIsChatOpen(false);
      navigate('/collaborative', { replace: true });
      showNotification('Left collaborative session', 'info');
    } catch (error) {
      console.error('Error leaving session:', error);
      // Navigate anyway
      setCurrentSession(null);
      setIsChatOpen(false);
      navigate('/collaborative', { replace: true });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-lg">Please log in to access collaborative coding</div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-lg">Connecting to collaborative service...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {currentSession ? (
          <>
            <CollaborativeEditor 
              sessionToken={currentSession} 
              onLeave={handleLeaveSession}
            />
            <CollaborativeChat 
              isOpen={isChatOpen}
              onToggle={() => setIsChatOpen(!isChatOpen)}
            />
          </>
        ) : (
          <SessionBrowser onJoinSession={handleJoinSession} />
        )}
      </div>
    </div>
  );
};