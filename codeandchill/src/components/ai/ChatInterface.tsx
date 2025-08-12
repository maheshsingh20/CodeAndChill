import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Send, Bot, User, Square } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utils.ts";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your AI Assistant. How can I help you with your coding journey today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null); // ⬅️ for stopping
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController(); // ⬅️ Create AbortController
    setAbortController(controller);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }),
        signal: controller.signal // ⬅️ Attach abort signal
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      const aiMessageId = Date.now() + 1;
      setMessages(prev => [...prev, { id: aiMessageId, text: "", sender: 'ai' }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });

        const jsonChunks = chunk.split('\n').filter(Boolean);

        for (const jsonChunk of jsonChunks) {
          try {
            const parsed = JSON.parse(jsonChunk);
            if (parsed.response) {
              setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, text: msg.text + parsed.response } : msg
              ));
            }
          } catch (e) {
            console.error("Failed to parse JSON chunk:", jsonChunk);
          }
        }
      }

    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        console.error("Error communicating with AI:", error);
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, an error occurred.", sender: 'ai' }]);
      }
    } finally {
      setIsLoading(false);
      setAbortController(null); // reset
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort(); // ⬅️ stop streaming
      setIsLoading(false);
    }
  };

  const renderMessageContent = (text: string) => {
    const codeRegex = /```([\s\S]*?)```/g;
    const parts = text.split(codeRegex);

    return parts.map((part, index) =>
      index % 2 === 1 ? (
        <SyntaxHighlighter
          key={index}
          language="javascript"
          style={oneDark}
          customStyle={{ borderRadius: "8px", fontSize: "0.85rem" }}
        >
          {part.trim()}
        </SyntaxHighlighter>
      ) : (
        <p key={index} className="text-sm leading-relaxed">{part}</p>
      )
    );
  };

  return (
    <Card className="rounded-2xl shadow-xl w-full h-[70vh] flex flex-col bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100 border border-cyan-200">
      <CardContent className="p-6 flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full pr-4 -mr-4 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-cyan-100 rounded-lg">
            <div className="space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-4 max-w-[90%]",
                    message.sender === 'user' ? "ml-auto justify-end" : "mr-auto justify-start"
                  )}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8 border border-cyan-400 bg-cyan-200 flex-shrink-0">
                      <AvatarFallback><Bot className="text-cyan-700" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-xl whitespace-pre-wrap break-words overflow-hidden",
                      message.sender === 'ai'
                        ? "bg-cyan-200 text-cyan-900"
                        : "bg-cyan-700 text-white"
                    )}
                    style={{ wordBreak: "break-word" }}
                  >
                    {renderMessageContent(message.text)}
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 border border-cyan-700 bg-cyan-700 flex-shrink-0">
                      <AvatarFallback><User className="text-white" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about coding..."
            className="h-11 rounded-lg border-cyan-700 focus:border-cyan-800"
            disabled={isLoading}
          />
          {isLoading ? (
            <Button onClick={handleStop} className="h-11 bg-red-600 hover:bg-red-700 text-white rounded-lg">
              <Square className="h-4 w-4" /> {/* Stop icon */}
            </Button>
          ) : (
            <Button onClick={handleSend} className="h-11 font-semibold bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg">
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
