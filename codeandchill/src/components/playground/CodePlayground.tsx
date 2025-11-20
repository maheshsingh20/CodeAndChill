import React, { useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, Save, Share, Download, Upload, RotateCcw, Settings } from 'lucide-react';
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
  initialLanguage = 'javascript'
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', template: 'console.log("Hello, World!");' },
    { value: 'python', label: 'Python', template: 'print("Hello, World!")' },
    { value: 'java', label: 'Java', template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}` },
    { value: 'cpp', label: 'C++', template: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}` },
    { value: 'typescript', label: 'TypeScript', template: 'console.log("Hello, World!");' },
    { value: 'go', label: 'Go', template: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}` },
    { value: 'rust', label: 'Rust', template: `fn main() {
    println!("Hello, World!");
}` }
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' }
  ];

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');

    try {
      // Simulate code execution (replace with actual execution service)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Mock output based on language
      let mockOutput = '';
      switch (language) {
        case 'javascript':
        case 'typescript':
          mockOutput = 'Hello, World!\n';
          if (input) mockOutput += `Input received: ${input}\n`;
          break;
        case 'python':
          mockOutput = 'Hello, World!\n';
          if (input) mockOutput += f`Input: {input}\n`;
          break;
        case 'java':
          mockOutput = 'Hello, World!\n';
          break;
        case 'cpp':
          mockOutput = 'Hello, World!\n';
          break;
        case 'go':
          mockOutput = 'Hello, World!\n';
          break;
        case 'rust':
          mockOutput = 'Hello, World!\n';
          break;
        default:
          mockOutput = 'Language not supported in demo mode\n';
      }
      
      setOutput(mockOutput);
    } catch (error) {
      setOutput(`Error: ${error}`);
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
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">Code Playground</h1>
          
          <Select value={language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
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
        <div className="w-96 flex flex-col bg-gray-800">
          <Tabs defaultValue="output" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="input">Input</TabsTrigger>
            </TabsList>
            
            <TabsContent value="output" className="flex-1 p-4">
              <Card className="h-full bg-gray-900 border-gray-600">
                <div className="p-4 h-full">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Output</h3>
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap overflow-auto h-full">
                    {output || 'Click "Run" to see output...'}
                  </pre>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="input" className="flex-1 p-4">
              <Card className="h-full bg-gray-900 border-gray-600">
                <div className="p-4 h-full flex flex-col">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Input</h3>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input for your program..."
                    className="flex-1 bg-gray-800 border-gray-600 text-white resize-none"
                  />
                </div>
              </Card>
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