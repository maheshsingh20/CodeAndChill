import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { platformAssistantService, ChatMessage } from '@/services/platformAssistantService';

interface PlatformAssistantWidgetProps {
  className?: string;
}

export const PlatformAssistantWidget: React.FC<PlatformAssistantWidgetProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your Code & Chill assistant. I'm here to help you with any questions about our platform, courses, features, or technical issues. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat session
  useEffect(() => {
    platformAssistantService.startSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    platformAssistantService.addMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get context and generate response
      const context = platformAssistantService.getConversationContext();
      const responseText = await platformAssistantService.generateResponse(inputMessage);

      const assistantResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantResponse]);
      platformAssistantService.addMessage(assistantResponse);
    } catch (error) {
      console.error('Error generating response:', error);
      // Fallback response
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble right now. Please try again in a moment! 🤖",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
      platformAssistantService.addMessage(fallbackResponse);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: "How do I start learning?", icon: "📚" },
    { text: "I need help with a technical issue", icon: "🔧" },
    { text: "Tell me about career opportunities", icon: "🚀" },
    { text: "How do I track my progress?", icon: "📈" }
  ];

  const handleQuickAction = (text: string) => {
    setInputMessage(text);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        text: "Hi! I'm your Code & Chill assistant. I'm here to help you with any questions about our platform, courses, features, or technical issues. How can I assist you today?",
        sender: 'assistant',
        timestamp: new Date()
      }
    ]);
    platformAssistantService.clearSession();
    platformAssistantService.startSession();
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-20"></div>

          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 shadow-2xl transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
        <CardHeader className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <CardTitle className="text-white text-sm">Platform Assistant</CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-gray-400 text-xs">Always here to help</p>
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0">
                    Smart Responses
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearConversation}
                className="text-gray-400 hover:text-white p-1 h-8 w-8"
                title="Clear conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-white p-1 h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(500px-80px)]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'assistant' && (
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-auto'
                        : 'bg-gray-800 text-gray-200'
                        }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                        }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.sender === 'user' && (
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-800 text-gray-200 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-gray-700">
                <p className="text-gray-400 text-xs mb-3">Quick actions:</p>
                <div className="grid grid-cols-1 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction(action.text)}
                      className="text-left justify-start text-gray-300 hover:text-white hover:bg-gray-800 p-2 h-auto"
                    >
                      <span className="mr-2">{action.icon}</span>
                      <span className="text-xs">{action.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about Code & Chill..."
                  className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};