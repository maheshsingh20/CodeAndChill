/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Square, Plus, MessageSquare, Trash2, History, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vsDark from "react-syntax-highlighter/dist/esm/styles/prism/vs-dark";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  feedback?: 'positive' | 'negative';
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
};

export function ChatInterface() {
  const [currentSessionId, setCurrentSessionId] = useState<string>("default");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "default",
      title: "New Chat",
      messages: [
        {
          id: 1,
          text: "Hello! I'm your AI Assistant, powered by Gemini Flash Latest. How can I help you today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      lastUpdated: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentSession = chatSessions.find(session => session.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Scroll to bottom smoothly whenever messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Save to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('ai-chat-sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai-chat-sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChatSessions(parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastUpdated: new Date(session.lastUpdated),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  const createNewChat = () => {
    const newSessionId = `chat-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Chat",
      messages: [
        {
          id: Date.now(),
          text: "Hello! I'm your AI Assistant, powered by Gemini Flash Latest. How can I help you today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setShowHistory(false);
  };

  const deleteChat = (sessionId: string) => {
    if (chatSessions.length <= 1) return; // Keep at least one chat

    setChatSessions(prev => prev.filter(session => session.id !== sessionId));

    if (currentSessionId === sessionId) {
      const remainingSessions = chatSessions.filter(session => session.id !== sessionId);
      setCurrentSessionId(remainingSessions[0]?.id || "default");
    }
  };

  const switchToChat = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setShowHistory(false);
  };

  const updateSessionTitle = (sessionId: string, firstUserMessage: string) => {
    const title = firstUserMessage.length > 30
      ? firstUserMessage.substring(0, 30) + "..."
      : firstUserMessage;

    setChatSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, title }
        : session
    ));
  };

  const addMessage = (message: Message) => {
    setChatSessions(prev => prev.map(session =>
      session.id === currentSessionId
        ? {
          ...session,
          messages: [...session.messages, message],
          lastUpdated: new Date()
        }
        : session
    ));
  };

  const updateMessage = (messageId: number, updates: Partial<Message>) => {
    setChatSessions(prev => prev.map(session =>
      session.id === currentSessionId
        ? {
          ...session,
          messages: session.messages.map(msg =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          ),
          lastUpdated: new Date()
        }
        : session
    ));
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    // Update session title if this is the first user message
    if (currentSession && currentSession.messages.filter(m => m.sender === "user").length === 0) {
      updateSessionTitle(currentSessionId, input);
    }

    addMessage(userMessage);
    setInput("");
    setIsLoading(true);

    const aiMessageId = Date.now() + 1;

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE}/gemini-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // Add empty AI message to update as stream comes
      const aiMessage: Message = {
        id: aiMessageId,
        text: "",
        sender: "ai",
        timestamp: new Date(),
      };
      addMessage(aiMessage);

      let accumulatedText = "";
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value);
        accumulatedText += chunk;

        updateMessage(aiMessageId, { text: accumulatedText });
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        updateMessage(aiMessageId, { text: "[Response stopped by user]" });
      } else {
        console.error("AI Assistant Error:", error);
        const errorMessage: Message = {
          id: aiMessageId,
          text: "Sorry, I'm having trouble connecting to the AI service. Please check your connection and try again.",
          sender: "ai",
          timestamp: new Date(),
        };
        updateMessage(aiMessageId, errorMessage);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const provideFeedback = (messageId: number, feedback: 'positive' | 'negative') => {
    updateMessage(messageId, { feedback });
  };

  // Function to render code blocks if detected
  const renderMessage = (text: string) => {
    // First handle code blocks (triple backticks)
    const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const [full, lang, code] = match;
      if (match.index > lastIndex) {
        // Process the text before the code block for inline code
        const textBefore = text.slice(lastIndex, match.index);
        parts.push(renderInlineCode(textBefore));
      }
      parts.push(
        <div key={match.index} className="relative my-3 w-full">
          <SyntaxHighlighter
            language={lang || "javascript"}
            style={vsDark}
            className="rounded-md !my-0 !bg-gray-900 !border !border-gray-700"
            customStyle={{
              margin: 0,
              padding: '12px',
              fontSize: '13px',
              lineHeight: '1.4',
              maxWidth: '100%',
              overflow: 'auto',
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap'
            }}
            wrapLongLines={true}
          >
            {code}
          </SyntaxHighlighter>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 h-auto bg-gray-800/80 hover:bg-gray-700/80"
            onClick={() => copyToClipboard(code)}
          >
            <Copy size={10} className="md:hidden" />
            <Copy size={12} className="hidden md:block" />
          </Button>
        </div>
      );
      lastIndex = match.index + full.length;
    }

    if (lastIndex < text.length) {
      // Process remaining text for inline code
      const remainingText = text.slice(lastIndex);
      parts.push(renderInlineCode(remainingText));
    }

    return parts.length > 0 ? parts : renderInlineCode(text);
  };

  // Function to render inline code (single backticks)
  const renderInlineCode = (text: string) => {
    const inlineCodeRegex = /`([^`]+)`/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    let match;
    while ((match = inlineCodeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <code
          key={match.index}
          className="bg-gray-700 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {match[1]}
        </code>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="flex h-[80vh] w-full gap-2 md:gap-4 overflow-hidden">
      {/* Sidebar - Chat History */}
      <div className={cn(
        "transition-all duration-300 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 border border-gray-700 rounded-2xl flex-shrink-0",
        showHistory ? "w-72 md:w-80" : "w-12 md:w-16"
      )}>
        <div className="p-2 md:p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-gray-400 hover:text-white p-1 md:p-2"
            >
              <History size={14} className="md:hidden" />
              <History size={16} className="hidden md:block" />
            </Button>
            {showHistory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={createNewChat}
                className="text-gray-400 hover:text-white p-1 md:p-2"
              >
                <Plus size={14} className="md:hidden" />
                <Plus size={16} className="hidden md:block" />
              </Button>
            )}
          </div>

          {/* Chat List */}
          {showHistory && (
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                      currentSessionId === session.id
                        ? "bg-gray-700 border border-gray-600"
                        : "hover:bg-gray-800 border border-transparent"
                    )}
                    onClick={() => switchToChat(session.id)}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <MessageSquare size={12} className="text-gray-400 flex-shrink-0 md:hidden" />
                      <MessageSquare size={14} className="text-gray-400 flex-shrink-0 hidden md:block" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-gray-200 truncate">{session.title}</p>
                        <p className="text-xs text-gray-500">
                          {session.lastUpdated.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {chatSessions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1 h-auto"
                      >
                        <Trash2 size={12} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <Card className="flex-1 rounded-2xl shadow-xl flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 border border-gray-700 min-w-0 overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="text-cyan-400" size={18} />
              <div>
                <h3 className="font-semibold text-white text-sm md:text-base">{currentSession?.title || "AI Assistant"}</h3>
                <p className="text-xs text-gray-400">Powered by Gemini Flash Latest</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={createNewChat}
                className="text-gray-400 hover:text-white p-1 md:p-2"
              >
                <Plus size={14} className="md:hidden" />
                <Plus size={16} className="hidden md:block" />
                <span className="ml-1 hidden sm:inline text-xs md:text-sm">New Chat</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0 px-3 md:px-4 lg:px-6 pb-4 md:pb-6 overflow-hidden">
          <ScrollArea
            className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2"
            ref={scrollAreaRef}
          >
            <div className="space-y-4 py-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-2 md:gap-3 w-full",
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  )}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-6 w-6 md:h-7 md:w-7 border border-gray-700 shadow-sm flex-shrink-0">
                      <AvatarFallback className="bg-cyan-900 text-cyan-300">
                        <Bot className="h-3 w-3 md:h-4 md:w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={cn(
                    "flex flex-col space-y-1 max-w-[85%] min-w-0",
                    message.sender === "user" ? "items-end" : "items-start"
                  )}>
                    <div
                      className={cn(
                        "p-2 md:p-3 rounded-xl shadow-md text-xs md:text-sm leading-relaxed w-full overflow-hidden",
                        message.sender === "ai"
                          ? "bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none"
                          : "bg-gradient-to-r from-cyan-600 to-purple-700 text-white rounded-br-none max-w-md"
                      )}
                      style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {renderMessage(message.text)}
                      </div>
                    </div>

                    {/* Message Actions */}
                    {message.sender === "ai" && message.text && (
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1 px-1">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => provideFeedback(message.id, 'positive')}
                            className={cn(
                              "p-1 h-auto",
                              message.feedback === 'positive' ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
                            )}
                          >
                            <ThumbsUp size={10} className="md:hidden" />
                            <ThumbsUp size={12} className="hidden md:block" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => provideFeedback(message.id, 'negative')}
                            className={cn(
                              "p-1 h-auto",
                              message.feedback === 'negative' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                            )}
                          >
                            <ThumbsDown size={10} className="md:hidden" />
                            <ThumbsDown size={12} className="hidden md:block" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.text)}
                            className="p-1 h-auto text-gray-400 hover:text-white"
                          >
                            <Copy size={10} className="md:hidden" />
                            <Copy size={12} className="hidden md:block" />
                          </Button>
                        </div>
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="h-6 w-6 md:h-7 md:w-7 border border-gray-700 shadow-sm flex-shrink-0">
                      <AvatarFallback className="bg-purple-700 text-white">
                        <User className="h-3 w-3 md:h-4 md:w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2 md:gap-3">
                  <Avatar className="h-6 w-6 md:h-7 md:w-7 border border-gray-700 shadow-sm">
                    <AvatarFallback className="bg-cyan-900 text-cyan-300">
                      <Bot className="h-3 w-3 md:h-4 md:w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-2 md:p-3 rounded-xl bg-gray-800 border border-gray-700 shadow-md">
                    <div className="flex items-center space-x-1">
                      <span className="h-1.5 w-1.5 md:h-2 md:w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                      <span className="h-1.5 w-1.5 md:h-2 md:w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                      <span className="h-1.5 w-1.5 md:h-2 md:w-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-3 md:mt-4 flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
              placeholder="Ask a question about coding..."
              className="h-9 md:h-10 text-xs md:text-sm rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-cyan-400 flex-grow"
              disabled={isLoading}
            />
            {isLoading ? (
              <Button
                onClick={handleStop}
                variant="destructive"
                size="sm"
                className="h-9 w-9 md:h-10 md:w-10 rounded-md flex-shrink-0 bg-red-600 hover:bg-red-700"
              >
                <Square className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSend}
                size="sm"
                className="h-9 w-9 md:h-10 md:w-10 rounded-md flex-shrink-0 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-md"
              >
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
