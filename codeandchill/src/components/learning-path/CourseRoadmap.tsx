import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Lock, PlayCircle } from "lucide-react";

type Course = {
  id: string;
  title: string;
};

type RoadmapLevel = {
  level: string;
  courses: Course[];
};

interface CourseRoadmapProps {
  roadmap: RoadmapLevel[];
  unlockedLevels?: number; // optional prop to control how many levels are unlocked
}

export function CourseRoadmap({
  roadmap,
  unlockedLevels = 1,
}: CourseRoadmapProps) {
  let courseIndex = 0;

  return (
    <div className="relative pl-8">
      {/* Vertical gradient timeline */}
      <div className="absolute left-4 top-0 h-full w-[3px] bg-gradient-to-b from-purple-500 via-gray-500 to-gray-600 -translate-x-1/2 rounded-full"></div>

      <div className="space-y-12">
        {roadmap.map((level, levelIndex) => {
          const isLevelUnlocked = levelIndex < unlockedLevels;

          return (
            <section
              key={level.level}
              aria-labelledby={`level-${levelIndex}`}
              className="relative"
            >
              {/* Timeline node */}
              <div
                className="absolute -left-4 top-1 h-6 w-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 border-4 border-purple-500 rounded-full -translate-x-1/2 shadow-md"
                aria-hidden="true"
              ></div>

              {/* Level title */}
              <h3
                id={`level-${levelIndex}`}
                className="text-2xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent"
              >
                {level.level}
              </h3>

              {/* Courses */}
              <div className="space-y-4">
                {level.courses.map((course) => {
                  courseIndex++;

                  const cardContent = (
                    <Card
                      className={`
                        flex items-center p-5 rounded-md
                        shadow-lg bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700
                        transition-all duration-300
                        ${isLevelUnlocked
                          ? "hover:shadow-xl hover:shadow-black/60 hover:scale-[1.02] hover:border-gray-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2"
                          : "opacity-60 cursor-not-allowed pointer-events-none"
                        }
                      `}
                      aria-disabled={!isLevelUnlocked}
                      tabIndex={isLevelUnlocked ? 0 : -1}
                    >
                      {/* Course number */}
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-lg mr-4 select-none shadow-sm">
                        {courseIndex}
                      </div>

                      {/* Course title */}
                      <div className="flex-grow">
                        <CardTitle className="text-lg bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                          {course.title}
                        </CardTitle>
                      </div>

                      {/* Icon */}
                      <div className="ml-4">
                        {isLevelUnlocked ? (
                          <PlayCircle
                            className="h-6 w-6 text-green-400"
                            aria-label="Start course"
                          />
                        ) : (
                          <Lock
                            className="h-6 w-6 text-gray-500"
                            aria-label="Locked course"
                          />
                        )}
                      </div>
                    </Card>
                  );

                  return isLevelUnlocked ? (
                    <Link
                      to={`/courses/${course.id}`}
                      key={course.id}
                      tabIndex={-1}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div key={course.id}>{cardContent}</div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
