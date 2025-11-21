import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import { Zap, Wifi, WifiOff, Users, MessageCircle } from 'lucide-react';

export const RealTimeTest: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('');
  const { socket, connected, connecting, error, emit, on, off } = useSocket({
    autoConnect: true,
    token: localStorage.getItem('token') || undefined
  });

  useEffect(() => {
    if (!socket || !connected) return;

    const handleTestMessage = (data: any) => {
      setMessages(prev => [...prev, `Received: ${JSON.stringify(data)}`]);
    };

    on('test-response', handleTestMessage);
    on('notification', (data: any) => {
      setMessages(prev => [...prev, `Notification: ${data.message}`]);
    });

    return () => {
      off('test-response', handleTestMessage);
      off('notification');
    };
  }, [socket, connected, on, off]);

  const sendTestMessage = () => {
    if (connected && testMessage.trim()) {
      emit('test-message', { message: testMessage, timestamp: new Date() });
      setMessages(prev => [...prev, `Sent: ${testMessage}`]);
      setTestMessage('');
    }
  };

  const testProgressUpdate = async () => {
    try {
      const response = await fetch('/api/realtime/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId: 'test-course-123',
          lessonId: 'test-lesson-456',
          progressData: { totalLessons: 10 },
          timeSpent: 5
        })
      });
      
      const result = await response.json();
      setMessages(prev => [...prev, `Progress API: ${JSON.stringify(result)}`]);
    } catch (error) {
      setMessages(prev => [...prev, `Progress Error: ${error}`]);
    }
  };

  const testNotification = async () => {
    try {
      const response = await fetch('/api/realtime/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: 'test-user',
          type: 'info',
          title: 'Test Notification',
          message: 'This is a test notification from the real-time system!'
        })
      });
      
      const result = await response.json();
      setMessages(prev => [...prev, `Notification API: ${JSON.stringify(result)}`]);
    } catch (error) {
      setMessages(prev => [...prev, `Notification Error: ${error}`]);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Real-Time Features Test</span>
          <Badge variant={connected ? "default" : "destructive"} className="ml-auto">
            {connected ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : connecting ? (
              <>
                <Users className="h-3 w-3 mr-1" />
                Connecting...
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
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
            <strong>Connection Error:</strong> {error}
          </div>
        )}

        <div className="flex space-x-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test message..."
            className="flex-1 px-3 py-2 border rounded-lg"
            onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
          />
          <Button onClick={sendTestMessage} disabled={!connected}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button onClick={testProgressUpdate} variant="outline" size="sm">
            Test Progress Update
          </Button>
          <Button onClick={testNotification} variant="outline" size="sm">
            Test Notification
          </Button>
        </div>

        <div className="border rounded-lg p-3 bg-muted/30 max-h-64 overflow-y-auto">
          <h4 className="font-semibold mb-2">Real-Time Messages:</h4>
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-sm">No messages yet...</p>
          ) : (
            <div className="space-y-1">
              {messages.map((message, index) => (
                <div key={index} className="text-sm font-mono bg-background p-2 rounded border">
                  {message}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>Socket ID:</strong> {socket?.id || 'Not connected'}</p>
          <p><strong>Status:</strong> {connected ? 'Connected' : connecting ? 'Connecting' : 'Disconnected'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeTest;