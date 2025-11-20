/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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
import { Play, Upload, Loader2, CheckCircle, XCircle, Code } from "lucide-react";
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

interface CodeEditorPanelProps {
  testCases: TestCase[];
  problemId: string;
}

export function CodeEditorPanel({ testCases, problemId }: CodeEditorPanelProps) {
  const [code, setCode] = useState(
    "def solve():\n  # Read input and write to standard output\n  pass\n\nsolve()"
  );
  const [language, setLanguage] = useState('python');
  const [languageId, setLanguageId] = useState(71); // Python
  const [customInput, setCustomInput] = useState(testCases[0]?.input || "");
  const [output, setOutput] = useState(
    "Click 'Run' or 'Submit' to see the result."
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ passed: boolean; status: string }[] | null>(null);
  const [activeTab, setActiveTab] = useState("custom");

  const executeCode = async (sourceCode: string, stdin: string) => {
    const RAPIDAPI_KEY = "b6d4982d07msh833ff3a46406480p1d6adcjsn8d469455de38";
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: btoa(sourceCode),
          stdin: btoa(stdin),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running your code...");
    setSubmissionResult(null);
    setActiveTab("result");
    try {
      const result = await executeCode(code, customInput);
      if (result.stdout) {
        setOutput(`Output:\n${atob(result.stdout)}`);
      } else if (result.stderr) {
        setOutput(`Runtime Error:\n${atob(result.stderr)}`);
      } else if (result.compile_output) {
        setOutput(`Compilation Error:\n${atob(result.compile_output)}`);
      } else if (result.status?.description) {
        setOutput(`Execution Finished:\nStatus: ${result.status.description}`);
      } else {
        setOutput("Execution finished with no output.");
      }
    } catch (error: any) {
      setOutput(`An error occurred: ${error.message}`);
    }
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput("Submitting against test cases...");
    setSubmissionResult(null);
    setActiveTab("result");
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Validate inputs
      if (!problemId) {
        throw new Error('Problem ID is required');
      }
      
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      console.log('Submitting code for problem:', problemId);
      console.log('Language:', language);
      console.log('Code length:', code.length);
      
      const response = await fetch('http://localhost:3001/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId,
          code,
          language
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Submission failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      // Convert backend response to frontend format
      const results = result.testResults.map((testResult: any) => ({
        passed: testResult.passed,
        status: testResult.passed ? "Accepted" : "Wrong Answer"
      }));
      
      setSubmissionResult(results);
      
      if (result.status === 'accepted') {
        setOutput(`🎉 All test cases passed! Score: ${result.score}%\nExecution Time: ${result.executionTime.toFixed(2)}ms`);
      } else {
        setOutput(`Submission completed. Score: ${result.score}% (${result.passedTestCases}/${result.totalTestCases} test cases passed)`);
      }
      
    } catch (error: any) {
      setOutput(`An error occurred during submission: ${error.message}`);
      console.error('Submission error:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="flex flex-col h-full border border-cyan-700 bg-black text-white">
      {/* Language Selector */}
      <div className="p-3 border-b border-cyan-700 bg-gray-900">
        <div className="flex items-center gap-3">
          <Code className="w-4 h-4 text-cyan-400" />
          <Select value={language} onValueChange={(value) => {
            setLanguage(value);
            // Update language ID and default code based on selection
            const languageMap: Record<string, { id: number; code: string; monaco: string }> = {
              python: { 
                id: 71, 
                code: "def solve():\n    # Read input and write to standard output\n    pass\n\nsolve()",
                monaco: "python"
              },
              javascript: { 
                id: 63, 
                code: "function solve() {\n    // Read input and write to standard output\n}\n\nsolve();",
                monaco: "javascript"
              },
              java: { 
                id: 62, 
                code: "public class Solution {\n    public static void main(String[] args) {\n        // Read input and write to standard output\n    }\n}",
                monaco: "java"
              },
              cpp: { 
                id: 54, 
                code: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Read input and write to standard output\n    return 0;\n}",
                monaco: "cpp"
              }
            };
            
            const selected = languageMap[value];
            if (selected) {
              setLanguageId(selected.id);
              setCode(selected.code);
            }
          }}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="python" className="text-white hover:bg-gray-700">Python</SelectItem>
              <SelectItem value="javascript" className="text-white hover:bg-gray-700">JavaScript</SelectItem>
              <SelectItem value="java" className="text-white hover:bg-gray-700">Java</SelectItem>
              <SelectItem value="cpp" className="text-white hover:bg-gray-700">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Editor Section */}
      <div className="h-[50%] border-b border-cyan-700">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Tabs Section */}
      <div className="h-[50%] flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-grow flex flex-col"
        >
          <div className="p-2 border-b border-cyan-700 bg-black">
            <TabsList>
              <TabsTrigger value="custom">Custom Input</TabsTrigger>
              <TabsTrigger value="result">Result</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="custom" className="flex-grow p-2">
            <Textarea
              placeholder="Enter custom input here..."
              className="h-full resize-none bg-black border border-cyan-700 text-white"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="result" className="flex-grow p-2 overflow-auto">
            <pre className="bg-black border border-cyan-700 p-4 h-full overflow-auto text-sm text-white">
              {submissionResult ? (
                <div className="space-y-2">
                  {submissionResult.every((res) => res.passed) && (
                    <div className="flex items-center gap-2 p-3 bg-green-900 text-green-200 font-bold text-base">
                      <CheckCircle size={20} /> All Test Cases Passed!
                    </div>
                  )}
                  {submissionResult.map((res, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 p-2 ${
                        res.passed
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {res.passed ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      <strong>Test Case {i + 1}:</strong> {res.status}
                    </div>
                  ))}
                </div>
              ) : (
                <code>{output}</code>
              )}
            </pre>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="p-4 border-t border-cyan-700 bg-black flex justify-end gap-4">
          <Button
            variant="outline"
            className="border-cyan-700 text-cyan-300 hover:bg-cyan-900"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
          >
            {isRunning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Run
          </Button>
          <Button
            className="bg-cyan-900 hover:bg-cyan-700 text-white"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
}
