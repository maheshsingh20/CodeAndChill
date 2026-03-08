import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Users,
  Copy,
  LogOut,
  Crown,
  Hand,
  Check,
  X,
  Send,
  Code2,
  Play,
  Terminal
} from 'lucide-react';
import { collaborativeService, Participant, ChatMessage, SessionData } from '@/services/collaborativeService';
import Editor from '@monaco-editor/react';
import { toast } from 'sonner';

interface CollaborativeCodingPageProps {
  userId: string;
  userName: string;
  token: string;
}

export function CollaborativeCodingPage({ userId, userName, token }: CollaborativeCodingPageProps) {
  const navigate = useNavigate();
  const { sessionCode: urlSessionCode } = useParams();

  const [mode, setMode] = useState<'home' | 'session'>('home');
  const [sessionCode, setSessionCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [session, setSession] = useState<SessionData | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [controlRequest, setControlRequest] = useState<{ requesterId: string; requesterName: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    collaborativeService.connect(token);

    if (urlSessionCode) {
      handleJoinSession(urlSessionCode);
    }

    return () => {
      if (session) {
        collaborativeService.leaveSession(session.sessionCode, userId, userName);
      }
      collaborativeService.offAllListeners();
      collaborativeService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (mode === 'session') {
      // Remove old listeners before adding new ones
      collaborativeService.offAllListeners();
      setupSocketListeners();
    }

    return () => {
      // Cleanup listeners when component unmounts or mode changes
      if (mode === 'session') {
        collaborativeService.offAllListeners();
      }
    };
  }, [mode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const setupSocketListeners = () => {
    collaborativeService.onCodeUpdated((data) => {
      setCode(data.code);
    });

    collaborativeService.onControlRequested((data) => {
      if (data.controllerId === userId) {
        setControlRequest({
          requesterId: data.requesterId,
          requesterName: data.requesterName
        });
        toast.info(`${data.requesterName} is requesting editor control`);
      }
    });

    collaborativeService.onControlGranted((data) => {
      setSession(prev => prev ? { ...prev, controllerId: data.newControllerId, participants: data.participants } : null);
      toast.success(`Control granted to ${data.participants.find(p => p.userId === data.newControllerId)?.name}`);
      setControlRequest(null);
    });

    collaborativeService.onControlDenied(() => {
      toast.error('Control request denied');
    });

    collaborativeService.onChatMessage((message) => {
      setChatMessages(prev => [...prev, message]);
    });

    collaborativeService.onUserJoined((data) => {
      setSession(prev => prev ? { ...prev, participants: data.participants } : null);
      toast.success(`${data.userName} joined the session`);
    });

    collaborativeService.onUserLeft((data) => {
      setSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          participants: data.participants,
          controllerId: data.newControllerId || prev.controllerId
        };
      });
      toast.info(`${data.userName} left the session`);
    });
  };

  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const sessionData = await collaborativeService.createSession(userId, userName, language);
      setSession(sessionData);
      setSessionCode(sessionData.sessionCode);
      setCode(sessionData.currentCode);
      setLanguage(sessionData.language);
      setChatMessages(sessionData.chatHistory || []);
      setMode('session');
      toast.success(`Session created: ${sessionData.sessionCode}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (code?: string) => {
    const codeToJoin = code || joinCode.toUpperCase();
    if (!codeToJoin) {
      toast.error('Please enter a session code');
      return;
    }

    setLoading(true);
    try {
      const sessionData = await collaborativeService.joinSession(codeToJoin, userId, userName);
      setSession(sessionData);
      setSessionCode(sessionData.sessionCode);
      setCode(sessionData.currentCode);
      setLanguage(sessionData.language);
      setChatMessages(sessionData.chatHistory || []);
      setMode('session');
      toast.success(`Joined session: ${sessionData.sessionCode}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to join session');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (!session || session.controllerId !== userId) return;

    const newCode = value || '';
    setCode(newCode);
    collaborativeService.sendCodeChange(session.sessionCode, newCode, userId);
  };

  const handleRequestControl = () => {
    if (session) {
      collaborativeService.requestControl(session.sessionCode, userId, userName);
      toast.info('Control request sent');
    }
  };

  const handleGrantControl = () => {
    if (session && controlRequest) {
      collaborativeService.grantControl(session.sessionCode, controlRequest.requesterId);
    }
  };

  const handleDenyControl = () => {
    if (session && controlRequest) {
      collaborativeService.denyControl(session.sessionCode, controlRequest.requesterId);
      setControlRequest(null);
    }
  };

  const handleSendMessage = () => {
    if (!session || !chatInput.trim()) return;

    collaborativeService.sendChatMessage(session.sessionCode, userId, userName, chatInput);
    setChatInput('');
  };

  const handleLeaveSession = () => {
    if (session) {
      collaborativeService.leaveSession(session.sessionCode, userId, userName);
      setMode('home');
      setSession(null);
      setCode('');
      setChatMessages([]);
      setSessionCode('');
      toast.info('Left session');
    }
  };

  const copySessionCode = () => {
    navigator.clipboard.writeText(sessionCode);
    toast.success('Session code copied!');
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsRunning(true);
    setOutput('Running...');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/code/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          language: language,
          code: code,
          input: ''
        })
      });

      const result = await response.json();

      if (result.success) {
        setOutput(result.output || 'Program executed successfully with no output');
      } else {
        setOutput(`Error: ${result.error || 'Execution failed'}`);
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message || 'Failed to execute code'}`);
      toast.error('Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  const getLanguageMonaco = (lang: string) => {
    const languageMap: Record<string, string> = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'csharp': 'csharp',
      'go': 'go',
      'rust': 'rust',
      'typescript': 'typescript',
      'php': 'php',
      'ruby': 'ruby',
      'swift': 'swift',
      'kotlin': 'kotlin'
    };
    return languageMap[lang] || 'javascript';
  };

  const isController = session?.controllerId === userId;

  if (mode === 'home') {
    return (
      <div className="w-full min-h-screen bg-black">
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
              <Code2 className="text-cyan-400" size={48} />
              Collaborative Coding
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Code together in real-time with pair programming and live collaboration
            </p>
          </header>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-8 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-md bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                  Create Session
                </h2>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Start a new collaborative coding session and invite others to join
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Select Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-black/50 border border-gray-600 text-white rounded-md px-4 py-3 focus:border-purple-500 transition-colors"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="csharp">C#</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="typescript">TypeScript</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                  </select>
                </div>
                <Button
                  onClick={handleCreateSession}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 rounded-md transition-all duration-300"
                >
                  {loading ? 'Creating...' : 'Create New Session'}
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-8 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                  Join Session
                </h2>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Enter a session code to join an existing collaboration
              </p>
              <div className="space-y-4">
                <Input
                  placeholder="Enter 6-character code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="bg-black/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500 transition-colors py-6 text-center text-lg font-mono tracking-wider"
                  maxLength={8}
                />
                <Button
                  onClick={() => handleJoinSession()}
                  disabled={loading || !joinCode}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-6 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Joining...' : 'Join Session'}
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 text-center hover:border-gray-600 transition-all duration-300">
              <div className="w-12 h-12 rounded-md bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Control System</h3>
              <p className="text-sm text-gray-400">Request and grant editor control seamlessly</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 text-center hover:border-gray-600 transition-all duration-300">
              <div className="w-12 h-12 rounded-md bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                <Code2 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Real-time Sync</h3>
              <p className="text-sm text-gray-400">See code changes instantly as they happen</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 text-center hover:border-gray-600 transition-all duration-300">
              <div className="w-12 h-12 rounded-md bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto mb-4">
                <Send className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Group Chat</h3>
              <p className="text-sm text-gray-400">Communicate with your team in real-time</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Code2 className="h-6 w-6 text-purple-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">Session: {sessionCode}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copySessionCode}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-gray-400 text-sm">
                {isController ? 'You have control' : `${session?.participants.find(p => p.isController)?.name} has control`}
              </span>
            </div>
          </div>
          <Button
            onClick={handleLeaveSession}
            variant="destructive"
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Leave
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Participants Sidebar */}
        <div className="w-72 bg-gradient-to-br from-gray-900 via-black to-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants ({session?.participants.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {session?.participants.map((participant) => (
              <div
                key={participant.userId}
                className={`p-3 rounded-lg ${participant.isController
                  ? 'bg-purple-900/30 border border-purple-500/50'
                  : 'bg-gray-800'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white">{participant.name}</span>
                  {participant.isController && (
                    <Crown className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
                {participant.userId === session.hostId && (
                  <span className="text-xs text-gray-400">Host</span>
                )}
              </div>
            ))}
          </div>
          {!isController && (
            <div className="p-4 border-t border-gray-700">
              <Button
                onClick={handleRequestControl}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <Hand className="h-4 w-4 mr-2" />
                Request Control
              </Button>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          {/* Editor Toolbar */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-gray-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={!isController}
                  className="bg-black/50 border border-gray-600 text-white text-sm rounded px-3 py-1.5 focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="typescript">TypeScript</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                </select>
              </div>
              {!isController && (
                <span className="text-orange-400 text-sm flex items-center gap-2">
                  <Hand className="h-3 w-3" />
                  Read-only mode
                </span>
              )}
            </div>
            <Button
              onClick={handleRunCode}
              disabled={isRunning || !code.trim()}
              size="sm"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold disabled:opacity-50"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col">
            <div className="h-[60%]">
              <Editor
                height="100%"
                language={getLanguageMonaco(language)}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  readOnly: !isController,
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: 'Fira Code, Consolas, monospace',
                  fontLigatures: true
                }}
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
              />
            </div>

            {/* Output Panel */}
            <div className="h-[40%] bg-black border-t border-gray-700 flex flex-col">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-green-400" />
                <span className="text-white font-semibold text-sm">Output</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                  {output || 'Click "Run Code" to see output here...'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-96 bg-gradient-to-br from-gray-900 via-black to-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Group Chat</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-purple-400 font-semibold text-sm">
                    {msg.userName}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{msg.message}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Request Modal */}
      {controlRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-700 p-6 max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Control Request</h3>
            <p className="text-gray-300 mb-6">
              <span className="text-purple-400 font-semibold">{controlRequest.requesterName}</span>
              {' '}is requesting editor control
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleGrantControl}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button
                onClick={handleDenyControl}
                variant="destructive"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
