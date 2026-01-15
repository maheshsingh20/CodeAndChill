import React from "react";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { Card } from "@/components/ui/card";
import { Lightbulb, Code, BookOpen } from "lucide-react";

export function AiAssistantPage() {
  return (
    <div className="w-full min-h-screen bg-black">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
            AI Learning Assistant
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Your personal AI tutor. Ask questions, get code explanations, and
            debug your projects.
          </p>
        </header>

        <main className="grid grid-cols-1 gap-12">
          {/* Chat Interface */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur rounded-md shadow-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 p-4">
            <ChatInterface />
          </div>

          {/* Example Prompts Section */}
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-center bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent mb-6">
              Example Prompts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md p-6 text-center shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
                <Lightbulb className="mx-auto h-8 w-8 text-cyan-400 mb-3" />
                <p className="font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                  "Explain the concept of closures in JavaScript."
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md p-6 text-center shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
                <Code className="mx-auto h-8 w-8 text-purple-400 mb-3" />
                <p className="font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                  "Debug this Python code for me..."
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md p-6 text-center shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
                <BookOpen className="mx-auto h-8 w-8 text-emerald-400 mb-3" />
                <p className="font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                  "Summarize the main ideas of dynamic programming."
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
