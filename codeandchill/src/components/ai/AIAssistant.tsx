import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  codeContext?: string;
  feedback?: 'positive' | 'negative';
}

interface AIAssistantProps {
  courseContext?: string;
  problemContext?: string;
  onCodeSuggestion?: (code: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  courseContext,
  problemContext,
  onCodeSuggestion
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m your AI coding assistant. I can help you with:\n\n• Explaining concepts\n• Debugging code\n• Suggesting solutions\n• Code optimization\n• Best practices\n\nWhat would you like to work on today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual AI service)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponse = generateAIResponse(userMessage.content, courseContext, problemContext);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string, courseCtx?: string, problemCtx?: string): string => {
    const input = userInput.toLowerCase();
    
    // Simple response generation (replace with actual AI)
    if (input.includes('debug') || input.includes('error')) {
      return `I'd be happy to help you debug! Here are some common debugging steps:

1. **Check the console** for error messages
2. **Add console.log()** statements to trace execution
3. **Verify variable types** and values
4. **Check syntax** for missing brackets, semicolons, etc.

Could you share the specific error message or code you're having trouble with?`;
    }
    
    if (input.includes('optimize') || input.includes('performance')) {
      return `Here are some code optimization tips:

## Performance Optimization
- Use efficient algorithms and data structures
- Minimize DOM manipulations
- Implement lazy loading for large datasets
- Use memoization for expensive calculations

## Code Quality
- Follow DRY (Don't Repeat Yourself) principle
- Use meaningful variable names
- Keep functions small and focused
- Add proper error handling

Would you like me to review a specific piece of code?`;
    }
    
    if (input.includes('explain') || input.includes('concept')) {
      return `I'd love to explain programming concepts! Here are some areas I can help with:

• **Data Structures**: Arrays, Objects, Maps, Sets
• **Algorithms**: Sorting, searching, recursion
• **JavaScript**: Promises, async/await, closures
• **React**: Hooks, state management, lifecycle
• **Best Practices**: Clean code, testing, documentation

What specific concept would you like me to explain?`;
    }
    
    if (input.includes('code') && (input.includes('example') || input.includes('show'))) {
      return `Here's a code example for a common pattern:

\`\`\`javascript
// Async data fetching with error handling
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Usage
fetchData('/api/users')
  .then(users => console.log(users))
  .catch(error => console.error('Failed to fetch users:', error));
\`\`\`

Would you like me to explain any part of this code or show examples for other patterns?`;
    }
    
    // Default response
    return `I understand you're asking about "${userInput}". I'm here to help with coding questions, debugging, explanations, and best practices. 

Could you provide more details about what you'd like to work on? For example:
- Share code you need help with
- Ask about specific programming concepts
- Request debugging assistance
- Get code review feedback

The more context you provide, the better I can assist you!`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const provideFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep the initial greeting
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] bg-gray-900/50 backdrop-blur-sm border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Bot className="text-purple-400" size={20} />
          <h3 className="font-semibold text-white">AI Assistant</h3>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="text-gray-400 hover:text-white"
        >
          <RotateCcw size={16} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-2' : 'mr-2'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-purple-600' 
                    : 'bg-gray-700'
                }`}>
                  {message.type === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-purple-400" />
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className={`rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}>
                {message.type === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      code({ node, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const inline = props.inline;
                        return !inline && match ? (
                          <div className="relative">
                            <SyntaxHighlighter
                              style={vscDarkPlus as any}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-md my-2"
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 text-gray-400 hover:text-white"
                              onClick={() => copyToClipboard(String(children))}
                            >
                              <Copy size={14} />
                            </Button>
                          </div>
                        ) : (
                          <code className="bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}

                {/* Message Actions */}
                {message.type === 'assistant' && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => provideFeedback(message.id, 'positive')}
                        className={`p-1 h-auto ${
                          message.feedback === 'positive' ? 'text-green-400' : 'text-gray-400'
                        }`}
                      >
                        <ThumbsUp size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => provideFeedback(message.id, 'negative')}
                        className={`p-1 h-auto ${
                          message.feedback === 'negative' ? 'text-red-400' : 'text-gray-400'
                        }`}
                      >
                        <ThumbsDown size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content)}
                        className="p-1 h-auto text-gray-400 hover:text-white"
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                <Bot size={16} className="text-purple-400" />
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about coding..."
            className="flex-1 min-h-[40px] max-h-[120px] bg-gray-800 border-gray-600 text-white resize-none"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send size={16} />
          </Button>
        </div>
        
        {(courseContext || problemContext) && (
          <div className="flex space-x-2 mt-2">
            {courseContext && (
              <Badge variant="outline" className="text-xs">
                Course: {courseContext}
              </Badge>
            )}
            {problemContext && (
              <Badge variant="outline" className="text-xs">
                Problem: {problemContext}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};