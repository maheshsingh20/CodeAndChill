import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Send,
  Search,
  User,
  Trash2,
  Circle,
  Sparkles
} from 'lucide-react';
import { chatService, Chat, ChatMessage, UserSearchResult } from '@/services/chatService';
import { useUser } from '@/contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatPage: React.FC = () => {
  const { user } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      chatService.connect(token);
      loadChats();
    }

    chatService.on('message:new', handleNewMessage);
    chatService.on('typing:start', handleTypingStart);
    chatService.on('typing:stop', handleTypingStop);
    chatService.on('user:online', handleUserOnline);
    chatService.on('user:offline', handleUserOffline);

    return () => {
      chatService.off('message:new', handleNewMessage);
      chatService.off('typing:start', handleTypingStart);
      chatService.off('typing:stop', handleTypingStop);
      chatService.off('user:online', handleUserOnline);
      chatService.off('user:offline', handleUserOffline);

      if (selectedChat) {
        chatService.leaveChat(selectedChat._id);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-scroll when typing indicator changes
    if (typingUsers.size > 0) {
      scrollToBottom();
    }
  }, [typingUsers]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const loadChats = async () => {
    try {
      const fetchedChats = await chatService.getChats();
      setChats(fetchedChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const handleNewMessage = (data: { chatId: string; message: ChatMessage }) => {
    if (selectedChat?._id === data.chatId) {
      setMessages(prev => [...prev, data.message]);
      chatService.markAsRead(data.chatId);
    }
    loadChats();
  };

  const handleTypingStart = (data: { chatId: string; userId: string }) => {
    if (selectedChat?._id === data.chatId) {
      setTypingUsers(prev => new Set(prev).add(data.userId));
    }
  };

  const handleTypingStop = (data: { chatId: string; userId: string }) => {
    if (selectedChat?._id === data.chatId) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    }
  };

  const handleUserOnline = () => loadChats();
  const handleUserOffline = () => loadChats();

  const handleSelectChat = async (chat: Chat) => {
    if (selectedChat) {
      chatService.leaveChat(selectedChat._id);
    }
    setSelectedChat(chat);
    setMessages(chat.messages);
    chatService.joinChat(chat._id);
    chatService.markAsRead(chat._id);
    loadChats();
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedChat) return;
    chatService.sendMessage(selectedChat._id, inputMessage);
    setInputMessage('');
    setIsTyping(false);
    chatService.stopTyping(selectedChat._id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (!selectedChat) return;

    if (!isTyping) {
      setIsTyping(true);
      chatService.startTyping(selectedChat._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      chatService.stopTyping(selectedChat._id);
    }, 2000) as unknown as number;
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await chatService.searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleStartChat = async (userId: string) => {
    try {
      const chat = await chatService.getOrCreateDirectChat(userId);
      await loadChats();
      handleSelectChat(chat);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      await chatService.deleteChat(chatId);
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
      loadChats();
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participantDetails.find(p => p.userId !== user?._id);
  };

  const getUnreadCount = (chat: Chat): number => {
    if (!user?._id) return 0;
    return chat.unreadCount?.[user._id] || 0;
  };

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <MessageCircle className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Messages
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Connect and chat with other developers in real-time
          </p>
        </motion.header>

        {/* Chat Container - ABSOLUTE Fixed Height */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden" style={{ height: '600px', maxHeight: '600px' }}>
          {/* Chat List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
            style={{ height: '600px', maxHeight: '600px' }}
          >
            <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col" style={{ height: '600px', maxHeight: '600px' }}>
              <div className="p-5 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h2 className="text-lg font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                    Conversations
                  </h2>
                </div>

                {/* Search Users */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search users..."
                    className="pl-10 bg-black/50 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 h-10"
                  />
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-20 w-[calc(100%-2.5rem)] mt-2 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
                    >
                      {searchResults.map(searchUser => (
                        <button
                          key={searchUser._id}
                          onClick={() => handleStartChat(searchUser._id)}
                          className="w-full p-3 hover:bg-gray-800/50 flex items-center gap-3 text-left transition-all border-b border-gray-800 last:border-0"
                        >
                          <div className="relative flex-shrink-0">
                            {searchUser.avatar ? (
                              <img src={searchUser.avatar} alt={searchUser.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                            )}
                            {searchUser.isOnline && (
                              <Circle className="absolute bottom-0 right-0 w-2.5 h-2.5 fill-green-400 text-green-400 border-2 border-black rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{searchUser.name}</p>
                            <p className="text-gray-400 text-xs truncate">{searchUser.email}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat List - Scrollable */}
              <div className="overflow-y-auto" style={{ height: '460px', maxHeight: '460px', minHeight: '460px' }}>
                <div className="p-3 space-y-2">
                  {chats.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm mb-1">No conversations yet</p>
                      <p className="text-xs">Search for users to start chatting</p>
                    </div>
                  ) : (
                    chats.map(chat => {
                      const otherUser = getOtherParticipant(chat);
                      const unreadCount = getUnreadCount(chat);

                      return (
                        <motion.button
                          key={chat._id}
                          onClick={() => handleSelectChat(chat)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`w-full p-3 rounded-lg flex items-center gap-3 text-left transition-all ${selectedChat?._id === chat._id
                            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50'
                            : 'hover:bg-gray-800/50 border border-transparent'
                            }`}
                        >
                          <div className="relative flex-shrink-0">
                            {otherUser?.avatar ? (
                              <img src={otherUser.avatar} alt={otherUser.name} className="w-11 h-11 rounded-full object-cover" />
                            ) : (
                              <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                            )}
                            {otherUser?.isOnline && (
                              <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-400 text-green-400 border-2 border-black rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-white font-semibold text-sm truncate">{otherUser?.name}</p>
                              {unreadCount > 0 && (
                                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-1.5 py-0">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs truncate">
                              {chat.lastMessage || 'Start a conversation'}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
            style={{ height: '600px', maxHeight: '600px' }}
          >
            <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col" style={{ height: '600px', maxHeight: '600px' }}>
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-5 border-b border-gray-700 bg-black/30 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          {getOtherParticipant(selectedChat)?.avatar ? (
                            <img
                              src={getOtherParticipant(selectedChat)?.avatar}
                              alt={getOtherParticipant(selectedChat)?.name}
                              className="w-11 h-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                          {getOtherParticipant(selectedChat)?.isOnline && (
                            <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-400 text-green-400 border-2 border-black rounded-full" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                            {getOtherParticipant(selectedChat)?.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {getOtherParticipant(selectedChat)?.isOnline ? (
                              <span className="flex items-center gap-1">
                                <Circle className="w-1.5 h-1.5 fill-green-400 text-green-400" />
                                Online
                              </span>
                            ) : (
                              'Offline'
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteChat(selectedChat._id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 h-9 w-9 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages Area - Scrollable */}
                  <div className="overflow-y-auto p-5" style={{ height: '440px', maxHeight: '440px', minHeight: '440px' }}>
                    <div className="space-y-3">
                      {messages.map((message, index) => {
                        const isOwn = message.senderId === user?._id;
                        return (
                          <motion.div
                            key={message._id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[75%] p-3 rounded-2xl ${isOwn
                                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-br-sm'
                                : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700'
                                }`}
                            >
                              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                {message.content}
                              </p>
                              <p className={`text-xs mt-1.5 ${isOwn ? 'text-purple-100' : 'text-gray-500'}`}>
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Typing Indicator */}
                      <AnimatePresence>
                        {typingUsers.size > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex justify-start"
                          >
                            <div className="bg-gray-800 text-gray-200 p-3 rounded-2xl rounded-bl-sm border border-gray-700">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-5 border-t border-gray-700 bg-black/30 flex-shrink-0">
                    <div className="flex gap-3">
                      <Input
                        value={inputMessage}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 bg-black/50 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 h-11"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed h-11 px-5"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-sm text-gray-500">
                      Choose a chat from the list or search for users to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
