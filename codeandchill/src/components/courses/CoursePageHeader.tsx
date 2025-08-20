import React from "react";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Search } from "lucide-react";

export function CoursePageHeader() {
  return (
    <section className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Explore Our Courses
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-[#ff66cc]/80">
          Find the perfect course to achieve your career goals.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-full flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#ff66cc]/60 pointer-events-none" />
          <Input
            className="w-full rounded-lg bg-[#1a1a2e]/90 text-[#ffffff] placeholder-[#ff66cc]/50 pl-12 h-12 focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 transition"
            placeholder="Search for a course..."
            type="search"
            aria-label="Search courses"
          />
        </div>

        <Select>
          <SelectTrigger className="w-full md:w-[220px] h-12 bg-[#1a1a2e]/90 text-[#ffffff] placeholder-[#ff66cc]/50 rounded-lg border border-[#333366] focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition">
            <SelectValue placeholder="Sort by: Popularity" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e]/90 text-[#ffffff] border border-[#333366]">
            <SelectItem value="popularity" className="hover:bg-[#ff66cc]/20">
              Popularity
            </SelectItem>
            <SelectItem value="newest" className="hover:bg-[#ff66cc]/20">
              Newest
            </SelectItem>
            <SelectItem value="rating" className="hover:bg-[#ff66cc]/20">
              Highest Rated
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
