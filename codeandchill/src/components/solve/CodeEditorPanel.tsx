import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Play, Upload, Loader2, CheckCircle, XCircle } from "lucide-react";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface CodeEditorPanelProps {
  testCases: TestCase[];
}

export function CodeEditorPanel({ testCases }: CodeEditorPanelProps) {
  const [code, setCode] = useState(
    "def solve():\n  # Read input and write to standard output\n  pass\n\nsolve()"
  );
  const [languageId] = useState(71); // Python
  const [customInput, setCustomInput] = useState(testCases[0]?.input || "");
  const [output, setOutput] = useState(
    "Click 'Run' or 'Submit' to see the result."
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any[] | null>(null);
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
      const results = [];
      for (const testCase of testCases) {
        const result = await executeCode(code, testCase.input);
        if (result.stderr || result.compile_output) {
          results.push({ passed: false, status: "Error" });
          continue;
        }
        const passed = result.stdout
          ? atob(result.stdout).trim() === testCase.expectedOutput.trim()
          : false;
        results.push({ passed, status: passed ? "Accepted" : "Wrong Answer" });
      }
      setSubmissionResult(results);
    } catch (error: any) {
      setOutput(`An error occurred during submission: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="flex flex-col h-full border border-cyan-700 bg-black text-white">
      {/* Editor Section */}
      <div className="h-[50%] border-b border-cyan-700">
        <Editor
          height="100%"
          language="python"
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
