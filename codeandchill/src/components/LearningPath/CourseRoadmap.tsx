import React from 'react';
import { Card, CardTitle } from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";
import { Lock, PlayCircle } from 'lucide-react';

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

export function CourseRoadmap({ roadmap, unlockedLevels = 1 }: CourseRoadmapProps) {
  let courseIndex = 0;

  return (
    <div className="relative pl-8">
      {/* Vertical gradient timeline */}
      <div className="absolute left-4 top-0 h-full w-[3px] bg-gradient-to-b from-cyan-300 via-lime-300 to-emerald-300 -translate-x-1/2 rounded-full"></div>

      <div className="space-y-12">
        {roadmap.map((level, levelIndex) => {
          const isLevelUnlocked = levelIndex < unlockedLevels;

          return (
            <section key={level.level} aria-labelledby={`level-${levelIndex}`} className="relative">
              {/* Timeline node */}
              <div
                className="absolute -left-4 top-1 h-6 w-6 bg-white border-4 border-cyan-300 rounded-full -translate-x-1/2 shadow-md"
                aria-hidden="true"
              ></div>

              {/* Level title */}
              <h3
                id={`level-${levelIndex}`}
                className="text-2xl font-bold mb-6 text-cyan-900"
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
                        flex items-center p-5 rounded-2xl
                        shadow-lg bg-gradient-to-r from-white/90 to-cyan-50
                        backdrop-blur-sm border border-cyan-100
                        transition-all duration-300
                        ${
                          isLevelUnlocked
                            ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
                            : "opacity-60 cursor-not-allowed pointer-events-none"
                        }
                      `}
                      aria-disabled={!isLevelUnlocked}
                      tabIndex={isLevelUnlocked ? 0 : -1}
                    >
                      {/* Course number */}
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-100 text-cyan-800 font-semibold text-lg mr-4 select-none shadow-sm">
                        {courseIndex}
                      </div>

                      {/* Course title */}
                      <div className="flex-grow">
                        <CardTitle className="text-lg text-cyan-900">{course.title}</CardTitle>
                      </div>

                      {/* Icon */}
                      <div className="ml-4">
                        {isLevelUnlocked ? (
                          <PlayCircle
                            className="h-6 w-6 text-cyan-600"
                            aria-label="Start course"
                          />
                        ) : (
                          <Lock
                            className="h-6 w-6 text-gray-400"
                            aria-label="Locked course"
                          />
                        )}
                      </div>
                    </Card>
                  );

                  return isLevelUnlocked ? (
                    <Link to={`/courses/${course.id}`} key={course.id} tabIndex={-1}>
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
