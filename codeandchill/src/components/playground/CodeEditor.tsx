import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Play, Loader2 } from "lucide-react";

const languages = [
  { id: 71, name: "Python (3.8.1)", value: "python" },
  { id: 62, name: "Java (OpenJDK 13.0.1)", value: "java" },
  { id: 63, name: "JavaScript (Node.js 12.14.0)", value: "javascript" },
  { id: 54, name: "C++ (GCC 9.2.0)", value: "cpp" },
];

export function CodeEditor() {
  const [language, setLanguage] = useState(languages[0]);
  const [code, setCode] = useState(
    "# Write your Python code here\nprint('Hello, Code & Chill!')"
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load keys from .env file
  const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;
  const RAPID_API_HOST = import.meta.env.VITE_RAPID_API_HOST;

  const handleLanguageChange = (value) => {
    const selectedLang = languages.find((lang) => lang.value === value);
    if (selectedLang) {
      setLanguage(selectedLang);
      if (value === "java")
        setCode(
          'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Code & Chill!");\n    }\n}'
        );
      else if (value === "javascript")
        setCode("console.log('Hello, Code & Chill!');");
      else if (value === "cpp")
        setCode(
          '#include <iostream>\n\nint main() {\n    std::cout << "Hello, Code & Chill!";\n    return 0;\n}'
        );
      else
        setCode("# Write your Python code here\nprint('Hello, Code & Chill!')");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setOutput("");

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST,
      },
      body: JSON.stringify({
        language_id: language.id,
        source_code: btoa(code),
        stdin: btoa(input),
      }),
    };

    try {
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false",
        options
      );
      const submission = await response.json();

      if (response.status > 201) {
        console.error("Submission failed:", submission);
        throw new Error(
          "Code submission failed. Please check your API key and subscription."
        );
      }

      let resultResponse;
      let result;
      do {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        resultResponse = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${submission.token}?base64_encoded=true`,
          {
            headers: {
              "X-RapidAPI-Key": RAPID_API_KEY,
              "X-RapidAPI-Host": RAPID_API_HOST,
            },
          }
        );
        result = await resultResponse.json();
      } while (result.status.id <= 2);

      if (result.stdout) setOutput(atob(result.stdout));
      else if (result.stderr) setOutput(`Error:\n${atob(result.stderr)}`);
      else if (result.compile_output)
        setOutput(`Compilation Error:\n${atob(result.compile_output)}`);
      else setOutput(`Execution Status: ${result.status.description}`);
    } catch (error) {
      console.error(error);
      setOutput(
        "An error occurred while running the code. Check the console for details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-xl bg-card overflow-hidden">
      <div className="p-4 bg-muted/50 border-b flex items-center justify-between">
        <Select
          defaultValue={language.value}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger className="w-[280px] bg-card rounded-lg h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.value}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="font-semibold"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Run Code
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-[60vh]">
          <Editor
            height="100%"
            language={language.value}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
        <div className="flex flex-col h-[60vh] border-l">
          <div className="flex-1 p-4">
            <h3 className="font-semibold mb-2">Input (stdin)</h3>
            <Textarea
              placeholder="Provide any custom input to your program here."
              className="h-[calc(100%-2rem)] resize-none bg-background"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="flex-1 p-4 border-t">
            <h3 className="font-semibold mb-2">Output</h3>
            <pre className="bg-background rounded-md p-4 h-[calc(100%-2rem)] overflow-auto text-sm">
              <code>{output}</code>
            </pre>
          </div>
        </div>
      </div>
    </Card>
  );
}
