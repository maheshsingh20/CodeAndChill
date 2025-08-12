import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function BlogHeader() {
  return (
    <header className="space-y-8 bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100 p-8 rounded-2xl shadow-xl border-2 border-cyan-200">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-900">
          The Code & Chill Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-cyan-800/90 leading-relaxed">
          Insights, tutorials, and career advice from our team of experts.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500 fill-lime-400" />
          <Input
            className="w-full rounded-2xl bg-gradient-to-br from-lime-50 to-cyan-50 border-2 border-cyan-200 pl-12 h-11 text-cyan-900 placeholder-cyan-600 focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700 transition"
            placeholder="Search articles..."
            type="search"
          />
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          className="bg-gradient-to-br from-lime-50 to-cyan-50 rounded-2xl border-2 border-cyan-200 text-cyan-900 shadow-md"
        >
          <ToggleGroupItem
            value="all"
            className="hover:bg-cyan-700 hover:text-white data-[state=on]:bg-cyan-700 data-[state=on]:text-white transition-transform transform hover:scale-105 rounded-lg"
          >
            All
          </ToggleGroupItem>
          <ToggleGroupItem
            value="javascript"
            className="hover:bg-cyan-700 hover:text-white data-[state=on]:bg-cyan-700 data-[state=on]:text-white transition-transform transform hover:scale-105 rounded-lg"
          >
            JavaScript
          </ToggleGroupItem>
          <ToggleGroupItem
            value="careers"
            className="hover:bg-cyan-700 hover:text-white data-[state=on]:bg-cyan-700 data-[state=on]:text-white transition-transform transform hover:scale-105 rounded-lg"
          >
            Careers
          </ToggleGroupItem>
          <ToggleGroupItem
            value="devops"
            className="hover:bg-cyan-700 hover:text-white data-[state=on]:bg-cyan-700 data-[state=on]:text-white transition-transform transform hover:scale-105 rounded-lg"
          >
            DevOps
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </header>
  );
}
