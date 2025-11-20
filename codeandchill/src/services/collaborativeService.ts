import { io, Socket } from 'socket.io-client';

export interface CollaborativeSession {
  id: string;
  title: string;
  description?: string;
  sessionToken: string;
  language: string;
  isPublic: boolean;
  maxParticipants: number;
  participants: Participant[];
  settings: SessionSettings;
  createdAt: string;
  lastActivity: string;
  isHost?: boolean;
}

export interface Participant {
  userId: string;
  username: string;
  joinedAt: string;
  isActive: boolean;
  cursor?: {
    line: number;
    column: number;
  };
  selection?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
}

export interface SessionSettings {
  allowEdit: 'host-only' | 'all-participants' | 'invited-only';
  allowChat: boolean;
  allowVoice: boolean;
  theme: string;
  fontSize: number;
}

export interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system' | 'code-change';
}

export interface CodeChange {
  operation: 'insert' | 'delete' | 'replace';
  position: {
    line: number;
    column: number;
  };
  content: string;
  length?: number;
}

class CollaborativeService {
  private socket: Socket | null = null;
  private baseURL = 'http://localhost:3001';
  private currentSession: CollaborativeSession | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  // Initialize WebSocket connection
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.baseURL, {
          auth: { token },
          transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
          console.log('Connected to collaborative server');
          this.setupEventListeners();
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
          this.emit('error', error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentSession = null;
    this.eventListeners.clear();
  }

  // Create a new collaborative session
  async createSession(sessionData: {
    title: string;
    description?: string;
    language?: string;
    isPublic?: boolean;
    maxParticipants?: number;
    settings?: Partial<SessionSettings>;
  }): Promise<CollaborativeSession> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.baseURL}/api/collaborative/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sessionData)
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    const data = await response.json();
    return data.session;
  }

  // Join a collaborative session
  async joinSession(sessionToken: string): Promise<CollaborativeSession> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.baseURL}/api/collaborative/sessions/${sessionToken}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join session');
    }

    const data = await response.json();
    this.currentSession = data.session;

    // Join WebSocket room
    if (this.socket) {
      this.socket.emit('join-session', { sessionToken });
    }

    return data.session;
  }

  // Leave current session
  async leaveSession(): Promise<void> {
    if (!this.currentSession) return;

    const token = localStorage.getItem('authToken');
    await fetch(`${this.baseURL}/api/collaborative/sessions/${this.currentSession.sessionToken}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Leave WebSocket room
    if (this.socket) {
      this.socket.emit('leave-session');
    }

    this.currentSession = null;
  }

  // Get user's sessions
  async getMySessions(): Promise<CollaborativeSession[]> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.baseURL}/api/collaborative/sessions/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }

    const data = await response.json();
    return data.sessions;
  }

  // Get public sessions
  async getPublicSessions(page = 1, limit = 10): Promise<{
    sessions: CollaborativeSession[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const response = await fetch(`${this.baseURL}/api/collaborative/sessions/public?page=${page}&limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch public sessions');
    }

    const data = await response.json();
    return data;
  }

  // Send code change
  sendCodeChange(change: CodeChange, code: string) {
    if (this.socket && this.currentSession) {
      this.socket.emit('code-change', { change, code });
    }
  }

  // Send cursor position
  sendCursorPosition(position: { line: number; column: number }) {
    if (this.socket && this.currentSession) {
      this.socket.emit('cursor-position', { position });
    }
  }

  // Send selection change
  sendSelectionChange(selection: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  } | null) {
    if (this.socket && this.currentSession) {
      this.socket.emit('selection-change', { selection });
    }
  }

  // Send chat message
  async sendChatMessage(message: string): Promise<ChatMessage> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.baseURL}/api/collaborative/sessions/${this.currentSession.sessionToken}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data.message;
  }

  // Change language (host only)
  changeLanguage(language: string) {
    if (this.socket && this.currentSession) {
      this.socket.emit('language-change', { language });
    }
  }

  // Update session settings (host only)
  async updateSettings(settings: Partial<SessionSettings>): Promise<SessionSettings> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.baseURL}/api/collaborative/sessions/${this.currentSession.sessionToken}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ settings })
    });

    if (!response.ok) {
      throw new Error('Failed to update settings');
    }

    const data = await response.json();
    return data.settings;
  }

  // Event listener management
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Session events
    this.socket.on('session-joined', (data) => {
      this.emit('session-joined', data);
    });

    this.socket.on('user-joined', (data) => {
      this.emit('user-joined', data);
    });

    this.socket.on('user-left', (data) => {
      this.emit('user-left', data);
    });

    // Code events
    this.socket.on('code-changed', (data) => {
      this.emit('code-changed', data);
    });

    this.socket.on('cursor-moved', (data) => {
      this.emit('cursor-moved', data);
    });

    this.socket.on('selection-changed', (data) => {
      this.emit('selection-changed', data);
    });

    this.socket.on('language-changed', (data) => {
      this.emit('language-changed', data);
    });

    // Chat events
    this.socket.on('chat-message', (data) => {
      this.emit('chat-message', data);
    });

    this.socket.on('chat-history', (data) => {
      this.emit('chat-history', data);
    });

    // Error events
    this.socket.on('error', (data) => {
      this.emit('error', data);
    });
  }

  // Getters
  getCurrentSession(): CollaborativeSession | null {
    return this.currentSession;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const collaborativeService = new CollaborativeService();