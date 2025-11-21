import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { collaborativeService, CodeChange, Participant } from '@/services/collaborativeService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Share } from 'lucide-react';

// Simple notification helper
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
};

interface CollaborativeEditorProps {
  sessionToken: string;
  onLeave: () => void;
}

interface CursorDecoration {
  userId: string;
  username: string;
  position: { line: number; column: number };
  color: string;
}

const PARTICIPANT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

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

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  sessionToken,
  onLeave
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  const [cursorDecorations, setCursorDecorations] = useState<CursorDecoration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    initializeSession();
    setupEventListeners();

    return () => {
      collaborativeService.off('session-joined', handleSessionJoined);
      collaborativeService.off('code-changed', handleCodeChanged);
      collaborativeService.off('cursor-moved', handleCursorMoved);
      collaborativeService.off('user-joined', handleUserJoined);
      collaborativeService.off('user-left', handleUserLeft);
      collaborativeService.off('language-changed', handleLanguageChanged);
      collaborativeService.off('error', handleError);
    };
  }, []);

  const initializeSession = async () => {
    try {
      const session = await collaborativeService.joinSession(sessionToken);
      setCode('// Welcome to collaborative coding!');
      setLanguage(session.language);
      setParticipants(session.participants);
      setIsHost(session.isHost || false);
      setSessionTitle(session.title);
      setCanEdit(checkEditPermission(session.settings.allowEdit, session.isHost || false));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to join session:', error);
      showNotification('Failed to join collaborative session', 'error');
      onLeave();
    }
  };

  const setupEventListeners = () => {
    collaborativeService.on('session-joined', handleSessionJoined);
    collaborativeService.on('code-changed', handleCodeChanged);
    collaborativeService.on('cursor-moved', handleCursorMoved);
    collaborativeService.on('user-joined', handleUserJoined);
    collaborativeService.on('user-left', handleUserLeft);
    collaborativeService.on('language-changed', handleLanguageChanged);
    collaborativeService.on('error', handleError);
  };

  const handleSessionJoined = (data: any) => {
    setCode(data.code || '');
    setLanguage(data.language);
    setParticipants(data.participants);
    setIsHost(data.isHost);
    setCanEdit(checkEditPermission(data.settings.allowEdit, data.isHost));
  };

  const handleCodeChanged = (data: any) => {
    console.log('[CODE-SYNC] Received code update from:', data.username);
    
    // Simply update the code state - Monaco will handle the update
    if (data.code !== undefined && data.code !== code) {
      console.log('[CODE-SYNC] Updating code, length:', data.code.length);
      setCode(data.code);
      
      // Show notification
      showNotification(`${data.username} updated the code`, 'info');
    }
  };

  const handleCursorMoved = (data: any) => {
    updateCursorDecoration(data.userId, data.username, data.position);
  };

  const handleUserJoined = (data: any) => {
    setParticipants(prev => {
      const existing = prev.find(p => p.userId === data.userId);
      if (existing) {
        return prev.map(p => p.userId === data.userId ? { ...p, isActive: true } : p);
      }
      return [...prev, {
        userId: data.userId,
        username: data.username,
        joinedAt: new Date().toISOString(),
        isActive: true
      }];
    });
    showNotification(`${data.username} joined the session`, 'success');
  };

  const handleUserLeft = (data: any) => {
    setParticipants(prev => 
      prev.map(p => p.userId === data.userId ? { ...p, isActive: false } : p)
    );
    // Remove cursor decoration
    setCursorDecorations(prev => prev.filter(c => c.userId !== data.userId));
    showNotification(`${data.username} left the session`, 'info');
  };

  const handleLanguageChanged = (data: any) => {
    setLanguage(data.language);
    showNotification(`Language changed to ${data.language} by ${data.changedBy}`, 'info');
  };

  const handleError = (error: any) => {
    showNotification(error.message || 'An error occurred', 'error');
  };

  const checkEditPermission = (allowEdit: string, isHostUser: boolean): boolean => {
    switch (allowEdit) {
      case 'host-only':
        return isHostUser;
      case 'all-participants':
        return true;
      case 'invited-only':
        return true; // For now, treat as all participants
      default:
        return false;
    }
  };

  const updateCursorDecoration = (userId: string, username: string, position: { line: number; column: number }) => {
    setCursorDecorations(prev => {
      const existing = prev.find(c => c.userId === userId);
      const participantIndex = participants.findIndex(p => p.userId === userId);
      const color = PARTICIPANT_COLORS[participantIndex % PARTICIPANT_COLORS.length];

      if (existing) {
        return prev.map(c => 
          c.userId === userId 
            ? { ...c, position, color }
            : c
        );
      }
      return [...prev, { userId, username, position, color }];
    });

    // Apply cursor decorations to Monaco editor
    if (editorRef.current && monacoRef.current) {
      const editor = editorRef.current;
      const model = editor.getModel();
      
      if (model) {
        const decorations = cursorDecorations.map(cursor => ({
          range: new monacoRef.current.Range(
            cursor.position.line + 1,
            cursor.position.column + 1,
            cursor.position.line + 1,
            cursor.position.column + 1
          ),
          options: {
            className: 'collaborative-cursor',
            hoverMessage: { value: cursor.username },
            beforeContentClassName: 'collaborative-cursor-line',
            stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
          }
        }));

        editor.deltaDecorations([], decorations);
      }
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Track cursor position changes
    editor.onDidChangeCursorPosition((e: any) => {
      const position = {
        line: e.position.lineNumber - 1,
        column: e.position.column - 1
      };
      collaborativeService.sendCursorPosition(position);
    });

    // Track selection changes
    editor.onDidChangeCursorSelection((e: any) => {
      const selection = e.selection;
      if (selection.isEmpty()) {
        collaborativeService.sendSelectionChange(null);
      } else {
        collaborativeService.sendSelectionChange({
          startLine: selection.startLineNumber - 1,
          startColumn: selection.startColumn - 1,
          endLine: selection.endLineNumber - 1,
          endColumn: selection.endColumn - 1
        });
      }
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (!canEdit || value === undefined) return;

    const newCode = value;
    const oldCode = code;

    // Simple diff to detect changes
    if (newCode !== oldCode) {
      console.log('[CODE-CHANGE] Local code changed, sending to server. Length:', newCode.length);
      
      // For simplicity, we'll send the entire new content
      // In a production app, you'd want to implement proper operational transforms
      const change: CodeChange = {
        operation: 'replace',
        position: { line: 0, column: 0 },
        content: newCode,
        length: oldCode.length
      };

      collaborativeService.sendCodeChange(change, newCode);
      setCode(newCode);
      
      console.log('[CODE-CHANGE] Code sent successfully');
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (isHost) {
      collaborativeService.changeLanguage(newLanguage);
    } else {
      showNotification('Only the host can change the language', 'error');
    }
  };

  const handleLeaveSession = async () => {
    try {
      await collaborativeService.leaveSession();
      onLeave();
    } catch (error) {
      console.error('Error leaving session:', error);
      onLeave();
    }
  };

  const copySessionLink = () => {
    const link = `${window.location.origin}/collaborative/${sessionToken}`;
    navigator.clipboard.writeText(link);
    showNotification('Session link copied to clipboard!', 'success');
  };

  const activeParticipants = participants.filter(p => p.isActive);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-lg">Joining collaborative session...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">{sessionTitle}</h1>
            {isHost && <Badge variant="secondary">Host</Badge>}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Participants */}
            <div className="flex items-center space-x-2">
              <Users className="text-gray-400" size={16} />
              <span className="text-gray-300">{activeParticipants.length}</span>
              <div className="flex -space-x-2">
                {activeParticipants.slice(0, 5).map((participant, index) => {
                  const color = PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length];
                  return (
                    <div
                      key={participant.userId}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-gray-800"
                      style={{ backgroundColor: color }}
                      title={participant.username}
                    >
                      {participant.username.charAt(0).toUpperCase()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Language Selector */}
            <Select value={language} onValueChange={handleLanguageChange} disabled={!isHost}>
              <SelectTrigger className="w-32">
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

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={copySessionLink}>
              <Share size={16} className="mr-2" />
              Share
            </Button>
            
            <Button variant="destructive" size="sm" onClick={handleLeaveSession}>
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {!canEdit && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary">Read Only</Badge>
          </div>
        )}
        
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            readOnly: !canEdit,
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'off',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: "on"
          }}
        />
      </div>
    </div>
  );
};