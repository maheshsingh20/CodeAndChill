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
    <div className="w-full min-h-screen relative">
      {/* Consistent Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 gradient-secondary opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(45,212,191,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-professional">
        <header className="text-center mb-16">
          <h1 className="heading-gradient text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6">
            Explore Our Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose a path and master the in-demand skills for a career in tech with our comprehensive course catalog.
          </p>
        </header>

        {/* Professional Search and Filter controls */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or description..."
              className="input-professional pl-12 h-14 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterOption} onValueChange={setFilterOption}>
            <SelectTrigger className="w-full sm:w-[200px] h-14 text-base border-2 border-border focus:border-primary">
              <SelectValue placeholder="Filter by price" />
            </SelectTrigger>
            <SelectContent className="border-border">
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free Courses</SelectItem>
              <SelectItem value="paid">Paid Courses</SelectItem>
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
                    className="card-professional hover-lift professional-shadow border-gradient h-full flex flex-col group overflow-hidden"
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
