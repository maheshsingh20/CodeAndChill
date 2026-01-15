import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/constants';

export interface ChatMessage {
  _id?: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface Chat {
  _id: string;
  participants: string[];
  participantDetails: {
    userId: string;
    name: string;
    avatar?: string;
    lastSeen?: Date;
    isOnline?: boolean;
  }[];
  messages: ChatMessage[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: Map<string, number>;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSearchResult {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

class ChatService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.token = token;
    const wsUrl = API_BASE_URL.replace('/api', '').replace('http', 'ws');
    
    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to chat server');
      if (this.token) {
        this.socket?.emit('authenticate', this.token);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from chat server');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    // Set up event listeners
    this.socket.on('message:new', (data: any) => {
      this.emit('message:new', data);
    });

    this.socket.on('message:read', (data: any) => {
      this.emit('message:read', data);
    });

    this.socket.on('typing:start', (data: any) => {
      this.emit('typing:start', data);
    });

    this.socket.on('typing:stop', (data: any) => {
      this.emit('typing:stop', data);
    });

    this.socket.on('user:online', (data: any) => {
      this.emit('user:online', data);
    });

    this.socket.on('user:offline', (data: any) => {
      this.emit('user:offline', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Event emitter pattern
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Chat operations
  joinChat(chatId: string) {
    this.socket?.emit('chat:join', chatId);
  }

  leaveChat(chatId: string) {
    this.socket?.emit('chat:leave', chatId);
  }

  sendMessage(chatId: string, content: string, type: 'text' | 'image' | 'file' = 'text', fileUrl?: string, fileName?: string) {
    this.socket?.emit('message:send', {
      chatId,
      content,
      type,
      fileUrl,
      fileName
    });
  }

  markAsRead(chatId: string) {
    this.socket?.emit('message:read', { chatId });
  }

  startTyping(chatId: string) {
    this.socket?.emit('typing:start', { chatId });
  }

  stopTyping(chatId: string) {
    this.socket?.emit('typing:stop', { chatId });
  }

  // HTTP API calls
  async getChats(): Promise<Chat[]> {
    const response = await fetch(`${API_BASE_URL}/chat/chats`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }

    return response.json();
  }

  async getOrCreateDirectChat(recipientId: string): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chat/chats/direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ recipientId })
    });

    if (!response.ok) {
      throw new Error('Failed to create/fetch chat');
    }

    return response.json();
  }

  async getChatById(chatId: string): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chat/chats/${chatId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }

    return response.json();
  }

  async searchUsers(query: string): Promise<UserSearchResult[]> {
    const response = await fetch(`${API_BASE_URL}/chat/users/search?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to search users');
    }

    return response.json();
  }

  async getOnlineUsers(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/chat/users/online`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch online users');
    }

    return response.json();
  }

  async deleteChat(chatId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chat/chats/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete chat');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const chatService = new ChatService();
