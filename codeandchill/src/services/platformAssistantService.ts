interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  startTime: Date;
  lastActivity: Date;
}

class PlatformAssistantService {
  private sessions: Map<string, ChatSession> = new Map();
  private currentSessionId: string | null = null;

  // Initialize a new chat session
  startSession(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      startTime: new Date(),
      lastActivity: new Date()
    };
    
    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;
    return sessionId;
  }

  // Add message to current session
  addMessage(message: ChatMessage): void {
    if (!this.currentSessionId) {
      this.startSession();
    }
    
    const session = this.sessions.get(this.currentSessionId!);
    if (session) {
      session.messages.push(message);
      session.lastActivity = new Date();
    }
  }

  // Get current session messages
  getCurrentMessages(): ChatMessage[] {
    if (!this.currentSessionId) return [];
    const session = this.sessions.get(this.currentSessionId);
    return session?.messages || [];
  }

  // Generate response using manual responses only
  async generateResponse(userMessage: string): Promise<string> {
    console.log('💬 Using manual responses');
    return this.getManualResponse(userMessage);
  }

  // Manual response generator
  private getManualResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('course') || message.includes('learn')) {
      const responses = [
        "Great question about courses! 📚 You can find all our courses in the 'Courses' section. We offer engineering courses like DSA, DBMS, Operating Systems, and more.",
        "Looking to learn something new? 🎓 Our course catalog includes comprehensive engineering subjects with hands-on projects and progress tracking.",
        "Our courses are designed for practical learning! 💡 Each course includes video lessons, coding exercises, quizzes, and real-world projects."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('problem') || message.includes('coding') || message.includes('solve')) {
      const responses = [
        "Looking to practice coding? 💻 Check out our 'Problems' section where you can solve coding challenges and improve your problem-solving skills!",
        "Ready for some coding challenges? 🚀 Our problem sets cover algorithms, data structures, and programming concepts.",
        "Practice makes perfect! 🎯 Our coding problems range from beginner to advanced levels with detailed explanations."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('career') || message.includes('job')) {
      const responses = [
        "Interested in career opportunities? 🚀 Visit our 'Careers' section to browse available positions and apply for jobs.",
        "Building your career in tech? 💼 Our careers section offers job listings, application tracking, and career development resources.",
        "Your next opportunity awaits! ✨ Browse through our curated job listings and get career guidance from industry experts."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      const responses = [
        "Hello there! 👋 Welcome to Code & Chill! I'm here to help you navigate our platform. What can I assist you with today?",
        "Hi! 😊 Great to see you on Code & Chill! I'm your platform assistant, ready to help with anything platform-related.",
        "Welcome! 🎉 I'm here to help you get the most out of Code & Chill. How can I assist you?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('error') || message.includes('bug') || message.includes('not working')) {
      const responses = [
        "Sorry to hear you're experiencing issues! 🔧 Please try refreshing the page first. If the problem persists, clear your browser cache or try a different browser.",
        "Let's get this sorted out! 🛠️ Most issues can be resolved by refreshing the page or clearing your browser cache.",
        "Technical hiccups happen! ⚡ Try these quick fixes: refresh the page, check your internet connection, or clear your browser cache."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default fallback
    return "I'm here to help with Code & Chill! 🤔 I can assist with courses, coding problems, careers, and platform features. What would you like to know?";
  }

  // Get conversation context for better responses
  getConversationContext(): any {
    if (!this.currentSessionId) return null;
    
    const session = this.sessions.get(this.currentSessionId);
    if (!session) return null;

    return {
      messageCount: session.messages.length,
      sessionDuration: Date.now() - session.startTime.getTime(),
      lastMessages: session.messages.slice(-5), // Last 5 messages for context
      topics: this.extractTopics(session.messages)
    };
  }

  // Get follow-up questions
  async getFollowUpQuestions(): Promise<string[]> {
    return [
      "How do I get started with learning?",
      "What courses do you recommend?",
      "Tell me about career opportunities"
    ];
  }

  // Check service health
  async checkServiceHealth(): Promise<{ status: string; service: string; mode: string }> {
    return {
      status: 'ok',
      service: 'platform-assistant',
      mode: 'manual responses'
    };
  }

  // Extract topics from conversation for context
  private extractTopics(messages: ChatMessage[]): string[] {
    const topics = new Set<string>();
    const keywords = {
      courses: ['course', 'learn', 'study', 'lesson'],
      problems: ['problem', 'coding', 'solve', 'challenge'],
      careers: ['career', 'job', 'work', 'interview'],
      technical: ['error', 'bug', 'issue', 'not working'],
      progress: ['progress', 'track', 'analytics', 'achievement']
    };

    messages.forEach(message => {
      const text = message.text.toLowerCase();
      Object.entries(keywords).forEach(([topic, words]) => {
        if (words.some(word => text.includes(word))) {
          topics.add(topic);
        }
      });
    });

    return Array.from(topics);
  }

  // Clear current session
  clearSession(): void {
    if (this.currentSessionId) {
      this.sessions.delete(this.currentSessionId);
      this.currentSessionId = null;
    }
  }

  // Get session statistics
  getSessionStats(): any {
    return {
      totalSessions: this.sessions.size,
      currentSession: this.currentSessionId,
      averageMessagesPerSession: this.calculateAverageMessages()
    };
  }

  private calculateAverageMessages(): number {
    if (this.sessions.size === 0) return 0;
    
    const totalMessages = Array.from(this.sessions.values())
      .reduce((sum, session) => sum + session.messages.length, 0);
    
    return totalMessages / this.sessions.size;
  }
}

export const platformAssistantService = new PlatformAssistantService();
export type { ChatMessage, ChatSession };