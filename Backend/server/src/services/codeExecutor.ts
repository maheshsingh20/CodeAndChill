import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

  // Universal code execution - works with any language
  async executeCode(language: string, code: string, input: string = ''): Promise<ExecutionResult> {
    const startTime = Date.now();
    const fileId = uuidv4();

    try {
      switch (language.toLowerCase()) {
        case 'python':
          return await this.executePython(code, input, fileId);
        case 'javascript':
        case 'js':
          return await this.executeJavaScript(code, input, fileId);
        case 'java':
          return await this.executeJava(code, input, fileId);
        case 'cpp':
        case 'c++':
          return await this.executeCpp(code, input, fileId);
        case 'csharp':
        case 'c#':
          // Try local C# execution first, fallback to Judge0 if it fails
          try {
            const localResult = await this.executeCSharp(code, input, fileId);
            if (localResult.success || !localResult.error?.includes('not found') && !localResult.error?.includes('ENOENT')) {
              return localResult;
            }
            // If local execution fails due to missing compiler, try Judge0
            console.log('Local C# execution failed, trying Judge0 fallback...');
            return await this.executeCSharpWithJudge0(code, input);
          } catch (error) {
            console.log('Local C# execution error, trying Judge0 fallback...', error);
            return await this.executeCSharpWithJudge0(code, input);
          }
        default:
          return {
            success: false,
            output: '',
            error: `Unsupported language: ${language}`,
            executionTime: Date.now() - startTime
          };
      }
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }

  // Execute Python code
  private async executePython(code: string, input: string, fileId: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const filePath = path.join(this.tempDir, `${fileId}.py`);

    try {
      await fs.writeFile(filePath, code);
      const result = await this.runCommandWithInput('python', [filePath], input);
      
      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime: Date.now() - startTime
      };
    } finally {
      await this.cleanup([filePath]);
    }
  }

  // Execute JavaScript code
  private async executeJavaScript(code: string, input: string, fileId: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const filePath = path.join(this.tempDir, `${fileId}.js`);

    try {
      await fs.writeFile(filePath, code);
      const result = await this.runCommandWithInput('node', [filePath], input);
      
      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime: Date.now() - startTime
      };
    } finally {
      await this.cleanup([filePath]);
    }
  }
  // Execute Java code
  private async executeJava(code: string, input: string, fileId: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const className = this.extractJavaClassName(code) || 'Solution';
    const filePath = path.join(this.tempDir, `${className}.java`);
    const classPath = path.join(this.tempDir, `${className}.class`);
    try {
      await fs.writeFile(filePath, code);
      // Compile
      const compileResult = await this.runCommandWithInput('javac', [filePath], '');
      if (!compileResult.success) {
        return {
          success: false,
          output: '',
          error: `Compilation Error: ${compileResult.error}`,
          executionTime: Date.now() - startTime
        };
      }
      // Execute
      const result = await this.runCommandWithInput('java', ['-cp', this.tempDir, className], input);
      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime: Date.now() - startTime
      };
    } finally {
      await this.cleanup([filePath, classPath]);
    }
  }

  // Execute C++ code
  private async executeCpp(code: string, input: string, fileId: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const sourceFile = path.join(this.tempDir, `${fileId}.cpp`);
    const executableFile = path.join(this.tempDir, `${fileId}.exe`);

    try {
      await fs.writeFile(sourceFile, code);
      
      // Compile
      const compileResult = await this.runCommandWithInput('g++', ['-o', executableFile, sourceFile], '');
      if (!compileResult.success) {
        return {
          success: false,
          output: '',
          error: `Compilation Error: ${compileResult.error}`,
          executionTime: Date.now() - startTime
        };
      }

      // Execute
      const result = await this.runCommandWithInput(executableFile, [], input);
      
      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime: Date.now() - startTime
      };
    } finally {
      await this.cleanup([sourceFile, executableFile]);
    }
  }

  // Execute C# code
  private async executeCSharp(code: string, input: string, fileId: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const projectDir = path.join(this.tempDir, `${fileId}_project`);
    const sourceFile = path.join(projectDir, 'Program.cs');
    const projectFile = path.join(projectDir, `${fileId}.csproj`);

    try {
      // Create project directory
      await fs.mkdir(projectDir, { recursive: true });

      // Create a simple .csproj file
      const csprojContent = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>`;

      await fs.writeFile(projectFile, csprojContent);
      await fs.writeFile(sourceFile, code);

      // Try dotnet first (modern approach)
      let compileResult = await this.runCommandWithInput('dotnet', ['build', projectDir, '--configuration', 'Release', '--verbosity', 'quiet'], '', 15000);
      
      if (compileResult.success) {
        // Run with dotnet
        const runResult = await this.runCommandWithInput('dotnet', ['run', '--project', projectDir, '--configuration', 'Release'], input, 10000);
        
        return {
          success: runResult.success,
          output: runResult.output,
          error: runResult.error,
          executionTime: Date.now() - startTime
        };
      }

      // If dotnet fails, try legacy compilers as fallback
      const legacySourceFile = path.join(this.tempDir, `${fileId}.cs`);
      const executableFile = path.join(this.tempDir, `${fileId}.exe`);
      
      await fs.writeFile(legacySourceFile, code);
      
      let usesMono = false;
      
      if (process.platform === 'win32') {
        // On Windows, try csc first (Microsoft C# compiler)
        compileResult = await this.runCommandWithInput('csc', ['/out:' + executableFile, legacySourceFile], '', 10000);
        
        if (!compileResult.success) {
          // Try mcs (Mono) as fallback
          compileResult = await this.runCommandWithInput('mcs', ['-out:' + executableFile, legacySourceFile], '', 10000);
          usesMono = true;
        }
      } else {
        // On Unix-like systems, try mcs first (Mono)
        compileResult = await this.runCommandWithInput('mcs', ['-out:' + executableFile, legacySourceFile], '', 10000);
        usesMono = true;
        
        if (!compileResult.success) {
          // Try csc as fallback
          compileResult = await this.runCommandWithInput('csc', ['/out:' + executableFile, legacySourceFile], '', 10000);
          usesMono = false;
        }
      }

      if (!compileResult.success) {
        return {
          success: false,
          output: '',
          error: `C# Compilation Error: ${compileResult.error}\n\nPlease install .NET SDK: https://dotnet.microsoft.com/download\nOr install Mono: https://www.mono-project.com/download/`,
          executionTime: Date.now() - startTime
        };
      }

      // Check if executable was created
      try {
        await fs.access(executableFile);
      } catch {
        return {
          success: false,
          output: '',
          error: `C# compilation succeeded but executable not found.`,
          executionTime: Date.now() - startTime
        };
      }

      // Execute the compiled program
      let result;
      if (process.platform === 'win32' && !usesMono) {
        // On Windows with Microsoft compiler, run directly
        result = await this.runCommandWithInput(executableFile, [], input, 10000);
      } else {
        // Use mono to run the executable (Unix or when compiled with mcs)
        result = await this.runCommandWithInput('mono', [executableFile], input, 10000);
      }
      
      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime: Date.now() - startTime
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: `C# execution error: ${error.message}`,
        executionTime: Date.now() - startTime
      };
    } finally {
      await this.cleanup([sourceFile, projectFile, projectDir, path.join(this.tempDir, `${fileId}.cs`), path.join(this.tempDir, `${fileId}.exe`)]);
    }
  }

  // Universal test case execution - works for ANY problem
  async executeTestCases(language: string, code: string, testCases: TestCase[]): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        // Execute the user's code with the test case input
        const executionResult = await this.executeCode(language, code, testCase.input);
        
        // Clean and compare outputs
        const actualOutput = this.normalizeOutput(executionResult.output);
        const expectedOutput = this.normalizeOutput(testCase.expectedOutput);
        const passed = executionResult.success && actualOutput === expectedOutput;

        results.push({
          passed,
          status: passed ? "Accepted" : (executionResult.success ? "Wrong Answer" : "Runtime Error"),
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: executionResult.success ? executionResult.output : 'Runtime Error',
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

  // Normalize output for comparison (handles different formats)
  private normalizeOutput(output: string): string {
    if (!output) return '';
    
    return output
      .trim()
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\[\s+/g, '[') // Remove spaces after opening brackets
      .replace(/\s+\]/g, ']') // Remove spaces before closing brackets
      .replace(/,\s+/g, ',')  // Remove spaces after commas
      .replace(/\s+,/g, ','); // Remove spaces before commas
  }

  // Universal command runner with proper input handling
  private runCommandWithInput(command: string, args: string[], input: string, timeout: number = 5000): Promise<{success: boolean, output: string, error: string}> {
    return new Promise((resolve) => {
      const process = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe']
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
            error: `Process error: ${err.message}`
          });
        }
      });

      // Send input to process
      if (input && input.trim()) {
        process.stdin.write(input);
        if (!input.endsWith('\n')) {
          process.stdin.write('\n');
        }
      }
      process.stdin.end();
    });
  }

  // Extract Java class name
  private extractJavaClassName(code: string): string | null {
    const match = code.match(/public\s+class\s+(\w+)/);
    return match ? match[1] : null;
  }

  // Clean up temporary files and directories
  private async cleanup(paths: string[]) {
    for (const filePath of paths) {
      try {
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          // Remove directory recursively using fs.rm (new method)
          await fs.rm(filePath, { recursive: true, force: true });
        } else {
          // Remove file
          await fs.unlink(filePath);
        }
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  // Check available languages
  async getAvailableLanguages(): Promise<string[]> {
    const availableLanguages: string[] = [];

    // Test each language
    const languageTests = [
      { lang: 'python', cmd: 'python', args: ['--version'] },
      { lang: 'javascript', cmd: 'node', args: ['--version'] },
      { lang: 'java', cmd: 'javac', args: ['-version'] },
      { lang: 'cpp', cmd: 'g++', args: ['--version'] }
    ];

    for (const test of languageTests) {
      try {
        const result = await this.runCommandWithInput(test.cmd, test.args, '', 2000);
        if (result.success || result.output.includes('version') || result.error.includes('version')) {
          availableLanguages.push(test.lang);
        }
      } catch {
        // Language not available
      }
    }

    // Special handling for C# - test dotnet first, then fallback compilers
    let csharpAvailable = false;
    
    // Test dotnet first (modern .NET CLI)
    try {
      const dotnetResult = await this.runCommandWithInput('dotnet', ['--version'], '', 3000);
      if (dotnetResult.success && dotnetResult.output.trim().match(/^\d+\.\d+/)) {
        csharpAvailable = true;
      }
    } catch {
      // dotnet not available
    }
    
    // Test mcs (Mono) if dotnet failed
    if (!csharpAvailable) {
      try {
        const mcsResult = await this.runCommandWithInput('mcs', ['--version'], '', 3000);
        if (mcsResult.success || mcsResult.output.includes('Mono') || mcsResult.error.includes('Mono')) {
          csharpAvailable = true;
        }
      } catch {
        // mcs not available
      }
    }
    
    // Test csc (Microsoft C# compiler) as final fallback
    if (!csharpAvailable) {
      try {
        const cscResult = await this.runCommandWithInput('csc', ['/?'], '', 3000);
        if (cscResult.success || cscResult.output.includes('Microsoft') || cscResult.error.includes('Microsoft')) {
          csharpAvailable = true;
        }
      } catch {
        // csc not available
      }
    }
    
    if (csharpAvailable) {
      availableLanguages.push('csharp');
    } else {
      // Even if local C# compiler is not available, we can use Judge0 as fallback
      // So always include C# in available languages
      availableLanguages.push('csharp');
    }

    return availableLanguages;
  }

  // Fallback C# execution using Judge0 API
  private async executeCSharpWithJudge0(code: string, input: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      // Import judgeService dynamically to avoid circular dependency
      const { judgeService } = await import('./judgeService');
      
      const result = await judgeService.executeCode(code, input, 51); // 51 is C# language ID in Judge0
      
      let output = '';
      let error = '';
      let success = false;
      
      if (result.status.id === 3) { // Accepted
        output = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';
        success = true;
      } else if (result.status.id === 6) { // Compilation Error
        error = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : 'Compilation failed';
      } else if (result.stderr) {
        error = Buffer.from(result.stderr, 'base64').toString();
      } else {
        error = result.status.description || 'Execution failed';
      }
      
      return {
        success,
        output: output.trim(),
        error: error.trim(),
        executionTime: Date.now() - startTime
      };
      
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: `Judge0 C# execution failed: ${error.message}`,
        executionTime: Date.now() - startTime
      };
    }
  }
}