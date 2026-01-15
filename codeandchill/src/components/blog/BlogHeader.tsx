import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function BlogHeader() {
  return (
    <header className="space-y-8 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl border-2 border-cyan-700 text-gray-200">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-400">
          The Code & Chill Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-cyan-300/90 leading-relaxed">
          Insights, tutorials, and career advice from our team of experts.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400" />
          <Input
            className="w-full rounded-2xl bg-gray-900/70 border border-cyan-700 pl-12 h-11 text-cyan-300 placeholder-cyan-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            placeholder="Search articles..."
            type="search"
          />
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          className="bg-gray-900/70 rounded-2xl border border-cyan-700 text-cyan-300 shadow-md"
        >
          <ToggleGroupItem
            value="all"
            className="hover:bg-cyan-600 hover:text-white data-[state=on]:bg-cyan-600 data-[state=on]:text-white transition-transform transform hover:scale-105 rounded-lg"
          >
            All
          </ToggleGroupItem>
          <ToggleGroupItem
            value="javascript"
            className="hover:bg-cyan-600 hover:text-white data-[state=on]:bg-cyan-600 data-[state=on]:text-white transition-transform transform hover:scale-105 rounded-lg"
          >
            JavaScript
          </ToggleGroupItem>
          <ToggleGroupItem
            value="devops"
            className="hover:bg-cyan-600 hover:text-white data-[state=on]:bg-cyan-600 data-[state=on]:text-white transition-transform transform hover:scale-105 rounded-lg"
          >
            DevOps
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </header>
  );
}
