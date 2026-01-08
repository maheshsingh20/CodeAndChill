/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Play, Upload, Loader2, CheckCircle, XCircle, Code, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface TestResult {
  passed: boolean;
  status: string;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  executionError?: string;
}

interface CodeEditorPanelProps {
  testCases: TestCase[];
  problemId: string;
  problemType?: string;
}

export function CodeEditorPanel({ testCases, problemId, problemType = "array" }: CodeEditorPanelProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python'); // Default to Python
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['python']);
  const [customInput, setCustomInput] = useState(testCases[0]?.input || "");
  const [output, setOutput] = useState("Click 'Run' or 'Submit' to see the result.");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<TestResult[] | null>(null);
  const [activeTab, setActiveTab] = useState("custom");
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // Fetch available languages on component mount
  useEffect(() => {
    const fetchAvailableLanguages = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/code/languages');
        const data = await response.json();
        if (data.success && data.available) {
          setAvailableLanguages(data.available);
          // Set default language to first available (should be Python)
          if (data.available.length > 0 && !data.available.includes(language)) {
            setLanguage(data.available[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch available languages:', error);
        // Fallback to Python only
        setAvailableLanguages(['python']);
        setLanguage('python');
      }
    };

    fetchAvailableLanguages();
  }, []);

  // Initialize with proper starter code
  useEffect(() => {
    setCode(getStarterCode(language, problemType));
  }, [language, problemType]);

  // Get starter code based on language and problem type
  const getStarterCode = (language: string, problemType: string): string => {
    // Generic starter code templates for different languages
    const starterCodes = {
      python: `# Write your solution here
def solve():
    # Your code goes here
    pass

# Example usage:
# result = solve()
# print(result)`,
      javascript: `// Write your solution here
function solve() {
    // Your code goes here
}

// Example usage:
// const result = solve();
// console.log(result);`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // Write your solution here
        System.out.println("Hello World");
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // Write your solution here
    cout << "Hello World" << endl;
    return 0;
}`
    };

    return starterCodes[language as keyof typeof starterCodes] || starterCodes.python;
  };

  // Execute code using our custom backend compiler
  const executeCodeWithCustomCompiler = async (code: string, input: string = '') => {
    try {
      const response = await fetch('http://localhost:3001/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          input
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      throw new Error(`Custom compiler error: ${error.message}`);
    }
  };

  // Execute test cases using our custom backend compiler
  const executeTestCasesWithCustomCompiler = async (code: string, testCases: TestCase[]) => {
    try {
      const response = await fetch('http://localhost:3001/api/code/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          testCases,
          problemType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      throw new Error(`Custom compiler error: ${error.message}`);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setSubmissionResult(null);
    setActiveTab("result");
    setExecutionTime(null);

    // Determine which input is being used
    const inputSource = testCases?.find(tc => tc.input === customInput)
      ? `Test Case ${testCases.findIndex(tc => tc.input === customInput) + 1}`
      : 'Custom Input';

    setOutput(`🚀 Running your code with ${inputSource} using our custom compiler...`);

    try {
      const startTime = Date.now();

      // Check if this is a test case input - if so, use the test endpoint for proper formatting
      const matchingTestCase = testCases?.find(tc => tc.input === customInput);

      let result;
      if (matchingTestCase) {
        // Use test endpoint for proper Two Sum formatting
        const testResult = await executeTestCasesWithCustomCompiler(code, [matchingTestCase]);
        if (testResult.success && testResult.results.length > 0) {
          const testCaseResult = testResult.results[0];
          result = {
            success: testCaseResult.passed || testCaseResult.actualOutput !== 'Runtime Error',
            output: testCaseResult.actualOutput,
            error: testCaseResult.executionError || '',
            executionTime: 0
          };
        } else {
          throw new Error(testResult.error || 'Test execution failed');
        }
      } else {
        // Use regular execution for custom input
        result = await executeCodeWithCustomCompiler(code, customInput);
      }

      const endTime = Date.now();
      const execTime = endTime - startTime;
      setExecutionTime(execTime);

      let output = `--- 🎯 Execution Result (${inputSource}) ---\n`;
      output += `⚡ Execution Time: ${result.executionTime || execTime}ms\n`;
      output += `🔧 Compiler: Custom Backend Compiler\n\n`;

      if (result.success && result.output) {
        output += `✅ Output:\n${result.output}`;
      } else if (result.error) {
        output += `❌ Error:\n${result.error}`;
      } else {
        output += "⚠️ Execution finished with no output.";
      }

      // If using a test case input, show comparison
      if (matchingTestCase) {
        const actualOutput = result.output ? result.output.trim() : '';
        const expectedOutput = matchingTestCase.expectedOutput.trim();
        const matches = actualOutput === expectedOutput;

        output += `\n\n--- 🧪 Test Case Validation ---`;
        output += `\nInput: ${matchingTestCase.input}`;
        output += `\nExpected: ${expectedOutput}`;
        output += `\nActual: ${actualOutput}`;
        output += `\nResult: ${matches ? '✅ PASS' : '❌ FAIL'}`;

        if (!matches) {
          output += `\n\n💡 Tip: Your output doesn't match the expected result.`;
          output += `\n   Use "Submit Solution" to test against all test cases.`;
        }
      } else if (customInput.trim()) {
        output += `\n\n--- 🔧 Custom Input Testing ---`;
        output += `\nInput: ${customInput}`;
        output += `\n💡 This is custom input. Use "Submit Solution" to test against official test cases.`;
      }

      setOutput(output);
    } catch (error: any) {
      setOutput(`❌ An error occurred: ${error.message}`);
      setExecutionTime(null);
    }
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput("🚀 Running code against all test cases using our custom compiler...");
    setSubmissionResult(null);
    setActiveTab("result");
    setExecutionTime(null);

    try {
      const token = localStorage.getItem('authToken');

      // Validate inputs
      if (!problemId) {
        throw new Error('Problem ID is required');
      }

      if (!token) {
        throw new Error('Authentication token is missing');
      }

      if (!testCases || testCases.length === 0) {
        throw new Error('No test cases available for this problem');
      }

      console.log(`🧪 Running code against ${testCases.length} test cases:`, testCases);
      console.log('🔧 Language:', language);

      const startTime = Date.now();

      // Show progress
      setOutput(`🚀 Executing ${testCases.length} test case${testCases.length !== 1 ? 's' : ''}...\n⏳ Please wait...`);

      const result = await executeTestCasesWithCustomCompiler(code, testCases);
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      setExecutionTime(totalTime);

      if (!result.success) {
        throw new Error(result.error || 'Test execution failed');
      }

      setSubmissionResult(result.results);

      const { statistics } = result;
      const allPassed = statistics.passed === statistics.total;

      // Always submit to backend for tracking, regardless of pass/fail
      try {
        const submissionResponse = await fetch('http://localhost:3001/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            problemId,
            code,
            language,
            testResults: result.results,
            score: statistics.score,
            status: allPassed ? 'accepted' : 'wrong_answer',
            executionTime: totalTime,
            passedTestCases: statistics.passed,
            totalTestCases: statistics.total
          })
        });

        if (submissionResponse.ok) {
          const submissionData = await submissionResponse.json();
          console.log('✅ Submission recorded successfully:', submissionData);

          if (allPassed) {
            setOutput(`🎉 All ${statistics.total} test case${statistics.total !== 1 ? 's' : ''} passed! Problem marked as SOLVED!\n⚡ Total Execution Time: ${totalTime}ms\n🏆 Score: ${statistics.score}%`);
          } else {
            setOutput(`📊 Submission completed. Score: ${statistics.score}% (${statistics.passed}/${statistics.total} test cases passed)\n⚡ Total Execution Time: ${totalTime}ms\n💡 Keep trying to solve all test cases!`);
          }
        } else {
          console.error('❌ Failed to record submission:', submissionResponse.statusText);
          if (allPassed) {
            setOutput(`🎉 All ${statistics.total} test case${statistics.total !== 1 ? 's' : ''} passed! Score: ${statistics.score}%\n⚡ Total Execution Time: ${totalTime}ms\n⚠️ Note: Submission recording failed, but your solution is correct!`);
          } else {
            setOutput(`📊 Submission completed. Score: ${statistics.score}% (${statistics.passed}/${statistics.total} test cases passed)\n⚡ Total Execution Time: ${totalTime}ms`);
          }
        }
      } catch (backendError) {
        console.error('❌ Failed to record submission:', backendError);
        if (allPassed) {
          setOutput(`🎉 All ${statistics.total} test case${statistics.total !== 1 ? 's' : ''} passed! Score: ${statistics.score}%\n⚡ Total Execution Time: ${totalTime}ms\n⚠️ Note: Submission recording failed, but your solution is correct!`);
        } else {
          setOutput(`📊 Submission completed. Score: ${statistics.score}% (${statistics.passed}/${statistics.total} test cases passed)\n⚡ Total Execution Time: ${totalTime}ms`);
        }
      }

    } catch (error: any) {
      setOutput(`❌ An error occurred during submission: ${error.message}`);
      console.error('Submission error:', error);
      setExecutionTime(null);
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      {/* Header with Language Selector */}
      <div className="p-4 border-b border-gray-700/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <Code className="w-4 h-4 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Custom Code Compiler</h3>
          <div className="ml-auto flex items-center gap-3">
            {executionTime && (
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                ⚡ {executionTime}ms
              </span>
            )}
            <Select value={language} onValueChange={(value) => {
              setLanguage(value);
              setCode(getStarterCode(value, problemType));
            }}>
              <SelectTrigger className="w-32 bg-gray-700/50 border-gray-600 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.includes('python') && (
                  <SelectItem value="python">� Python</SelectItem>
                )}
                {availableLanguages.includes('javascript') && (
                  <SelectItem value="javascript">🟨 JavaScript</SelectItem>
                )}
                {availableLanguages.includes('java') && (
                  <SelectItem value="java">☕ Java</SelectItem>
                )}
                {availableLanguages.includes('cpp') && (
                  <SelectItem value="cpp">⚡ C++</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          ✨ No rate limits • ⚡ Fast execution • 🔒 Secure sandbox
        </div>
      </div>

      {/* Editor Section */}
      <div className="h-[500px] border-b border-gray-700/40">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "Monaco, Consolas, monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 }
          }}
        />
      </div>

      {/* Tabs Section */}
      <div className="p-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-gray-700/50">
            <TabsTrigger value="custom">Custom Input</TabsTrigger>
            <TabsTrigger value="testcases">Test Cases ({testCases?.length || 0})</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Custom Input:</label>
              <Textarea
                placeholder="Enter your custom input here..."
                className="h-32 resize-none bg-gray-700/30 border-gray-600/50 text-gray-200"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              />
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-600 hover:bg-gray-700"
                  onClick={() => setCustomInput('')}
                >
                  Clear
                </Button>
                {testCases && testCases.length > 0 && (
                  <>
                    {testCases.map((testCase, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs border-gray-600 hover:bg-gray-700"
                        onClick={() => setCustomInput(testCase.input)}
                      >
                        Use Test {index + 1}
                      </Button>
                    ))}
                  </>
                )}
              </div>

              {/* Custom Test Case Creator */}
              <div className="mt-4 p-3 bg-gray-700/20 border border-gray-600/30 rounded-lg">
                <h5 className="text-sm font-medium text-gray-300 mb-2">💡 Create Custom Test Case</h5>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-400">Expected Output:</label>
                    <input
                      type="text"
                      placeholder="Enter expected output..."
                      className="w-full mt-1 px-2 py-1 text-xs bg-gray-800/50 border border-gray-600/50 rounded text-gray-200"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = customInput.trim();
                          const expected = (e.target as HTMLInputElement).value.trim();
                          if (input && expected) {
                            // This would add to a custom test cases array in a real implementation
                            console.log('Custom test case:', { input, expected });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Press Enter to create test case</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="testcases" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Available Test Cases ({testCases?.length || 0}):</h4>
              {testCases && testCases.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {testCases.map((testCase, index) => (
                    <div key={index} className="p-3 bg-gray-700/30 border border-gray-600/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Test Case {index + 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-gray-600 hover:bg-gray-700"
                          onClick={() => {
                            setCustomInput(testCase.input);
                            setActiveTab("custom");
                          }}
                        >
                          Use This Input
                        </Button>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-gray-400">Input: </span>
                          <code className="text-blue-300 bg-gray-800/50 px-1 py-0.5 rounded">
                            {testCase.input}
                          </code>
                        </div>
                        <div>
                          <span className="text-gray-400">Expected: </span>
                          <code className="text-green-300 bg-gray-800/50 px-1 py-0.5 rounded">
                            {testCase.expectedOutput}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400 p-4 text-center">
                  No test cases available for this problem.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="result" className="space-y-4">
            <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg p-4 h-80 overflow-auto">
              {submissionResult ? (
                <div className="space-y-2">
                  {submissionResult.every((res) => res.passed) && (
                    <div className="flex items-center gap-2 p-3 bg-green-500/20 text-green-300 rounded-lg font-semibold">
                      <CheckCircle size={20} /> 🎉 All {submissionResult.length} Test Case{submissionResult.length !== 1 ? 's' : ''} Passed!
                    </div>
                  )}
                  {submissionResult.map((res, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border mb-3 ${res.passed
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {res.passed ? (
                          <CheckCircle size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                        <strong className="text-base">Test Case {i + 1}/{submissionResult.length}: {res.status}</strong>
                      </div>

                      {/* Show detailed test case information */}
                      <div className="space-y-3 bg-black/30 p-3 rounded-md">
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-400 text-sm font-medium">Input:</span>
                          <code className="text-blue-300 bg-gray-800/50 px-2 py-1 rounded text-sm break-all">
                            {res.input || 'No input'}
                          </code>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-gray-400 text-sm font-medium">Expected Output:</span>
                          <code className="text-green-300 bg-gray-800/50 px-2 py-1 rounded text-sm break-all">
                            {res.expectedOutput}
                          </code>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-gray-400 text-sm font-medium">Your Output:</span>
                          <code className={`${res.passed ? "text-green-300" : "text-red-300"} bg-gray-800/50 px-2 py-1 rounded text-sm break-all`}>
                            {res.actualOutput}
                          </code>
                        </div>

                        {res.executionError && (
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-sm font-medium">Error:</span>
                            <code className="text-red-300 bg-red-900/20 px-2 py-1 rounded text-sm break-all">
                              {res.executionError}
                            </code>
                          </div>
                        )}

                        {!res.passed && !res.executionError && (
                          <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-300 text-xs">
                            💡 Your output doesn't match the expected result. Check your logic!
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 text-xs text-gray-400">
                    Total: {submissionResult.length} test case{submissionResult.length !== 1 ? 's' : ''} |
                    Passed: {submissionResult.filter(r => r.passed).length} |
                    Failed: {submissionResult.filter(r => !r.passed).length}
                  </div>
                </div>
              ) : (
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{output}</pre>
              )}
            </div>
          </TabsContent>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="border-gray-600 hover:bg-gray-700"
              onClick={handleRun}
              disabled={isRunning || isSubmitting}
            >
              {isRunning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Test Code
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Submit Solution
            </Button>
          </div>
        </Tabs>
      </div>
    </Card>
  );
}
