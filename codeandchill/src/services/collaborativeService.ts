import { io, Socket } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SOCKET_URL = API_BASE_URL.replace('/api', '');

export interface Participant {
  userId: string;
  name: string;
  joinedAt: Date;
  isController: boolean;
}

export interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

export interface SessionData {
  sessionCode: string;
  hostId: string;
  hostName: string;
  participants: Participant[];
  currentCode: string;
  language: string;
  controllerId: string;
  chatHistory?: ChatMessage[];
}

class CollaborativeServiceClass {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    this.token = token;
    
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      path: '/socket.io/collaborative',
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to collaborative service');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from collaborative service');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  createSession(userId: string, userName: string, language: string = 'javascript') {
    return new Promise<SessionData>((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('create-session', { userId, userName, language });

      this.socket.once('session-created', (data) => {
        if (data.success) {
          resolve(data.session);
        } else {
          reject(new Error('Failed to create session'));
        }
      });

      this.socket.once('session-error', (error) => {
        reject(new Error(error.message));
      });
    });
  }

  joinSession(sessionCode: string, userId: string, userName: string) {
    return new Promise<SessionData>((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('join-session', { sessionCode, userId, userName });

      this.socket.once('session-joined', (data) => {
        if (data.success) {
          resolve(data.session);
        } else {
          reject(new Error('Failed to join session'));
        }
      });

      this.socket.once('join-error', (error) => {
        reject(new Error(error.message));
      });
    });
  }

  sendCodeChange(sessionCode: string, code: string, userId: string) {
    if (this.socket) {
      this.socket.emit('code-change', { sessionCode, code, userId });
    }
  }

  requestControl(sessionCode: string, requesterId: string, requesterName: string) {
    if (this.socket) {
      this.socket.emit('request-control', { sessionCode, requesterId, requesterName });
    }
  }

  grantControl(sessionCode: string, requesterId: string) {
    if (this.socket) {
      this.socket.emit('grant-control', { sessionCode, requesterId });
    }
  }

  denyControl(sessionCode: string, requesterId: string) {
    if (this.socket) {
      this.socket.emit('deny-control', { sessionCode, requesterId });
    }
  }

  sendChatMessage(sessionCode: string, userId: string, userName: string, message: string) {
    if (this.socket) {
      this.socket.emit('chat-message', { sessionCode, userId, userName, message });
    }
  }

  leaveSession(sessionCode: string, userId: string, userName: string) {
    if (this.socket) {
      this.socket.emit('leave-session', { sessionCode, userId, userName });
    }
  }

  onCodeUpdated(callback: (data: { code: string; userId: string }) => void) {
    if (this.socket) {
      this.socket.on('code-updated', callback);
    }
  }

  onControlRequested(callback: (data: { requesterId: string; requesterName: string; controllerId: string }) => void) {
    if (this.socket) {
      this.socket.on('control-requested', callback);
    }
  }

  onControlGranted(callback: (data: { newControllerId: string; participants: Participant[] }) => void) {
    if (this.socket) {
      this.socket.on('control-granted', callback);
    }
  }

  onControlDenied(callback: (data: { requesterId: string }) => void) {
    if (this.socket) {
      this.socket.on('control-denied', callback);
    }
  }

  onChatMessage(callback: (message: ChatMessage) => void) {
    if (this.socket) {
      this.socket.on('chat-message', callback);
    }
  }

  onUserJoined(callback: (data: { userId: string; userName: string; participants: Participant[] }) => void) {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback: (data: { userId: string; userName: string; participants: Participant[]; newControllerId?: string }) => void) {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  offAllListeners() {
    if (this.socket) {
      this.socket.off('code-updated');
      this.socket.off('control-requested');
      this.socket.off('control-granted');
      this.socket.off('control-denied');
      this.socket.off('chat-message');
      this.socket.off('user-joined');
      this.socket.off('user-left');
    }
  }
}

export const collaborativeService = new CollaborativeServiceClass();
