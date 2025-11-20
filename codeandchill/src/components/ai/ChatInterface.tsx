/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Square } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vsDark from "react-syntax-highlighter/dist/esm/styles/prism/vs-dark";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Assistant, powered by Gemini. How can I help you today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Scroll to bottom smoothly whenever messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

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
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/gemini-chat`, {
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
      const aiMessageId = Date.now() + 1;

      // Add empty AI message to update as stream comes
      setMessages((prev) => [
        ...prev,
        { id: aiMessageId, text: "", sender: "ai" },
      ]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === Date.now() + 1 && msg.text === ""
              ? { ...msg, text: "[Response stopped by user]" }
              : msg
          )
        );
      } else {
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting to the AI service.",
          sender: "ai",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Function to render code blocks if detected
  const renderMessage = (text: string) => {
    const codeRegex = /```(.*?)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    let match;
    while ((match = codeRegex.exec(text)) !== null) {
      const [full, lang, code] = match;
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <SyntaxHighlighter
          language={lang || "javascript"}
          style={vsDark}
          key={match.index}
          className="rounded-md my-2"
        >
          {code}
        </SyntaxHighlighter>
      );
      lastIndex = match.index + full.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <Card className="rounded-2xl shadow-xl w-full h-[80vh] flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 border border-gray-700">
      <CardContent className="p-4 md:p-6 flex flex-col flex-grow min-h-0">
        <ScrollArea
          className="flex-grow min-h-0 overflow-y-auto pr-4 -mr-4"
          ref={scrollAreaRef}
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 max-w-[90%]",
                  message.sender === "user"
                    ? "ml-auto flex-row-reverse"
                    : "mr-auto"
                )}
              >
                <Avatar className="h-7 w-7 border border-gray-700 shadow-sm flex-shrink-0">
                  <AvatarFallback
                    className={cn(
                      message.sender === "ai"
                        ? "bg-cyan-900 text-cyan-300"
                        : "bg-purple-700 text-white"
                    )}
                  >
                    {message.sender === "ai" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "p-3 rounded-xl whitespace-pre-wrap break-words shadow-md text-sm leading-relaxed",
                    message.sender === "ai"
                      ? "bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none"
                      : "bg-gradient-to-r from-cyan-600 to-purple-700 text-white rounded-br-none"
                  )}
                >
                  {renderMessage(message.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-7 w-7 border border-gray-700 shadow-sm">
                  <AvatarFallback className="bg-cyan-900 text-cyan-300">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-xl bg-gray-800 border border-gray-700 shadow-md">
                  <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-4 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Ask a question about coding..."
            className="h-10 text-sm rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-cyan-400 flex-grow"
            disabled={isLoading}
          />
          {isLoading ? (
            <Button
              onClick={handleStop}
              variant="destructive"
              size="sm"
              className="h-10 w-10 rounded-md flex-shrink-0 bg-red-600 hover:bg-red-700"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              size="sm"
              className="h-10 w-10 rounded-md flex-shrink-0 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
