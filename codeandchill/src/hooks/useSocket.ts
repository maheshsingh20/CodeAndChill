import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  autoConnect?: boolean;
  token?: string;
}

interface SocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { autoConnect = true, token } = options;
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<SocketState>({
    connected: false,
    connecting: false,
    error: null
  });

  const connect = () => {
    if (socketRef.current?.connected) return;

    setState(prev => ({ ...prev, connecting: true, error: null }));

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      retries: 3
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setState({ connected: true, connecting: false, error: null });
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setState(prev => ({ ...prev, connected: false, connecting: false }));
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setState(prev => ({ 
        ...prev, 
        connected: false, 
        connecting: false, 
        error: error.message 
      }));
    });

    socketRef.current = socket;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState({ connected: false, connecting: false, error: null });
    }
  };

  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  useEffect(() => {
    if (autoConnect && token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, token]);

  return {
    socket: socketRef.current,
    ...state,
    connect,
    disconnect,
    emit,
    on,
    off
  };
};

export default useSocket;