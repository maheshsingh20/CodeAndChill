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
}

export const CollaborativeChat: React.FC<CollaborativeChatProps> = ({ isOpen, onToggle }) => {
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

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    try {
      await collaborativeService.sendChatMessage(messageText);
    } catch (error) {
      console.error('Error sending message:', error);
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
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="lg"
      >
        <MessageCircle size={24} />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 bg-gray-800/95 backdrop-blur-sm border-gray-700 shadow-xl z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center">
            <MessageCircle size={18} className="mr-2" />
            Chat
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-full">
        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="space-y-1">
                  {message.type === 'system' ? (
                    <div className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        {getMessageTypeIcon(message.type)} {message.message}
                      </Badge>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">
                          {message.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(message.timestamp))}
                        </span>
                      </div>
                      <div className={`text-sm ${getMessageTypeColor(message.type)} break-words`}>
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
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 border-gray-600 text-white text-sm"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              disabled={!newMessage.trim() || isLoading}
            >
              <Send size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};