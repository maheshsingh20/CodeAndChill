import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// import { Textarea } from '@/components/ui/textarea';
import { io, Socket } from 'socket.io-client';
import { Zap, Wifi, WifiOff, MessageCircle, Code, Users, Settings } from 'lucide-react';

export const DebugCollaborativeTest: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [sessionToken, setSessionToken] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  const [code, setCode] = useState('console.log("Hello World");');
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const addMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(`[DEBUG] ${timestamp}: ${message}`);
  };

  const connectSocket = () => {
    if (socket) {
      socket.disconnect();
    }

    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      addMessage('ERROR: No authentication token found');
      return;
    }

    addMessage(`Connecting with token: ${token.substring(0, 20)}...`);

    const newSocket = io('http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 10000
    });

    newSocket.on('connect', () => {
      addMessage(`✅ Socket connected: ${newSocket.id}`);
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      addMessage(`❌ Socket disconnected: ${reason}`);
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      addMessage(`❌ Connection error: ${error.message}`);
      setConnected(false);
    });

    // Session events
    newSocket.on('session-state', (data) => {
      addMessage(`📋 Session state received: ${JSON.stringify(data, null, 2)}`);
      setSessionData(data);
      if (data.language) setCurrentLanguage(data.language);
      if (data.code) setCode(data.code);
    });

    newSocket.on('user-joined', (data) => {
      addMessage(`👤 User joined: ${data.username} (${data.userId})`);
    });

    newSocket.on('user-left', (data) => {
      addMessage(`👤 User left: ${data.username} (${data.userId})`);
    });

    // Language events
    newSocket.on('language-update', (data) => {
      addMessage(`🔧 Language changed to ${data.language} by ${data.username}`);
      setCurrentLanguage(data.language);
    });

    // Chat events
    newSocket.on('chat-message', (data) => {
      addMessage(`💬 Chat from ${data.username}: ${data.message}`);
    });

    // Code events
    newSocket.on('code-update', (data) => {
      addMessage(`📝 Code updated by ${data.username}`);
      if (data.code) setCode(data.code);
    });

    // Error events
    newSocket.on('error', (data) => {
      addMessage(`❌ Socket error: ${JSON.stringify(data)}`);
    });

    setSocket(newSocket);
  };

  const createSession = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      addMessage('🔄 Creating session...');
      
      const response = await fetch('http://localhost:3001/api/collaborative/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Debug Test Session',
          description: 'Testing collaborative features',
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
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setSessionToken(data.session.sessionToken);
      addMessage(`✅ Session created: ${data.session.sessionToken}`);
      addMessage(`📊 Session details: ${JSON.stringify(data.session, null, 2)}`);
    } catch (error: any) {
      addMessage(`❌ Create session failed: ${error.message}`);
    }
  };

  const joinSessionREST = async () => {
    if (!sessionToken.trim()) {
      addMessage('❌ No session token provided');
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      addMessage(`🔄 Joining session ${sessionToken} via REST API...`);
      
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
      addMessage(`✅ REST join successful. Participants: ${data.session.participants.length}`);
      addMessage(`📊 Session data: ${JSON.stringify(data.session, null, 2)}`);
      setSessionData(data.session);
    } catch (error: any) {
      addMessage(`❌ REST join failed: ${error.message}`);
    }
  };

  const joinSessionSocket = () => {
    if (!socket || !connected) {
      addMessage('❌ Socket not connected');
      return;
    }

    if (!sessionToken.trim()) {
      addMessage('❌ No session token provided');
      return;
    }

    addMessage(`🔄 Joining session ${sessionToken} via Socket...`);
    socket.emit('join-collaborative-session', { sessionToken: sessionToken.trim() });
  };

  const debugSession = async () => {
    if (!sessionToken.trim()) {
      addMessage('❌ No session token to debug');
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
      addMessage(`🔍 DEBUG INFO: ${JSON.stringify(data.debug, null, 2)}`);
    } catch (error: any) {
      addMessage(`❌ Debug failed: ${error.message}`);
    }
  };

  const changeLanguage = (newLanguage: string) => {
    if (!socket || !connected) {
      addMessage('❌ Socket not connected');
      return;
    }

    if (!sessionToken.trim()) {
      addMessage('❌ No session token');
      return;
    }

    addMessage(`🔄 Changing language to ${newLanguage}...`);
    socket.emit('language-change', {
      sessionToken: sessionToken.trim(),
      language: newLanguage
    });
  };

  const sendChatMessage = () => {
    if (!socket || !connected) {
      addMessage('❌ Socket not connected');
      return;
    }

    if (!chatMessage.trim() || !sessionToken.trim()) {
      addMessage('❌ No message or session token');
      return;
    }

    addMessage(`🔄 Sending chat: ${chatMessage}`);
    socket.emit('session-chat', {
      sessionToken: sessionToken.trim(),
      message: chatMessage.trim()
    });
    setChatMessage('');
  };

  const updateCode = () => {
    if (!socket || !connected) {
      addMessage('❌ Socket not connected');
      return;
    }

    if (!sessionToken.trim()) {
      addMessage('❌ No session token');
      return;
    }

    addMessage(`🔄 Updating code: ${code.substring(0, 50)}...`);
    socket.emit('code-change', {
      sessionToken: sessionToken.trim(),
      code: code,
      changes: {
        operation: 'replace',
        position: { line: 0, column: 0 },
        content: code,
        length: 0
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Debug Collaborative Test</span>
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
        <CardContent className="space-y-6">
          {/* Connection */}
          <div className="space-y-2">
            <h3 className="font-semibold">1. Connection</h3>
            <div className="flex space-x-2">
              <Button onClick={connectSocket} variant={connected ? "secondary" : "default"}>
                {connected ? 'Reconnect' : 'Connect Socket'}
              </Button>
              <Button 
                onClick={() => {
                  if (socket) socket.disconnect();
                  setSocket(null);
                  setConnected(false);
                }}
                variant="outline"
              >
                Disconnect
              </Button>
            </div>
          </div>

          {/* Session Management */}
          <div className="space-y-2">
            <h3 className="font-semibold">2. Session Management</h3>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Session token"
                value={sessionToken}
                onChange={(e) => setSessionToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={debugSession} variant="outline" size="sm">
                Debug
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button onClick={createSession} variant="outline">
                Create Session
              </Button>
              <Button onClick={joinSessionREST} variant="outline">
                Join (REST)
              </Button>
              <Button onClick={joinSessionSocket} variant="outline">
                Join (Socket)
              </Button>
            </div>
          </div>

          {/* Language Testing */}
          <div className="space-y-2">
            <h3 className="font-semibold">3. Language: {currentLanguage}</h3>
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

          {/* Chat Testing */}
          <div className="space-y-2">
            <h3 className="font-semibold">4. Chat</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Chat message"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                className="flex-1"
              />
              <Button onClick={sendChatMessage}>Send</Button>
            </div>
          </div>

          {/* Code Testing */}
          <div className="space-y-2">
            <h3 className="font-semibold">5. Code</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Code to send"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={updateCode}>Update Code</Button>
            </div>
          </div>

          {/* Session Data */}
          {sessionData && (
            <div className="space-y-2">
              <h3 className="font-semibold">6. Current Session Data</h3>
              <pre className="bg-muted p-2 rounded text-xs overflow-auto h-32">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
          )}

          {/* Messages Log */}
          <div className="space-y-2">
            <h3 className="font-semibold">7. Event Log</h3>
            <div className="bg-muted/30 p-3 rounded-lg max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm">No events yet...</p>
              ) : (
                <div className="space-y-1">
                  {messages.map((message, index) => (
                    <div key={index} className="text-xs font-mono break-words">
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
            <p><strong>Token:</strong> {(localStorage.getItem('token') || localStorage.getItem('authToken') || 'None').substring(0, 30)}...</p>
            <p><strong>Session Token:</strong> {sessionToken || 'None'}</p>
            <p><strong>Current Language:</strong> {currentLanguage}</p>
            <p><strong>Participants:</strong> {sessionData?.participants?.length || 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugCollaborativeTest;