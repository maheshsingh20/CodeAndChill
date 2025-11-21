import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { collaborativeService } from '@/services/collaborativeService';
import { Zap, Wifi, WifiOff, Users, MessageCircle, Code, Settings } from 'lucide-react';

export const CollaborativeTest: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('');
  const [sessionTitle, setSessionTitle] = useState('Test Session');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [sessionToken, setSessionToken] = useState('');

  useEffect(() => {
    // Setup event listeners
    collaborativeService.on('session-joined', handleSessionJoined);
    collaborativeService.on('user-joined', handleUserJoined);
    collaborativeService.on('user-left', handleUserLeft);
    collaborativeService.on('chat-message', handleChatMessage);
    collaborativeService.on('language-changed', handleLanguageChanged);
    collaborativeService.on('code-changed', handleCodeChanged);
    collaborativeService.on('error', handleError);

    return () => {
      collaborativeService.off('session-joined', handleSessionJoined);
      collaborativeService.off('user-joined', handleUserJoined);
      collaborativeService.off('user-left', handleUserLeft);
      collaborativeService.off('chat-message', handleChatMessage);
      collaborativeService.off('language-changed', handleLanguageChanged);
      collaborativeService.off('code-changed', handleCodeChanged);
      collaborativeService.off('error', handleError);
    };
  }, []);

  const handleSessionJoined = (data: any) => {
    setCurrentSession(data);
    addMessage(`Joined session: ${data.title || 'Unknown'}`);
  };

  const handleUserJoined = (data: any) => {
    addMessage(`User joined: ${data.username}`);
  };

  const handleUserLeft = (data: any) => {
    addMessage(`User left: ${data.username}`);
  };

  const handleChatMessage = (data: any) => {
    addMessage(`Chat - ${data.username}: ${data.message}`);
  };

  const handleLanguageChanged = (data: any) => {
    addMessage(`Language changed to ${data.language} by ${data.changedBy}`);
    setSelectedLanguage(data.language);
  };

  const handleCodeChanged = (data: any) => {
    addMessage(`Code updated by ${data.username}`);
  };

  const handleError = (error: any) => {
    addMessage(`Error: ${error.message || JSON.stringify(error)}`);
  };

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const connectToService = async () => {
    setIsConnecting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await collaborativeService.connect(token);
      setIsConnected(true);
      addMessage('Connected to collaborative service');
    } catch (error: any) {
      addMessage(`Connection failed: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const createSession = async () => {
    try {
      const session = await collaborativeService.createSession({
        title: sessionTitle,
        description: 'Test session for debugging',
        language: selectedLanguage,
        isPublic: true,
        maxParticipants: 10,
        settings: {
          allowEdit: 'all-participants',
          allowChat: true,
          allowVoice: false,
          theme: 'dark',
          fontSize: 14
        }
      });

      setCurrentSession(session);
      setSessionToken(session.sessionToken);
      addMessage(`Created session: ${session.title} (${session.sessionToken})`);
    } catch (error: any) {
      addMessage(`Failed to create session: ${error.message}`);
    }
  };

  const joinSession = async () => {
    if (!sessionToken.trim()) {
      addMessage('Please enter a session token');
      return;
    }

    try {
      const session = await collaborativeService.joinSession(sessionToken.trim());
      setCurrentSession(session);
      addMessage(`Joined session: ${session.title}`);
    } catch (error: any) {
      addMessage(`Failed to join session: ${error.message}`);
    }
  };

  const sendChatMessage = async () => {
    if (!testMessage.trim() || !currentSession) return;

    try {
      await collaborativeService.sendChatMessage(testMessage);
      setTestMessage('');
      addMessage(`Sent message: ${testMessage}`);
    } catch (error: any) {
      addMessage(`Failed to send message: ${error.message}`);
    }
  };

  const changeLanguage = () => {
    if (!currentSession) return;

    try {
      collaborativeService.changeLanguage(selectedLanguage);
      addMessage(`Changing language to: ${selectedLanguage}`);
    } catch (error: any) {
      addMessage(`Failed to change language: ${error.message}`);
    }
  };

  const leaveSession = async () => {
    try {
      await collaborativeService.leaveSession();
      setCurrentSession(null);
      setSessionToken('');
      addMessage('Left session');
    } catch (error: any) {
      addMessage(`Failed to leave session: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Collaborative Features Test</span>
            <Badge variant={isConnected ? "default" : "destructive"} className="ml-auto">
              {isConnected ? (
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
          {/* Connection */}
          <div className="flex space-x-2">
            <Button 
              onClick={connectToService} 
              disabled={isConnecting || isConnected}
              variant={isConnected ? "secondary" : "default"}
            >
              {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect'}
            </Button>
            <Button 
              onClick={() => {
                collaborativeService.disconnect();
                setIsConnected(false);
                setCurrentSession(null);
                addMessage('Disconnected');
              }}
              disabled={!isConnected}
              variant="outline"
            >
              Disconnect
            </Button>
          </div>

          {/* Session Management */}
          {isConnected && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Session Management
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Create Session */}
                <div className="space-y-2">
                  <Input
                    placeholder="Session title"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                  />
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={createSession} className="w-full">
                    Create Session
                  </Button>
                </div>

                {/* Join Session */}
                <div className="space-y-2">
                  <Input
                    placeholder="Session token"
                    value={sessionToken}
                    onChange={(e) => setSessionToken(e.target.value)}
                  />
                  <Button onClick={joinSession} className="w-full" variant="outline">
                    Join Session
                  </Button>
                </div>
              </div>

              {/* Current Session */}
              {currentSession && (
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-medium">Current Session:</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <p><strong>Title:</strong> {currentSession.title}</p>
                    <p><strong>Token:</strong> {currentSession.sessionToken}</p>
                    <p><strong>Language:</strong> {currentSession.language}</p>
                    <p><strong>Participants:</strong> {currentSession.participants?.length || 0}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={changeLanguage} size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Change Language
                    </Button>
                    <Button onClick={leaveSession} size="sm" variant="destructive">
                      Leave Session
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Test */}
          {currentSession && (
            <div className="space-y-2 border-t pt-4">
              <h3 className="font-semibold flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Test
              </h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Test message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <Button onClick={sendChatMessage}>Send</Button>
              </div>
            </div>
          )}

          {/* Messages Log */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Event Log:</h3>
            <div className="bg-muted/30 p-3 rounded-lg max-h-64 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm">No events yet...</p>
              ) : (
                <div className="space-y-1">
                  {messages.map((message, index) => (
                    <div key={index} className="text-sm font-mono">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborativeTest;