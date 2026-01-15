import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });
  }

  async generateResponse(userMessage: string, context?: any): Promise<string> {
    try {
      // Create a comprehensive prompt with platform context
      const systemPrompt = `You are an AI assistant for "Code & Chill", a comprehensive learning platform for aspiring developers. 

PLATFORM OVERVIEW:
- Code & Chill offers engineering courses (DSA, DBMS, Operating Systems, Networks, Software Engineering, Web Development)
- Interactive coding challenges and problem-solving exercises
- Skill tests and quizzes with certificates
- Career opportunities and job application system
- AI-powered learning assistance
- Community forums and learning analytics
- Real-world projects and hands-on learning

YOUR ROLE:
- Help users navigate the platform and understand features
- Provide learning guidance and course recommendations
- Assist with technical issues and troubleshooting
- Answer questions about careers, jobs, and skill development
- Explain platform features and how to use them
- Be encouraging and supportive of their learning journey

RESPONSE GUIDELINES:
- Keep responses concise but helpful (2-3 sentences max)
- Use emojis sparingly and appropriately
- Be friendly, encouraging, and professional
- If you don't know something specific about the platform, suggest they contact support
- Focus on actionable advice and clear next steps
- Mention relevant platform features when appropriate

USER CONTEXT:
${context ? `Previous conversation topics: ${context.topics?.join(', ') || 'None'}
Message count in session: ${context.messageCount || 0}` : 'New conversation'}

USER MESSAGE: "${userMessage}"

Respond as the Code & Chill AI assistant:`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      // Clean up the response
      return text.trim();
    } catch (error: any) {
      console.error('Gemini API error:', error.message);
      // Don't log full error details for quota issues
      if (error.status === 429) {
        console.log('💡 Quota exceeded - falling back to manual responses');
      }
      throw error;
    }
  }

  async isServiceAvailable(): Promise<boolean> {
    try {
      // Test with a very simple prompt to minimize quota usage
      const result = await this.model.generateContent('Hi');
      return !!result;
    } catch (error: any) {
      // Handle quota exceeded errors gracefully
      if (error.status === 429) {
        console.log('⚠️ Gemini API quota exceeded - using manual responses');
        return false;
      }
      console.error('Gemini service unavailable:', error.message);
      return false;
    }
  }

  // Generate contextual follow-up questions
  async generateFollowUpQuestions(conversation: string[]): Promise<string[]> {
    try {
      const prompt = `Based on this conversation about Code & Chill platform, suggest 3 relevant follow-up questions the user might ask:

Conversation:
${conversation.slice(-4).join('\n')}

Return only the questions, one per line, without numbers or bullets:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim().split('\n').filter((q: string) => q.trim().length > 0).slice(0, 3);
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();