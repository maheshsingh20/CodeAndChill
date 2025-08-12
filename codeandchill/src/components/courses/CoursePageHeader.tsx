import React from 'react';
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Search } from "lucide-react";

export function CoursePageHeader() {
  return (
    <section className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Explore Our Courses
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Find the perfect course to achieve your career goals.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-full flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            className="w-full rounded-lg bg-card pl-12 h-12 focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
            placeholder="Search for a course..."
            type="search"
            aria-label="Search courses"
          />
        </div>
        
        <Select>
          <SelectTrigger className="w-full md:w-[220px] h-12 bg-card rounded-lg border border-muted focus:ring-2 focus:ring-primary focus:ring-offset-1 transition">
            <SelectValue placeholder="Sort by: Popularity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
