import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeSnippet {
  id: number;
  code: string;
  language: string;
  x: number;
  y: number;
  delay: number;
}

export const FloatingCodeSnippets: React.FC = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

  const codeSnippets = [
    { code: 'const solve = () => {}', language: 'javascript' },
    { code: 'function fibonacci(n)', language: 'javascript' },
    { code: 'if (condition) {', language: 'javascript' },
    { code: 'for (let i = 0; i < n; i++)', language: 'javascript' },
    { code: 'return result;', language: 'javascript' },
    { code: 'class Solution:', language: 'python' },
    { code: 'def binary_search(arr):', language: 'python' },
    { code: 'while left <= right:', language: 'python' },
    { code: 'import numpy as np', language: 'python' },
    { code: '#include <iostream>', language: 'cpp' },
    { code: 'vector<int> nums;', language: 'cpp' },
    { code: 'int main() {', language: 'cpp' },
    { code: 'std::sort(arr.begin())', language: 'cpp' },
    { code: 'public class Main {', language: 'java' },
    { code: 'ArrayList<Integer> list', language: 'java' },
    { code: 'System.out.println();', language: 'java' },
  ];

  useEffect(() => {
    const generateSnippets = () => {
      const newSnippets: CodeSnippet[] = [];
      for (let i = 0; i < 8; i++) {
        const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        newSnippets.push({
          id: i,
          code: snippet.code,
          language: snippet.language,
          x: Math.random() * 80 + 10, // 10% to 90% of screen width
          y: Math.random() * 80 + 10, // 10% to 90% of screen height
          delay: Math.random() * 5,
        });
      }
      setSnippets(newSnippets);
    };

    generateSnippets();
    const interval = setInterval(generateSnippets, 15000); // Regenerate every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'javascript':
        return 'from-yellow-400 to-orange-500';
      case 'python':
        return 'from-blue-400 to-green-500';
      case 'cpp':
        return 'from-purple-400 to-pink-500';
      case 'java':
        return 'from-red-400 to-orange-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {snippets.map((snippet) => (
          <motion.div
            key={snippet.id}
            initial={{
              opacity: 0,
              scale: 0.8,
              rotateX: -90,
              z: -100
            }}
            animate={{
              opacity: [0, 0.6, 0.4, 0],
              scale: [0.8, 1, 1.1, 0.9],
              rotateX: [-90, 0, 10, -90],
              z: [-100, 0, 50, -100],
              y: [0, -20, -40, -60]
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              rotateX: 90
            }}
            transition={{
              duration: 12,
              delay: snippet.delay,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              left: `${snippet.x}%`,
              top: `${snippet.y}%`,
              transformStyle: 'preserve-3d',
            }}
            className="select-none"
          >
            <div className={`
              px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10
              bg-gradient-to-r ${getLanguageColor(snippet.language)} bg-opacity-10
              shadow-lg transform-gpu
            `}>
              <code className="text-sm font-mono text-white/80 whitespace-nowrap">
                {snippet.code}
              </code>
              <div className={`
                absolute -inset-1 bg-gradient-to-r ${getLanguageColor(snippet.language)} 
                rounded-lg blur opacity-20 -z-10
              `} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};