import React from "react";
import { CodeEditor } from "@/components/playground/CodeEditor.tsx";

export function PlaygroundPage() {
  return (
    <div className="bg-muted/30 w-full min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Code Playground
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Write, compile, and run your code in any language, right here in
            your browser.
          </p>
        </header>
        <main>
          <CodeEditor />
        </main>
      </div>
    </div>
  );
}
