import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import { Zap, Wifi, WifiOff, MessageCircle, Code } from 'lucide-react';

export const SimpleCollaborativeTest: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [sessionToken, setSessionToken] = useState('test-session-123');
  const [chatMessage, setChatMessage] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  const [code, setCode] = useState('console.log("Hello World");');

  const { socket, connected, emit, on, off } = useSocket({
    autoConnect: true,
    token: localStorage.getItem('token') || localStorage.getItem('authToken') || undefined
  });

  useEffect(() => {
    if (!socket || !connected) return;

    const handleSessionState = (data: any) => {
      addMessage(`Session state received: ${JSON.stringify(data)}`);
      if (data.language) setCurrentLanguage(data.language);
      if (data.code) setCode(data.code);
    };

    const handleChatMessage = (data: any) => {
      addMessage(`Chat: ${data.username}: ${data.message}`);
    };

    const handleLanguageUpdate = (data: any) => {
      addMessage(`Language changed to ${data.language} by ${data.username}`);
      setCurrentLanguage(data.language);
    };

    const handleCodeUpdate = (data: any) => {
      addMessage(`Code updated by ${data.username}`);
      if (data.code) setCode(data.code);
    };

    const handleUserJoined = (data: any) => {
      addMessage(`User joined: ${data.username}`);
    };

    const handleUserLeft = (data: any) => {
      addMessage(`User left: ${data.username}`);
    };

    const handleError = (data: any) => {
      addMessage(`ERROR: ${data.message || JSON.stringify(data)}`);
    };

    on('session-state', handleSessionState);
    on('chat-message', handleChatMessage);
    on('language-update', handleLanguageUpdate);
    on('code-update', handleCodeUpdate);
    on('user-joined', handleUserJoined);
    on('user-left', handleUserLeft);
    on('error', handleError);

    return () => {
      off('session-state', handleSessionState);
      off('chat-message', handleChatMessage);
      off('language-update', handleLanguageUpdate);
      off('code-update', handleCodeUpdate);
      off('user-joined', handleUserJoined);
      off('user-left', handleUserLeft);
      off('error', handleError);
    };
  }, [socket, connected, on, off]);

  const addMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, `${timestamp}: ${message}`]);
  };

  const joinSession = async () => {
    if (!sessionToken.trim()) {
      addMessage('No session token provided');
      return;
    }

    try {
      // First join via REST API
      addMessage(`Step 1: Joining session ${sessionToken} via REST API...`);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/collaborative/sessions/${sessionToken.trim()}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      addMessage(`Step 1 SUCCESS: Joined session via REST API. Participants: ${data.session.participants.length}`);

      // Then join via WebSocket
      if (!connected) {
        addMessage('Step 2 FAILED: Not connected to WebSocket');
        return;
      }

      addMessage(`Step 2: Joining session ${sessionToken} via WebSocket...`);
      emit('join-collaborative-session', { sessionToken: sessionToken.trim() });

    } catch (error: any) {
      addMessage(`Step 1 FAILED: ${error.message}`);
    }
  };

  const sendChat = () => {
    if (!connected || !chatMessage.trim() || !sessionToken) {
      addMessage('Cannot send chat: not connected, no message, or no session');
      return;
    }

    emit('session-chat', {
      sessionToken: sessionToken.trim(),
      message: chatMessage.trim()
    });
    addMessage(`Sending chat: ${chatMessage}`);
    setChatMessage('');
  };

  const changeLanguage = (newLanguage: string) => {
    if (!connected || !sessionToken) {
      addMessage('Cannot change language: not connected or no session');
      return;
    }

    emit('language-change', {
      sessionToken: sessionToken.trim(),
      language: newLanguage
    });
    addMessage(`Changing language to: ${newLanguage}`);
  };

  const updateCode = () => {
    if (!connected || !sessionToken) {
      addMessage('Cannot update code: not connected or no session');
      return;
    }

    emit('code-change', {
      sessionToken: sessionToken.trim(),
      code: code,
      changes: {
        operation: 'replace',
        position: { line: 0, column: 0 },
        content: code,
        length: 0
      }
    });
    addMessage(`Updating code: ${code.substring(0, 50)}...`);
  };

  const checkSessionDebug = async () => {
    if (!sessionToken.trim()) {
      addMessage('No session token to debug');
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/collaborative/sessions/${sessionToken.trim()}/debug`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      addMessage(`DEBUG: ${JSON.stringify(data.debug, null, 2)}`);
    } catch (error: any) {
      addMessage(`Debug failed: ${error.message}`);
    }
  };

  const createTestSession = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/collaborative/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Test Session',
          description: 'Simple test session',
          language: 'javascript',
          isPublic: true,
          maxParticipants: 10,
          settings: {
            allowEdit: 'all-participants',
            allowChat: true,
            allowVoice: false,
            theme: 'dark',
            fontSize: 14
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setSessionToken(data.session.sessionToken);
      addMessage(`Created session: ${data.session.sessionToken}`);
    } catch (error: any) {
      addMessage(`Failed to create session: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Simple Collaborative Test</span>
            <Badge variant={connected ? "default" : "destructive"} className="ml-auto">
              {connected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Session Management */}
          <div className="space-y-2">
            <h3 className="font-semibold">Session Management</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Session token"
                value={sessionToken}
                onChange={(e) => setSessionToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={createTestSession} variant="outline">
                Create Test Session
              </Button>
              <Button onClick={joinSession}>
                Join Session
              </Button>
              <Button onClick={checkSessionDebug} variant="outline" size="sm">
                Debug Session
              </Button>
            </div>
          </div>

          {/* Language Change */}
          <div className="space-y-2">
            <h3 className="font-semibold">Language: {currentLanguage}</h3>
            <div className="flex space-x-2">
              {['javascript', 'typescript', 'python', 'java', 'cpp'].map(lang => (
                <Button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  variant={currentLanguage === lang ? "default" : "outline"}
                  size="sm"
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>

          {/* Code Update */}
          <div className="space-y-2">
            <h3 className="font-semibold">Code</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Code to send"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={updateCode} disabled={!connected}>
                Update Code
              </Button>
            </div>
          </div>

          {/* Chat */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Chat message"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChat()}
                className="flex-1"
              />
              <Button onClick={sendChat} disabled={!connected}>
                Send
              </Button>
            </div>
          </div>

          {/* Messages Log */}
          <div className="space-y-2">
            <h3 className="font-semibold">Event Log</h3>
            <div className="bg-muted/30 p-3 rounded-lg max-h-64 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm">No events yet...</p>
              ) : (
                <div className="space-y-1">
                  {messages.map((message, index) => (
                    <div key={index} className="text-sm font-mono break-words">
                      {message}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button 
              onClick={() => setMessages([])} 
              size="sm" 
              variant="outline"
            >
              Clear Log
            </Button>
          </div>

          {/* Debug Info */}
          <div className="text-xs text-muted-foreground border-t pt-2">
            <p><strong>Socket ID:</strong> {socket?.id || 'Not connected'}</p>
            <p><strong>Token:</strong> {(localStorage.getItem('token') || localStorage.getItem('authToken') || 'None').substring(0, 20)}...</p>
            <p><strong>Session Token:</strong> {sessionToken}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleCollaborativeTest;