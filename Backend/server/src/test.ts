import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testLatestModel() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      return;
    }

    console.log('🧪 Testing latest model: gemini-flash-latest\n');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // Test the model
    const result = await model.generateContent('Hello! What is the latest version of yourself? Reply in one sentence.');
    const response = await result.response;
    const text = response.text();

    console.log('✅ Model test successful!');
    console.log('📝 Response:', text);
    console.log('\n🎉 AI Assistant has been updated to use: gemini-flash-latest');

  } catch (error: any) {
    console.error('❌ Error testing model:', error.message);
    
    if (error.message.includes('403')) {
      console.log('💡 API key issue detected. You may need to generate a new API key.');
    } else if (error.message.includes('not found')) {
      console.log('💡 Model not available. Falling back to gemini-2.5-flash');
      
      // Test fallback model
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await fallbackModel.generateContent('Hello! Test message.');
        console.log('✅ Fallback model (gemini-2.5-flash) works!');
      } catch (fallbackError) {
        console.error('❌ Fallback model also failed:', fallbackError);
      }
    }
  }
}

// Run the test
testLatestModel();