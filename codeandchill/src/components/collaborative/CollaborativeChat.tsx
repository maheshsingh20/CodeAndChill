import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { collaborativeService, ChatMessage } from '@/services/collaborativeService';
import { Send, MessageCircle, X } from 'lucide-react';

// Simple notification helper
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
};

// Simple date formatting helper
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

interface CollaborativeChatProps {
  isOpen: boolean;
  onToggle: () => void;
  sessionToken?: string;
}

export const CollaborativeChat: React.FC<CollaborativeChatProps> = ({ isOpen, onToggle, sessionToken }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setupEventListeners();
      inputRef.current?.focus();
    }

    return () => {
      collaborativeService.off('chat-message', handleChatMessage);
      collaborativeService.off('chat-history', handleChatHistory);
    };
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setupEventListeners = () => {
    collaborativeService.on('chat-message', handleChatMessage);
    collaborativeService.on('chat-history', handleChatHistory);
  };

  const handleChatMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleChatHistory = (data: { messages: ChatMessage[] }) => {
    setMessages(data.messages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    // Get session token from props or service
    const token = sessionToken || collaborativeService.getCurrentSession()?.sessionToken;
    
    if (!token) {
      console.error('[CHAT] No session token available');
      showNotification('Not connected to a session', 'error');
      return;
    }

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    console.log('[CHAT] Sending message to session:', token);

    try {
      await collaborativeService.sendChatMessage(messageText);
      console.log('[CHAT] Message sent successfully');
    } catch (error) {
      console.error('[CHAT] Error sending message:', error);
      showNotification('Failed to send message', 'error');
      setNewMessage(messageText); // Restore message on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'text-blue-400';
      case 'code-change':
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return '🔔';
      case 'code-change':
        return '💻';
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-2xl z-50 bg-blue-600 hover:bg-blue-700 text-white animate-pulse hover:animate-none transition-all"
        size="lg"
      >
        <div className="relative">
          <MessageCircle size={28} />
          {messages.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {messages.length > 9 ? '9+' : messages.length}
            </span>
          )}
        </div>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] bg-gray-900/98 backdrop-blur-md border-gray-700 shadow-2xl z-50 flex flex-col">
      <CardHeader className="pb-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center font-semibold">
            <MessageCircle size={20} className="mr-2 text-blue-400" />
            Chat
            {messages.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {messages.length}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle} className="hover:bg-gray-800">
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-3">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs mt-1 opacity-75">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {message.type === 'system' ? (
                    <div className="text-center my-2">
                      <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {getMessageTypeIcon(message.type)} {message.message}
                      </Badge>
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800/70 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-blue-400">
                          {message.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(message.timestamp))}
                        </span>
                      </div>
                      <div className={`text-sm ${getMessageTypeColor(message.type)} break-words leading-relaxed`}>
                        {getMessageTypeIcon(message.type) && (
                          <span className="mr-1">{getMessageTypeIcon(message.type)}</span>
                        )}
                        {message.message}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-900/50">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message... (Enter to send)"
              className="flex-1 bg-gray-800 border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              disabled={!newMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Send size={14} />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
};