import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, Save, Share, Download, Upload, RotateCcw, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface CodePlaygroundProps {
  initialCode?: string;
  initialLanguage?: string;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode = '',
  initialLanguage = 'python'
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['python']);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const languages = [
    { value: 'python', label: '🐍 Python', template: 'print("Hello, World!")' },
    { value: 'javascript', label: '🟨 JavaScript', template: 'console.log("Hello, World!");' },
    {
      value: 'java', label: '☕ Java', template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}` },
    {
      value: 'cpp', label: '⚡ C++', template: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}` }
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' }
  ];

  const runCode = async () => {
    setIsRunning(true);
    setOutput('🚀 Running code with custom compiler...');

    try {
      const startTime = Date.now();

      // Use our custom compiler
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
      const endTime = Date.now();
      const execTime = endTime - startTime;

      let outputText = `--- 🎯 Execution Result ---\n`;
      outputText += `⚡ Execution Time: ${result.executionTime || execTime}ms\n`;
      outputText += `🔧 Compiler: Custom Backend Compiler\n`;
      outputText += `📝 Language: ${language.toUpperCase()}\n\n`;

      if (result.success && result.output) {
        outputText += `✅ Output:\n${result.output}`;
      } else if (result.error) {
        outputText += `❌ Error:\n${result.error}`;
      } else {
        outputText += "⚠️ Execution finished with no output.";
      }

      if (input.trim()) {
        outputText += `\n\n--- 📥 Input Used ---\n${input}`;
      }

      setOutput(outputText);
    } catch (error: any) {
      setOutput(`❌ Execution failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const saveCode = () => {
    const codeData = {
      code,
      language,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(`playground_${Date.now()}`, JSON.stringify(codeData));
    alert('Code saved to local storage!');
  };

  const shareCode = async () => {
    const shareData = {
      title: `Code Playground - ${language}`,
      text: code,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const downloadCode = () => {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      go: 'go',
      rust: 'rs'
    };

    const extension = extensions[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);

        // Try to detect language from file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        const languageMap: { [key: string]: string } = {
          js: 'javascript',
          ts: 'typescript',
          py: 'python',
          java: 'java',
          cpp: 'cpp',
          c: 'cpp',
          go: 'go',
          rs: 'rust'
        };

        if (extension && languageMap[extension]) {
          setLanguage(languageMap[extension]);
        }
      };
      reader.readAsText(file);
    }
  };

  const resetCode = () => {
    const template = languages.find(lang => lang.value === language)?.template || '';
    setCode(template);
    setOutput('');
    setInput('');
  };

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    const template = languages.find(lang => lang.value === newLanguage)?.template || '';
    setCode(template);
    setOutput('');
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Code Playground</h1>
            <span className="text-xs bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent bg-gray-700 px-2 py-1 rounded">Custom Compiler</span>
          </div>

          <Select value={language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.filter(lang => availableLanguages.includes(lang.value)).map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map(t => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play size={16} className="mr-1" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>

          <Button onClick={saveCode} variant="outline" size="sm">
            <Save size={16} className="mr-1" />
            Save
          </Button>

          <Button onClick={shareCode} variant="outline" size="sm">
            <Share size={16} className="mr-1" />
            Share
          </Button>

          <Button onClick={downloadCode} variant="outline" size="sm">
            <Download size={16} className="mr-1" />
            Download
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
          >
            <Upload size={16} className="mr-1" />
            Upload
          </Button>

          <Button onClick={resetCode} variant="outline" size="sm">
            <RotateCcw size={16} className="mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 border-r border-gray-700">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={theme}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                }
              }}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <Tabs defaultValue="output" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="input">Input</TabsTrigger>
            </TabsList>

            <TabsContent value="output" className="flex-1 p-4">
              <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md shadow-lg transition-all duration-300">
                <div className="p-4 h-full">
                  <h3 className="text-sm font-medium bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent mb-2">Output</h3>
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap overflow-auto h-full">
                    {output || 'Click "Run" to see output...'}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="input" className="flex-1 p-4">
              <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md shadow-lg transition-all duration-300">
                <div className="p-4 h-full flex flex-col">
                  <h3 className="text-sm font-medium bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent mb-2">Input</h3>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input for your program..."
                    className="flex-1 bg-gray-800 border-gray-600 text-white resize-none"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".js,.ts,.py,.java,.cpp,.c,.go,.rs,.txt"
        onChange={uploadFile}
        className="hidden"
      />
    </div>
  );
};