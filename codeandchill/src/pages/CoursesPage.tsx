import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

// +++ ADDED: UI components for search and filter
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Course {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tutor: { name: string };
  cost: number;
}

export function CoursesPage() {
  // Original state: `courses` now stores the master list, fetched once.
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // +++ ADDED: State for search, filter, and the courses to display
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all"); // Default filter
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // This effect fetches the initial data just once
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3001/api/general-courses"
        );
        const data = await response.json();
        setCourses(data); // Store the original, unfiltered list
        setFilteredCourses(data); // Initially, display all courses
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // +++ ADDED: This effect runs whenever the search term or filter option changes
  useEffect(() => {
    let result = courses;

    // 1. Apply cost filter
    if (filterOption === "free") {
      result = result.filter((course) => course.cost === 0);
    } else if (filterOption === "paid") {
      result = result.filter((course) => course.cost > 0);
    }

    // 2. Apply search term filter on top of the cost filter result
    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(result);
  }, [searchTerm, filterOption, courses]); // Dependencies: re-run when these change

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 w-full min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Our Courses
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Choose a path and master the in-demand skills for a career in tech.
          </p>
        </header>

        {/* +++ ADDED: Search and Filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or description..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterOption} onValueChange={setFilterOption}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* --- MODIFIED: Main content now checks if there are courses to display */}
        <main>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(
                (
                  course // Render the filtered list
                ) => (
                  <Card
                    key={course._id}
                    className="rounded-2xl shadow-lg bg-card hover:shadow-xl hover:border-primary transition-all duration-300 ease-in-out h-full flex flex-col group"
                  >
                    <CardHeader className="p-6">
                      <CardTitle className="text-2xl font-bold">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-sm pt-1">
                        by {course.tutor.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-grow">
                      <p className="text-muted-foreground h-24 overflow-hidden">
                        {course.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-6 border-t mt-auto flex justify-between items-center">
                      <p className="text-2xl font-bold">
                        {course.cost === 0 ? "Free" : `$${course.cost}`}
                      </p>
                      <Button asChild className="font-semibold">
                        <Link to={`/courses/${course.slug}`}>
                          View Course
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              )}
            </div>
          ) : (
            // +++ ADDED: Display a message when no courses match the criteria
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-foreground">
                No Courses Found
              </h2>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
