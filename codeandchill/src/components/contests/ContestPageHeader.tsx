import React from "react";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Search, Filter } from "lucide-react";

export function ContestPageHeader() {
  return (
    <section className="mb-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-900 drop-shadow">
          Coding Contests
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-cyan-800/90">
          Challenge yourself, improve your skills, and climb the leaderboard.
        </p>
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto px-4">
        <label htmlFor="contest-search" className="sr-only">
          Search Contests
        </label>
        <div className="relative flex-grow w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-600 pointer-events-none" />
          <Input
            id="contest-search"
            type="search"
            placeholder="Search for a contest..."
            className="w-full rounded-2xl bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100 pl-12 h-12 text-cyan-900 placeholder:text-cyan-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow"
            aria-label="Search contests"
          />
        </div>

        <label htmlFor="difficulty-filter" className="sr-only">
          Filter by Difficulty
        </label>
        <Select>
          <SelectTrigger
            id="difficulty-filter"
            className="w-full md:w-[220px] h-12 bg-gradient-to-br from-cyan-50 via-lime-50 to-gray-100 rounded-2xl flex items-center justify-between shadow"
            aria-label="Filter contests by difficulty"
          >
            <Filter className="mr-2 h-5 w-5 text-cyan-600" />
            <SelectValue placeholder="Filter by Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
