import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TokenManager } from '@/utils/tokenManager';
import { useUser } from '@/contexts/UserContext';
import { collaborativeService } from '@/services/collaborativeService';

export const AuthDiagnostic: React.FC = () => {
  const { user } = useUser();
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runDiagnostics = () => {
    const token = TokenManager.getToken();
    const hasToken = TokenManager.hasToken();
    const isValidFormat = token ? TokenManager.isValidTokenFormat(token) : false;

    // Check all possible token locations
    const authToken = localStorage.getItem('authToken');
    const tokenKey = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // Check collaborative service connection
    const socketConnected = collaborativeService.isConnected();
    const currentSession = collaborativeService.getCurrentSession();

    setDiagnostics({
      // Token Status
      hasToken,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? token.substring(0, 30) + '...' : 'None',
      isValidFormat,
      
      // Storage Keys
      authTokenExists: !!authToken,
      tokenKeyExists: !!tokenKey,
      isAuthenticatedFlag: isAuthenticated,
      
      // User Context
      userLoaded: !!user,
      userName: user?.name || 'Not loaded',
      userEmail: user?.email || 'Not loaded',
      
      // Collaborative Service
      socketConnected,
      hasActiveSession: !!currentSession,
      sessionToken: currentSession?.sessionToken || 'None',
      
      // Environment
      apiUrl: import.meta.env.VITE_API_URL || 'Not set',
      
      // Timestamp
      checkedAt: new Date().toLocaleTimeString()
    });

    // Also log to console
    TokenManager.debugTokenStatus();
  };

  useEffect(() => {
    runDiagnostics();
  }, [user]);

  const testApiCall = async () => {
    setTesting(true);
    try {
      const token = TokenManager.getToken();
      const response = await fetch('http://localhost:3001/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      setDiagnostics((prev: any) => ({
        ...prev,
        apiTest: {
          status: response.status,
          ok: response.ok,
          message: response.ok ? 'API call successful' : data.message || 'API call failed',
          data: response.ok ? 'User data received' : null
        }
      }));
    } catch (error: any) {
      setDiagnostics((prev: any) => ({
        ...prev,
        apiTest: {
          status: 'Error',
          ok: false,
          message: error.message,
          data: null
        }
      }));
    } finally {
      setTesting(false);
    }
  };

  const testCollaborativeApi = async () => {
    setTesting(true);
    try {
      const sessions = await collaborativeService.getMySessions();
      setDiagnostics((prev: any) => ({
        ...prev,
        collaborativeTest: {
          success: true,
          message: `Found ${sessions.length} sessions`,
          sessionCount: sessions.length
        }
      }));
    } catch (error: any) {
      setDiagnostics((prev: any) => ({
        ...prev,
        collaborativeTest: {
          success: false,
          message: error.message,
          sessionCount: 0
        }
      }));
    } finally {
      setTesting(false);
    }
  };

  const fixTokenIssues = () => {
    // Migrate any old tokens
    const oldToken = localStorage.getItem('token');
    if (oldToken && !localStorage.getItem('authToken')) {
      TokenManager.setToken(oldToken);
      localStorage.removeItem('token');
      alert('Token migrated successfully!');
    } else if (!TokenManager.hasToken()) {
      alert('No token found to fix. Please login again.');
    } else {
      alert('Token is already in correct format.');
    }
    runDiagnostics();
  };

  const getStatusBadge = (value: boolean) => {
    return value ? (
      <Badge className="bg-green-500/20 text-green-400">✓ Yes</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400">✗ No</Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Authentication Diagnostics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={runDiagnostics} variant="outline">
              Refresh Diagnostics
            </Button>
            <Button onClick={testApiCall} disabled={testing}>
              Test API Call
            </Button>
            <Button onClick={testCollaborativeApi} disabled={testing}>
              Test Collaborative API
            </Button>
            <Button onClick={fixTokenIssues} variant="secondary">
              Fix Token Issues
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            Last checked: {diagnostics.checkedAt}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Token Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Has Token</div>
              <div>{getStatusBadge(diagnostics.hasToken)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Valid Format</div>
              <div>{getStatusBadge(diagnostics.isValidFormat)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Token Length</div>
              <div className="text-white">{diagnostics.tokenLength}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Token Preview</div>
              <div className="text-xs text-gray-300 font-mono">{diagnostics.tokenPreview}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Storage Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">'authToken' exists</div>
              <div>{getStatusBadge(diagnostics.authTokenExists)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">'token' exists (old)</div>
              <div>{getStatusBadge(diagnostics.tokenKeyExists)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">isAuthenticated flag</div>
              <div className="text-white">{diagnostics.isAuthenticatedFlag || 'Not set'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">User Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">User Loaded</div>
              <div>{getStatusBadge(diagnostics.userLoaded)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">User Name</div>
              <div className="text-white">{diagnostics.userName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">User Email</div>
              <div className="text-white">{diagnostics.userEmail}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Collaborative Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Socket Connected</div>
              <div>{getStatusBadge(diagnostics.socketConnected)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Active Session</div>
              <div>{getStatusBadge(diagnostics.hasActiveSession)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Session Token</div>
              <div className="text-xs text-gray-300 font-mono">{diagnostics.sessionToken}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {diagnostics.apiTest && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">API Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <div className="text-white">{diagnostics.apiTest.status}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Success</div>
                <div>{getStatusBadge(diagnostics.apiTest.ok)}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-gray-400">Message</div>
                <div className="text-white">{diagnostics.apiTest.message}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {diagnostics.collaborativeTest && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Collaborative API Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Success</div>
                <div>{getStatusBadge(diagnostics.collaborativeTest.success)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Sessions Found</div>
                <div className="text-white">{diagnostics.collaborativeTest.sessionCount}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-gray-400">Message</div>
                <div className="text-white">{diagnostics.collaborativeTest.message}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-400">API URL</div>
          <div className="text-white font-mono">{diagnostics.apiUrl}</div>
        </CardContent>
      </Card>
    </div>
  );
};
