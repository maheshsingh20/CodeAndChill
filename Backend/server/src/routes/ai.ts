import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Check if API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("⚠️  GEMINI_API_KEY is not set in environment variables!");
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-flash-latest"; // Always uses the latest Flash model automatically

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

// Test endpoint to verify API key
router.get("/test-gemini", async (req: Request, res: Response) => {
  try {
    console.log("Testing Gemini API connection...");
    console.log("API Key present:", !!GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent("Say hello in one word");
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      success: true, 
      message: "Gemini API is working!",
      response: text,
      model: MODEL_NAME
    });
  } catch (error: any) {
    console.error("Test failed:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.cause || "Unknown error"
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

      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContentStream(prompt);

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");

      // Stream the response
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          res.write(chunkText);
        }
      }

      res.end();

    } catch (error: any) {
      console.error("Error in /api/gemini-chat:", error.message);
      console.error("Error details:", error.cause || error);
      
      if (!res.headersSent) {
        res.status(500).json({ 
          error: "Failed to get response from Gemini",
          details: error.message
        });
      }
    }
  }
);

export default router;
