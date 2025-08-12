import React from 'react';
import { ChatInterface } from "@/components/ai/ChatInterface.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Lightbulb, Code, BookOpen } from 'lucide-react';

export function AiAssistantPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-lime-100 via-gray-100 to-cyan-100">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-900 drop-shadow">
            AI Learning Assistant
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-cyan-800/90">
            Your personal AI tutor. Ask questions, get code explanations, and debug your projects.
          </p>
        </header>

        <main className="grid grid-cols-1 gap-12">
          {/* Chat Interface */}
          <div className="bg-white/80 rounded-2xl shadow-xl border border-cyan-200 p-4">
            <ChatInterface />
          </div>

          {/* Example Prompts Section */}
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-center text-cyan-900 mb-6">
              Example Prompts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center rounded-xl shadow-md border border-cyan-200 bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100">
                <Lightbulb className="mx-auto h-8 w-8 text-cyan-700 mb-3" />
                <p className="font-semibold text-cyan-800">
                  "Explain the concept of closures in JavaScript."
                </p>
              </Card>
              <Card className="p-6 text-center rounded-xl shadow-md border border-cyan-200 bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100">
                <Code className="mx-auto h-8 w-8 text-cyan-700 mb-3" />
                <p className="font-semibold text-cyan-800">
                  "Debug this Python code for me..."
                </p>
              </Card>
              <Card className="p-6 text-center rounded-xl shadow-md border border-cyan-200 bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100">
                <BookOpen className="mx-auto h-8 w-8 text-cyan-700 mb-3" />
                <p className="font-semibold text-cyan-800">
                  "Summarize the main ideas of dynamic programming."
                </p>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
