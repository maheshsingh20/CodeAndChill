import { io, Socket } from 'socket.io-client';
import { TokenManager } from '@/utils/tokenManager';

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
        // Disconnect existing connection if any
        if (this.socket) {
          this.socket.disconnect();
        }

        this.socket = io(this.baseURL, {
          auth: { token },
          transports: ['websocket', 'polling'],
          timeout: 10000,
          retries: 3
        });

        this.socket.on('connect', () => {
          console.log('Connected to collaborative server with socket ID:', this.socket?.id);
          this.setupEventListeners();
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Disconnected from collaborative server:', reason);
          this.emit('disconnected', { reason });
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
          this.emit('error', error);
        });

        // Add timeout for connection
        setTimeout(() => {
          if (!this.socket?.connected) {
            reject(new Error('Connection timeout'));
          }
        }, 10000);

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
    console.log('Creating session with data:', sessionData);
    
    const token = TokenManager.getValidToken();
    if (!token) {
      console.error('No auth token found');
      TokenManager.debugTokenStatus();
      throw new Error('Authentication token not found');
    }
    
    console.log('Making request to:', `${this.baseURL}/api/collaborative/sessions`);
    
    const response = await fetch(`${this.baseURL}/api/collaborative/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sessionData)
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Session creation failed:', errorData);
      throw new Error(errorData.error || 'Failed to create session');
    }

    const data = await response.json();
    console.log('Session created successfully:', data);
    return data.session;
  }

  // Join a collaborative session
  async joinSession(sessionToken: string): Promise<CollaborativeSession> {
    console.log('[JOIN-SERVICE] Joining session:', sessionToken);
    
    const token = TokenManager.getValidToken();
    if (!token) {
      TokenManager.debugTokenStatus();
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${this.baseURL}/api/collaborative/sessions/${sessionToken}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to join session' }));
      throw new Error(error.error || 'Failed to join session');
    }

    const data = await response.json();
    this.currentSession = data.session;
    
    console.log('[JOIN-SERVICE] Session joined successfully');
    console.log('[JOIN-SERVICE] Current session set to:', this.currentSession);
    console.log('[JOIN-SERVICE] Session token:', this.currentSession?.sessionToken);

    // Join WebSocket room
    if (this.socket && this.socket.connected) {
      console.log('[JOIN-SERVICE] Emitting join-collaborative-session via WebSocket');
      this.socket.emit('join-collaborative-session', { sessionToken });
    } else {
      console.warn('[JOIN-SERVICE] WebSocket not connected, cannot join room');
    }

    return data.session;
  }

  // Leave current session
  async leaveSession(): Promise<void> {
    if (!this.currentSession) return;

    const token = TokenManager.getToken();
    if (token) {
      await fetch(`${this.baseURL}/api/collaborative/sessions/${this.currentSession.sessionToken}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    }

    // Leave WebSocket room
    if (this.socket) {
      this.socket.emit('leave-session');
    }

    this.currentSession = null;
  }

  // Get user's sessions
  async getMySessions(): Promise<CollaborativeSession[]> {
    const token = TokenManager.getValidToken();
    if (!token) {
      TokenManager.debugTokenStatus();
      throw new Error('Authentication token not found');
    }
    
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
      this.socket.emit('code-change', { 
        sessionToken: this.currentSession.sessionToken,
        code,
        changes: change
      });
    }
  }

  // Send cursor position
  sendCursorPosition(position: { line: number; column: number }) {
    if (this.socket && this.currentSession) {
      this.socket.emit('cursor-position', { 
        sessionToken: this.currentSession.sessionToken,
        position 
      });
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
    console.log('[CHAT-SERVICE] Attempting to send message');
    console.log('[CHAT-SERVICE] Current session:', this.currentSession);
    
    if (!this.currentSession) {
      console.error('[CHAT-SERVICE] No active session found!');
      throw new Error('No active session. Please join a session first.');
    }

    const sessionToken = this.currentSession.sessionToken;
    console.log('[CHAT-SERVICE] Using session token:', sessionToken);

    // Send via socket for real-time delivery
    if (this.socket && this.socket.connected) {
      console.log('[CHAT-SERVICE] Sending via WebSocket');
      this.socket.emit('session-chat', {
        sessionToken: sessionToken,
        message
      });
    } else {
      console.warn('[CHAT-SERVICE] WebSocket not connected, using REST API only');
    }

    // Also send via REST API as backup
    try {
      const token = TokenManager.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      console.log('[CHAT-SERVICE] Sending via REST API to:', `${this.baseURL}/api/collaborative/sessions/${sessionToken}/chat`);
      
      const response = await fetch(`${this.baseURL}/api/collaborative/sessions/${sessionToken}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[CHAT-SERVICE] REST API failed:', errorData);
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      console.log('[CHAT-SERVICE] Message sent successfully via REST API');
      return data.message;
    } catch (error) {
      console.error('[CHAT-SERVICE] Error sending message:', error);
      // If REST API fails but socket worked, return a mock message
      if (this.socket && this.socket.connected) {
        console.log('[CHAT-SERVICE] Returning mock message (WebSocket sent)');
        return {
          userId: 'current-user',
          username: 'You',
          message,
          timestamp: new Date().toISOString(),
          type: 'message'
        };
      }
      throw error;
    }
  }

  // Change language (host only)
  changeLanguage(language: string) {
    if (this.socket && this.currentSession) {
      this.socket.emit('language-change', { 
        sessionToken: this.currentSession.sessionToken,
        language 
      });
    }
  }

  // Update session settings (host only)
  async updateSettings(settings: Partial<SessionSettings>): Promise<SessionSettings> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const token = TokenManager.getValidToken();
    if (!token) {
      TokenManager.debugTokenStatus();
      throw new Error('Authentication token not found');
    }
    
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
    this.socket.on('session-state', (data) => {
      this.emit('session-joined', data);
    });

    this.socket.on('user-joined', (data) => {
      this.emit('user-joined', data);
    });

    this.socket.on('user-left', (data) => {
      this.emit('user-left', data);
    });

    // Code events
    this.socket.on('code-update', (data) => {
      this.emit('code-changed', data);
    });

    this.socket.on('cursor-update', (data) => {
      this.emit('cursor-moved', data);
    });

    this.socket.on('selection-update', (data) => {
      this.emit('selection-changed', data);
    });

    this.socket.on('language-update', (data) => {
      this.emit('language-changed', data);
    });

    // Chat events
    this.socket.on('chat-message', (data) => {
      this.emit('chat-message', data);
    });

    this.socket.on('session-sync', (data) => {
      if (data.chat) {
        this.emit('chat-history', { messages: data.chat });
      }
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