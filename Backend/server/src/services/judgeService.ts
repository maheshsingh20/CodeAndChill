const fetch = require('node-fetch');

export interface JudgeResult {
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  time?: string;
  memory?: number;
  token?: string;
}

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime: number;
  memoryUsed: number;
  status: string;
}

export interface SubmissionResult {
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error' | 'pending';
  testResults: TestCaseResult[];
  totalScore: number;
  executionTime: number;
  memoryUsed: number;
  passedTestCases: number;
  totalTestCases: number;
}

class JudgeService {
  private readonly RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'b6d4982d07msh833ff3a46406480p1d6adcjsn8d469455de38';
  private readonly RAPIDAPI_HOST = 'judge0-ce.p.rapidapi.com';
  private readonly BASE_URL = `https://${this.RAPIDAPI_HOST}`;

  // Language ID mappings for Judge0
  private readonly LANGUAGE_IDS = {
    'javascript': 63,
    'python': 71,
    'java': 62,
    'cpp': 54,
    'c': 50,
    'typescript': 74,
    'go': 60,
    'rust': 73,
    'csharp': 51
  };

  async executeCode(
    sourceCode: string,
    input: string,
    languageId: number,
    timeLimit: number = 2,
    memoryLimit: number = 128000
  ): Promise<JudgeResult> {
    try {
      // Submit code for execution
      const submissionResponse = await fetch(`${this.BASE_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': this.RAPIDAPI_KEY,
          'X-RapidAPI-Host': this.RAPIDAPI_HOST,
        },
        body: JSON.stringify({
          source_code: Buffer.from(sourceCode).toString('base64'),
          language_id: languageId,
          stdin: Buffer.from(input).toString('base64'),
          cpu_time_limit: timeLimit,
          memory_limit: memoryLimit,
          base64_encoded: true
        })
      });

      if (!submissionResponse.ok) {
        throw new Error(`Judge0 API error: ${submissionResponse.status}`);
      }

      const submission = await submissionResponse.json() as any;
      const token = submission.token;

      // Poll for result
      let result: JudgeResult;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      do {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const resultResponse = await fetch(`${this.BASE_URL}/submissions/${token}?base64_encoded=true`, {
          headers: {
            'X-RapidAPI-Key': this.RAPIDAPI_KEY,
            'X-RapidAPI-Host': this.RAPIDAPI_HOST,
          }
        });

        if (!resultResponse.ok) {
          throw new Error(`Judge0 API error: ${resultResponse.status}`);
        }

        result = await resultResponse.json() as JudgeResult;
        attempts++;
      } while (result.status.id <= 2 && attempts < maxAttempts); // Status 1 = In Queue, 2 = Processing

      return result;
    } catch (error) {
      console.error('Judge0 execution error:', error);
      throw error;
    }
  }

  async runTestCases(
    sourceCode: string,
    language: string,
    testCases: Array<{ input: string; expectedOutput: string }>
  ): Promise<SubmissionResult> {
    console.log(`🔍 Running test cases for language: ${language}`);
    console.log(`📝 Source code length: ${sourceCode.length}`);
    console.log(`🧪 Number of test cases: ${testCases.length}`);
    
    const languageId = this.LANGUAGE_IDS[language as keyof typeof this.LANGUAGE_IDS];
    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    console.log(`🔢 Language ID: ${languageId}`);

    const testResults: TestCaseResult[] = [];
    let totalExecutionTime = 0;
    let totalMemoryUsed = 0;
    let passedTestCases = 0;

    // Run each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        const result = await this.executeCode(sourceCode, testCase.input, languageId);
        
        let actualOutput = '';
        let status = 'Unknown';
        let passed = false;
        
        // Parse result based on status
        if (result.status.id === 3) { // Accepted
          actualOutput = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';
          passed = actualOutput.trim() === testCase.expectedOutput.trim();
          status = passed ? 'Accepted' : 'Wrong Answer';
        } else if (result.status.id === 4) { // Wrong Answer
          actualOutput = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';
          status = 'Wrong Answer';
        } else if (result.status.id === 5) { // Time Limit Exceeded
          status = 'Time Limit Exceeded';
        } else if (result.status.id === 6) { // Compilation Error
          actualOutput = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '';
          status = 'Compilation Error';
        } else if (result.status.id >= 7 && result.status.id <= 12) { // Runtime Errors
          actualOutput = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '';
          status = 'Runtime Error';
        } else {
          status = result.status.description;
        }

        const executionTime = parseFloat(result.time || '0') * 1000; // Convert to ms
        const memoryUsed = result.memory || 0;

        testResults.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          passed,
          executionTime,
          memoryUsed,
          status
        });

        if (passed) passedTestCases++;
        totalExecutionTime += executionTime;
        totalMemoryUsed = Math.max(totalMemoryUsed, memoryUsed);

      } catch (error) {
        console.error(`Error running test case ${i + 1}:`, error);
        testResults.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          passed: false,
          executionTime: 0,
          memoryUsed: 0,
          status: 'System Error'
        });
      }
    }

    // Determine overall status
    let overallStatus: SubmissionResult['status'] = 'wrong_answer';
    if (passedTestCases === testCases.length) {
      overallStatus = 'accepted';
    } else if (testResults.some(r => r.status === 'Compilation Error')) {
      overallStatus = 'compilation_error';
    } else if (testResults.some(r => r.status === 'Runtime Error')) {
      overallStatus = 'runtime_error';
    } else if (testResults.some(r => r.status === 'Time Limit Exceeded')) {
      overallStatus = 'time_limit_exceeded';
    }

    const totalScore = Math.round((passedTestCases / testCases.length) * 100);

    return {
      status: overallStatus,
      testResults,
      totalScore,
      executionTime: totalExecutionTime,
      memoryUsed: totalMemoryUsed,
      passedTestCases,
      totalTestCases: testCases.length
    };
  }

  getLanguageId(language: string): number {
    return this.LANGUAGE_IDS[language as keyof typeof this.LANGUAGE_IDS] || 71; // Default to Python
  }

  getSupportedLanguages(): string[] {
    return Object.keys(this.LANGUAGE_IDS);
  }
}

export const judgeService = new JudgeService();