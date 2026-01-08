import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getTemplate, ProblemTemplate } from './problemTemplates';

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface TestResult {
  passed: boolean;
  status: string;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  executionError?: string;
}

export class CodeExecutor {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
    this.ensureTempDir();
  }

  private async ensureTempDir() {
    try {
      await fs.access(this.tempDir);
    } catch {
      await fs.mkdir(this.tempDir, { recursive: true });
    }
  }

  // Execute Python code with proper stdin handling
  async executePython(code: string, input: string = '', timeout: number = 5000): Promise<ExecutionResult> {
    const startTime = Date.now();
    const fileId = uuidv4();
    const filePath = path.join(this.tempDir, `${fileId}.py`);

    try {
      // Write code to temporary file
      await fs.writeFile(filePath, code);

      // Execute Python code with proper stdin handling
      const result = await this.runCommandWithStdin('python', [filePath], input, timeout);
      const executionTime = Date.now() - startTime;

      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        executionTime: Date.now() - startTime
      };
    } finally {
      // Clean up temporary file
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  // Execute JavaScript/Node.js code
  async executeJavaScript(code: string, input: string = '', timeout: number = 5000): Promise<ExecutionResult> {
    const startTime = Date.now();
    const fileId = uuidv4();
    const filePath = path.join(this.tempDir, `${fileId}.js`);

    try {
      // Write code to temporary file
      await fs.writeFile(filePath, code);

      // Execute Node.js code
      const result = await this.runCommand('node', [filePath], input, timeout);
      const executionTime = Date.now() - startTime;

      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        executionTime: Date.now() - startTime
      };
    } finally {
      // Clean up temporary file
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  // Execute Java code
  async executeJava(code: string, input: string = '', timeout: number = 10000): Promise<ExecutionResult> {
    const startTime = Date.now();
    const fileId = uuidv4();
    const className = this.extractJavaClassName(code) || 'Solution';
    const filePath = path.join(this.tempDir, `${className}.java`);
    const classPath = path.join(this.tempDir, `${className}.class`);

    try {
      // Write code to temporary file
      await fs.writeFile(filePath, code);

      // Compile Java code
      const compileResult = await this.runCommand('javac', [filePath], '', timeout);
      if (!compileResult.success) {
        return {
          success: false,
          output: '',
          error: `Compilation Error: ${compileResult.error}`,
          executionTime: Date.now() - startTime
        };
      }

      // Execute Java code
      const result = await this.runCommand('java', ['-cp', this.tempDir, className], input, timeout);
      const executionTime = Date.now() - startTime;

      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        executionTime: Date.now() - startTime
      };
    } finally {
      // Clean up temporary files
      try {
        await fs.unlink(filePath);
        await fs.unlink(classPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  // Execute C++ code
  async executeCpp(code: string, input: string = '', timeout: number = 10000): Promise<ExecutionResult> {
    const startTime = Date.now();
    const fileId = uuidv4();
    const sourceFile = path.join(this.tempDir, `${fileId}.cpp`);
    const executableFile = path.join(this.tempDir, `${fileId}.exe`);

    try {
      // Write code to temporary file
      await fs.writeFile(sourceFile, code);

      // Compile C++ code
      const compileResult = await this.runCommand('g++', ['-o', executableFile, sourceFile], '', timeout);
      if (!compileResult.success) {
        return {
          success: false,
          output: '',
          error: `Compilation Error: ${compileResult.error}`,
          executionTime: Date.now() - startTime
        };
      }

      // Execute C++ code
      const result = await this.runCommand(executableFile, [], input, timeout);
      const executionTime = Date.now() - startTime;

      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        executionTime: Date.now() - startTime
      };
    } finally {
      // Clean up temporary files
      try {
        await fs.unlink(sourceFile);
        await fs.unlink(executableFile);
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  // Generic command runner with timeout
  private runCommand(command: string, args: string[], input: string, timeout: number): Promise<{success: boolean, output: string, error: string}> {
    return new Promise((resolve) => {
      const process = spawn(command, args);
      let output = '';
      let error = '';
      let isResolved = false;

      // Set timeout
      const timer = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          process.kill();
          resolve({
            success: false,
            output: '',
            error: 'Execution timeout'
          });
        }
      }, timeout);

      // Handle stdout
      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      // Handle stderr
      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      // Handle process completion
      process.on('close', (code) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          resolve({
            success: code === 0,
            output: output.trim(),
            error: error.trim()
          });
        }
      });

      // Handle process error
      process.on('error', (err) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          resolve({
            success: false,
            output: '',
            error: err.message
          });
        }
      });

      // Send input to process
      if (input) {
        process.stdin.write(input);
        process.stdin.end();
      } else {
        process.stdin.end();
      }
    });
  }

  // PROPER stdin handling for competitive programming
  private runCommandWithStdin(command: string, args: string[], input: string, timeout: number): Promise<{success: boolean, output: string, error: string}> {
    return new Promise((resolve) => {
      const process = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'] // Explicitly set stdio pipes
      });
      
      let output = '';
      let error = '';
      let isResolved = false;

      // Set timeout
      const timer = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          process.kill('SIGTERM');
          resolve({
            success: false,
            output: '',
            error: 'Execution timeout'
          });
        }
      }, timeout);

      // Handle stdout (program output)
      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      // Handle stderr (error output)
      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      // Handle process completion
      process.on('close', (code) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          resolve({
            success: code === 0,
            output: output.trim(),
            error: error.trim()
          });
        }
      });

      // Handle process error (spawn failure)
      process.on('error', (err) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          resolve({
            success: false,
            output: '',
            error: `Process error: ${err.message}`
          });
        }
      });

      // CRITICAL: Proper stdin handling
      if (input && input.trim()) {
        // Write input data
        process.stdin.write(input);
        // Add newline if not present (many Python programs expect it)
        if (!input.endsWith('\n')) {
          process.stdin.write('\n');
        }
      }
      
      // ALWAYS close stdin to signal EOF
      process.stdin.end();
    });
  }

  // Extract Java class name from code
  private extractJavaClassName(code: string): string | null {
    const match = code.match(/public\s+class\s+(\w+)/);
    return match ? match[1] : null;
  }

  // Execute code based on language
  async executeCode(language: string, code: string, input: string = ''): Promise<ExecutionResult> {
    switch (language.toLowerCase()) {
      case 'python':
        return this.executePython(code, input);
      case 'javascript':
      case 'js':
        return this.executeJavaScript(code, input);
      case 'java':
        // Check if Java is available
        try {
          await this.runCommand('javac', ['-version'], '', 1000);
          return this.executeJava(code, input);
        } catch (error) {
          return {
            success: false,
            output: '',
            error: 'Java compiler (javac) is not installed on this system',
            executionTime: 0
          };
        }
      case 'cpp':
      case 'c++':
        // Check if C++ compiler is available
        try {
          await this.runCommand('g++', ['--version'], '', 1000);
          return this.executeCpp(code, input);
        } catch (error) {
          return {
            success: false,
            output: '',
            error: 'C++ compiler (g++) is not installed on this system',
            executionTime: 0
          };
        }
      default:
        return {
          success: false,
          output: '',
          error: `Unsupported language: ${language}`,
          executionTime: 0
        };
    }
  }

  // Execute code against multiple test cases (LeetCode style)
  async executeTestCases(language: string, code: string, testCases: TestCase[], problemType: string = 'array'): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const template = getTemplate('hybrid'); // Use hybrid template for flexibility

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        let executionResult;
        
        if (language === 'python') {
          // For Python, use the template system
          const wrappedCode = template.wrapUserCode(code, testCase.input, problemType);
          executionResult = await this.executePython(wrappedCode, ''); // No stdin needed, input is embedded
        } else {
          // For other languages, use the old method
          const testCode = this.createTestCode(code, testCase, language, problemType);
          executionResult = await this.executeCode(language, testCode);
        }
        
        const rawOutput = executionResult.output.trim();
        const actualOutput = language === 'python' ? template.parseOutput(rawOutput) : rawOutput;
        const expectedOutput = testCase.expectedOutput.trim();
        const passed = executionResult.success && actualOutput === expectedOutput;

        results.push({
          passed,
          status: passed ? "Accepted" : (executionResult.success ? "Wrong Answer" : "Runtime Error"),
          input: testCase.input,
          expectedOutput,
          actualOutput: executionResult.success ? actualOutput : 'Runtime Error',
          executionError: executionResult.error
        });

      } catch (error: any) {
        results.push({
          passed: false,
          status: "Execution Error",
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: 'Execution Error',
          executionError: error.message
        });
      }
    }

    return results;
  }

  // Create test-specific code for different problem types
  private createTestCode(userCode: string, testCase: TestCase, language: string, problemType: string): string {
    if (problemType === "two-sum" || problemType === "array") {
      const parts = testCase.input.trim().split(/\s+/);
      if (parts.length >= 2) {
        const arrayPart = parts[0]; // "[2,7,11,15]"
        const targetPart = parts[1]; // "9"

        if (language === 'python') {
          return `${userCode}

# Test case execution
nums = ${arrayPart}
target = ${targetPart}
result = two_sum(nums, target)
print(f"[{result[0]},{result[1]}]")`;
        } else if (language === 'javascript') {
          return `${userCode}

// Test case execution
const nums = ${arrayPart};
const target = ${targetPart};
const result = twoSum(nums, target);
console.log(\`[\${result[0]},\${result[1]}]\`);`;
        } else if (language === 'java') {
          const arrayStr = arrayPart.replace(/\[|\]/g, '').split(',').map(n => n.trim()).join(', ');
          return `${userCode}

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] nums = {${arrayStr}};
        int target = ${targetPart};
        int[] result = sol.twoSum(nums, target);
        System.out.println("[" + result[0] + "," + result[1] + "]");
    }
}`;
        } else if (language === 'cpp') {
          const arrayStr = arrayPart.replace(/\[|\]/g, '').split(',').map(n => n.trim()).join(', ');
          return `${userCode}

int main() {
    vector<int> nums = {${arrayStr}};
    int target = ${targetPart};
    vector<int> result = twoSum(nums, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`;
        }
      }
    }

    // For other problem types, return user code as-is
    return userCode;
  }

  // Check which languages are available on the system
  async getAvailableLanguages(): Promise<string[]> {
    const availableLanguages: string[] = [];

    // Python - check if available
    try {
      const result = await this.runCommand('python', ['--version'], '', 2000);
      if (result.success || result.output.includes('Python')) {
        availableLanguages.push('python');
      }
    } catch (error) {
      // Python not available
    }

    // Node.js - check if available
    try {
      const result = await this.runCommand('node', ['--version'], '', 2000);
      if (result.success || result.output.includes('v')) {
        availableLanguages.push('javascript');
      }
    } catch (error) {
      // Node.js not available
    }

    // Java - check if available
    try {
      const result = await this.runCommand('javac', ['-version'], '', 2000);
      if (result.success || result.error.includes('javac')) {
        availableLanguages.push('java');
      }
    } catch (error) {
      // Java not available
    }

    // C++ - check if available
    try {
      const result = await this.runCommand('g++', ['--version'], '', 2000);
      if (result.success || result.output.includes('g++')) {
        availableLanguages.push('cpp');
      }
    } catch (error) {
      // C++ not available
    }

    return availableLanguages;
  }
}