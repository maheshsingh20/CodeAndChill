import express from 'express';
import { CodeExecutor, TestCase } from '../services/codeExecutor';

const router = express.Router();
const codeExecutor = new CodeExecutor();

// Execute code with custom input
router.post('/execute', async (req, res) => {
  try {
    const { language, code, input = '' } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: 'Language and code are required'
      });
    }

    const result = await codeExecutor.executeCode(language, code, input);
    
    res.json({
      success: result.success,
      output: result.output,
      error: result.error,
      executionTime: result.executionTime
    });

  } catch (error: any) {
    console.error('Code execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during code execution'
    });
  }
});

// Execute code against test cases
router.post('/test', async (req, res) => {
  try {
    const { language, code, testCases, problemType = 'array' } = req.body;

    if (!language || !code || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({
        success: false,
        error: 'Language, code, and testCases are required'
      });
    }

    // Validate test cases format
    const validTestCases: TestCase[] = testCases.map((tc: any) => ({
      input: tc.input || '',
      expectedOutput: tc.expectedOutput || ''
    }));

    const results = await codeExecutor.executeTestCases(language, code, validTestCases, problemType);
    
    // Calculate statistics
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    const score = Math.round((passedCount / totalCount) * 100);

    res.json({
      success: true,
      results,
      statistics: {
        total: totalCount,
        passed: passedCount,
        failed: totalCount - passedCount,
        score
      }
    });

  } catch (error: any) {
    console.error('Test execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during test execution'
    });
  }
});

// Get supported languages
router.get('/languages', async (req, res) => {
  try {
    const availableLanguages = await codeExecutor.getAvailableLanguages();
    
    const languageMap: Record<string, { name: string, extension: string }> = {
      python: { name: 'Python', extension: '.py' },
      javascript: { name: 'JavaScript', extension: '.js' },
      java: { name: 'Java', extension: '.java' },
      cpp: { name: 'C++', extension: '.cpp' }
    };

    const supportedLanguages = availableLanguages.map(lang => ({
      id: lang,
      ...languageMap[lang]
    }));

    res.json({
      success: true,
      languages: supportedLanguages,
      available: availableLanguages
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to check available languages'
    });
  }
});

// Health check for code execution service
router.get('/health', async (req, res) => {
  try {
    // Test basic Python execution
    const testResult = await codeExecutor.executeCode('python', 'print("Hello, World!")', '');
    
    res.json({
      success: true,
      status: 'healthy',
      testExecution: {
        success: testResult.success,
        output: testResult.output,
        executionTime: testResult.executionTime
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});

export default router;