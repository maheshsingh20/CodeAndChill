import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

// Check if API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("⚠️  GEMINI_API_KEY is not set in environment variables!");
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.0-flash"; // Use the available model
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`;

// Test endpoint to verify API key
router.get("/test-gemini", async (req: Request, res: Response) => {
  try {
    console.log("Testing Gemini API connection...");
    console.log("API Key present:", !!GEMINI_API_KEY);
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: "Say hello in one word" }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    
    const text = response.data.candidates[0].content.parts[0].text;
    
    res.json({ 
      success: true, 
      message: "Gemini API is working!",
      response: text 
    });
  } catch (error: any) {
    console.error("Test failed:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.data || "Unknown error"
    });
  }
});

// Main chat endpoint with streaming
router.post(
  "/gemini-chat",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
      }

      console.log("Sending request to Gemini API...");

      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: { 
            'Content-Type': 'application/json'
          },
          responseType: 'stream',
          timeout: 60000 // 60 second timeout
        }
      );

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");

      // Parse SSE stream
      let buffer = '';
      
      response.data.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                res.write(text);
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
          }
        }
      });

      response.data.on('end', () => {
        res.end();
      });

      response.data.on('error', (error: Error) => {
        console.error("Stream error:", error);
        if (!res.headersSent) {
          res.status(500).json({ error: "Stream error" });
        }
      });

    } catch (error: any) {
      console.error("Error in /api/gemini-chat:", error.message);
      console.error("Error details:", error.response?.data || error.cause);
      
      if (!res.headersSent) {
        res.status(500).json({ 
          error: "Failed to get response from Gemini",
          details: error.response?.data?.error?.message || error.message
        });
      }
    }
  }
);

export default router;
