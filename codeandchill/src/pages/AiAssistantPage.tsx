import React from "react";
import { ChatInterface } from "@/components/ai/ChatInterface.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Lightbulb, Code, BookOpen } from "lucide-react";

export function AiAssistantPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-200">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow">
            AI Learning Assistant
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Your personal AI tutor. Ask questions, get code explanations, and
            debug your projects.
          </p>
        </header>

        <main className="grid grid-cols-1 gap-12">
          {/* Chat Interface */}
          <div className="bg-gray-900/70 backdrop-blur rounded-2xl shadow-2xl border border-gray-700 p-4">
            <ChatInterface />
          </div>

          {/* Example Prompts Section */}
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-center text-emerald-300 mb-6">
              Example Prompts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center rounded-xl shadow-lg border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition">
                <Lightbulb className="mx-auto h-8 w-8 text-cyan-400 mb-3" />
                <p className="font-medium text-gray-200">
                  "Explain the concept of closures in JavaScript."
                </p>
              </Card>
              <Card className="p-6 text-center rounded-xl shadow-lg border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition">
                <Code className="mx-auto h-8 w-8 text-purple-400 mb-3" />
                <p className="font-medium text-gray-200">
                  "Debug this Python code for me..."
                </p>
              </Card>
              <Card className="p-6 text-center rounded-xl shadow-lg border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition">
                <BookOpen className="mx-auto h-8 w-8 text-emerald-400 mb-3" />
                <p className="font-medium text-gray-200">
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
