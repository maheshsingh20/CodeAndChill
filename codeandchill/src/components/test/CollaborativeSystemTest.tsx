import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { collaborativeService } from '@/services/collaborativeService';
import { useUser } from '@/contexts/UserContext';

export const CollaborativeSystemTest: React.FC = () => {
  const { user } = useUser();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [createdSession, setCreatedSession] = useState<any>(null);

  const addResult = (test: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      timestamp: new Date().toISOString()
    }]);
  };

  const runFullTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Check authentication
      addResult('Authentication', 'info', 'Checking user authentication...');
      if (!user) {
        addResult('Authentication', 'error', 'User not authenticated');
        return;
      }
      addResult('Authentication', 'success', `User authenticated: ${user.name}`);

      // Test 2: Check WebSocket connection
      addResult('WebSocket', 'info', 'Testing WebSocket connection...');
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          addResult('WebSocket', 'error', 'No auth token found');
          return;
        }
        
        await collaborativeService.connect(token);
        addResult('WebSocket', 'success', 'WebSocket connected successfully');
      } catch (error: any) {
        addResult('WebSocket', 'error', `WebSocket connection failed: ${error.message}`);
      }

      // Test 3: Create session
      addResult('Create Session', 'info', 'Creating test session...');
      try {
        const session = await collaborativeService.createSession({
          title: 'Test Session ' + Date.now(),
          description: 'Automated test session',
          language: 'javascript',
          isPublic: false,
          maxParticipants: 5
        });
        setCreatedSession(session);
        addResult('Create Session', 'success', 'Session created successfully', session);
      } catch (error: any) {
        addResult('Create Session', 'error', `Failed to create session: ${error.message}`);
        return;
      }

      // Test 4: Get my sessions
      addResult('Get Sessions', 'info', 'Fetching user sessions...');
      try {
        const sessions = await collaborativeService.getMySessions();
        addResult('Get Sessions', 'success', `Found ${sessions.length} sessions`, sessions);
      } catch (error: any) {
        addResult('Get Sessions', 'error', `Failed to get sessions: ${error.message}`);
      }

      // Test 5: Get public sessions
      addResult('Public Sessions', 'info', 'Fetching public sessions...');
      try {
        const publicData = await collaborativeService.getPublicSessions();
        addResult('Public Sessions', 'success', `Found ${publicData.sessions.length} public sessions`, publicData);
      } catch (error: any) {
        addResult('Public Sessions', 'error', `Failed to get public sessions: ${error.message}`);
      }

      // Test 6: Join session (if we created one)
      if (createdSession) {
        addResult('Join Session', 'info', 'Joining created session...');
        try {
          const joinedSession = await collaborativeService.joinSession(createdSession.sessionToken);
          addResult('Join Session', 'success', 'Successfully joined session', joinedSession);
        } catch (error: any) {
          addResult('Join Session', 'error', `Failed to join session: ${error.message}`);
        }
      }

      // Test 7: Send chat message (if in session)
      if (createdSession) {
        addResult('Chat Message', 'info', 'Sending test chat message...');
        try {
          const message = await collaborativeService.sendChatMessage('Hello from automated test!');
          addResult('Chat Message', 'success', 'Chat message sent successfully', message);
        } catch (error: any) {
          addResult('Chat Message', 'error', `Failed to send chat message: ${error.message}`);
        }
      }

      // Test 8: Change language (if in session)
      if (createdSession) {
        addResult('Language Change', 'info', 'Testing language change...');
        try {
          collaborativeService.changeLanguage('python');
          addResult('Language Change', 'success', 'Language change request sent');
        } catch (error: any) {
          addResult('Language Change', 'error', `Failed to change language: ${error.message}`);
        }
      }

      // Test 9: Leave session (if in session)
      if (createdSession) {
        addResult('Leave Session', 'info', 'Leaving session...');
        try {
          await collaborativeService.leaveSession();
          addResult('Leave Session', 'success', 'Successfully left session');
        } catch (error: any) {
          addResult('Leave Session', 'error', `Failed to leave session: ${error.message}`);
        }
      }

    } catch (error: any) {
      addResult('System Error', 'error', `Unexpected error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const testJoinByToken = async () => {
    if (!sessionToken.trim()) {
      addResult('Join by Token', 'error', 'Please enter a session token');
      return;
    }

    addResult('Join by Token', 'info', `Attempting to join session: ${sessionToken}`);
    try {
      const session = await collaborativeService.joinSession(sessionToken);
      addResult('Join by Token', 'success', 'Successfully joined session by token', session);
    } catch (error: any) {
      addResult('Join by Token', 'error', `Failed to join session: ${error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'info': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Collaborative System Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={runFullTest} 
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? 'Running Tests...' : 'Run Full Test Suite'}
            </Button>
            <Button 
              onClick={clearResults} 
              variant="outline"
            >
              Clear Results
            </Button>
          </div>

          <div className="flex space-x-2">
            <Input
              value={sessionToken}
              onChange={(e) => setSessionToken(e.target.value)}
              placeholder="Enter session token to test join..."
              className="flex-1 bg-gray-700 border-gray-600 text-white"
            />
            <Button onClick={testJoinByToken} variant="outline">
              Test Join
            </Button>
          </div>

          {user && (
            <div className="text-sm text-gray-400">
              Testing as: {user.name} ({user.email})
            </div>
          )}
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="border-l-2 border-gray-600 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusBadge(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                      <span className="font-medium text-white">{result.test}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`text-sm ${getStatusColor(result.status)}`}>
                    {result.message}
                  </div>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">
                        View Data
                      </summary>
                      <pre className="text-xs text-gray-400 mt-1 p-2 bg-gray-900 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};