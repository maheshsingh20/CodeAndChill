import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { collaborativeService, CollaborativeSession } from '@/services/collaborativeService';
import { Plus, Users, Clock, Globe, Lock, Copy, Play } from 'lucide-react';

// Simple notification helper
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // You can replace this with a proper toast library later
};

interface SessionBrowserProps {
  onJoinSession: (sessionToken: string) => void;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' }
];

export const SessionBrowser: React.FC<SessionBrowserProps> = ({ onJoinSession }) => {
  const [mySessions, setMySessions] = useState<CollaborativeSession[]>([]);
  const [publicSessions, setPublicSessions] = useState<CollaborativeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState('');

  // Create session form state
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    language: 'javascript',
    isPublic: false,
    maxParticipants: 10,
    allowEdit: 'all-participants' as 'host-only' | 'all-participants' | 'invited-only',
    allowChat: true
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      
      const [mySessionsData, publicSessionsData] = await Promise.all([
        collaborativeService.getMySessions().catch(() => []),
        collaborativeService.getPublicSessions().catch(() => ({ sessions: [] }))
      ]);
      
      setMySessions(mySessionsData);
      setPublicSessions(publicSessionsData.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      // Set empty arrays as fallback
      setMySessions([]);
      setPublicSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      const session = await collaborativeService.createSession({
        title: createForm.title,
        description: createForm.description,
        language: createForm.language,
        isPublic: createForm.isPublic,
        maxParticipants: createForm.maxParticipants,
        settings: {
          allowEdit: createForm.allowEdit,
          allowChat: createForm.allowChat,
          allowVoice: false,
          theme: 'dark',
          fontSize: 14
        }
      });

      showNotification('Session created successfully!', 'success');
      setCreateDialogOpen(false);
      setCreateForm({
        title: '',
        description: '',
        language: 'javascript',
        isPublic: false,
        maxParticipants: 10,
        allowEdit: 'all-participants',
        allowChat: true
      });
      
      // Join the newly created session
      onJoinSession(session.sessionToken);
    } catch (error) {
      console.error('Error creating session:', error);
      showNotification('Failed to create session', 'error');
    }
  };

  const handleJoinByToken = () => {
    if (!sessionToken.trim()) {
      showNotification('Please enter a session token', 'error');
      return;
    }
    
    onJoinSession(sessionToken.trim());
    setJoinDialogOpen(false);
    setSessionToken('');
  };

  const copySessionToken = (token: string) => {
    navigator.clipboard.writeText(token);
    showNotification('Session token copied to clipboard!', 'success');
  };

  const formatDistanceToNow = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const SessionCard: React.FC<{ session: CollaborativeSession; showJoinButton?: boolean }> = ({ 
    session, 
    showJoinButton = true 
  }) => (
    <Card className="glass-card hover-lift">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-white mb-1">{session.title}</CardTitle>
            {session.description && (
              <p className="text-sm text-gray-400 mb-2">{session.description}</p>
            )}
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Badge variant="outline" className="text-xs">
                {LANGUAGE_OPTIONS.find(l => l.value === session.language)?.label || session.language}
              </Badge>
              {session.isPublic ? (
                <Badge variant="secondary" className="text-xs">
                  <Globe size={10} className="mr-1" />
                  Public
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  <Lock size={10} className="mr-1" />
                  Private
                </Badge>
              )}
              {session.isHost && (
                <Badge variant="default" className="text-xs">
                  Host
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span>{session.participants?.length || 0}/{session.maxParticipants || 10}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{formatDistanceToNow(new Date(session.lastActivity))}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showJoinButton && (
            <Button 
              size="sm" 
              onClick={() => onJoinSession(session.sessionToken)}
              className="flex-1"
            >
              <Play size={14} className="mr-1" />
              Join
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => copySessionToken(session.sessionToken)}
          >
            <Copy size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Collaborative Coding</h1>
        
        <div className="flex space-x-2">
          <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Join Session
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Join Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sessionToken" className="text-gray-300">Session Token</Label>
                  <Input
                    id="sessionToken"
                    value={sessionToken}
                    onChange={(e) => setSessionToken(e.target.value)}
                    placeholder="Enter session token..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button onClick={handleJoinByToken} className="w-full">
                  Join Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Create Session
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Title *</Label>
                  <Input
                    id="title"
                    value={createForm.title}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Session title..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={createForm.description}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language" className="text-gray-300">Language</Label>
                    <Select 
                      value={createForm.language} 
                      onValueChange={(value) => setCreateForm(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="maxParticipants" className="text-gray-300">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      min="2"
                      max="50"
                      value={createForm.maxParticipants}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 10 }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="allowEdit" className="text-gray-300">Edit Permissions</Label>
                  <Select 
                    value={createForm.allowEdit} 
                    onValueChange={(value: any) => setCreateForm(prev => ({ ...prev, allowEdit: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-participants">All Participants</SelectItem>
                      <SelectItem value="host-only">Host Only</SelectItem>
                      <SelectItem value="invited-only">Invited Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublic"
                      checked={createForm.isPublic}
                      onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, isPublic: checked }))}
                    />
                    <Label htmlFor="isPublic" className="text-gray-300">Public Session</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowChat"
                      checked={createForm.allowChat}
                      onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, allowChat: checked }))}
                    />
                    <Label htmlFor="allowChat" className="text-gray-300">Enable Chat</Label>
                  </div>
                </div>

                <Button 
                  onClick={handleCreateSession} 
                  className="w-full"
                  disabled={!createForm.title.trim()}
                >
                  Create Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="my-sessions" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="my-sessions" className="data-[state=active]:bg-gray-700">
            My Sessions ({mySessions.length})
          </TabsTrigger>
          <TabsTrigger value="public-sessions" className="data-[state=active]:bg-gray-700">
            Public Sessions ({publicSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-sessions" className="space-y-4">
          {mySessions.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="text-gray-500 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No sessions yet</h3>
                <p className="text-gray-500 text-center mb-4">
                  Create your first collaborative coding session to start coding with friends!
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public-sessions" className="space-y-4">
          {publicSessions.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Globe className="text-gray-500 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No public sessions</h3>
                <p className="text-gray-500 text-center">
                  There are no public collaborative sessions available right now.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};