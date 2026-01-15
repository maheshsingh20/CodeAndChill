import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ModernCard, ModernCardHeader, ModernCardContent } from "@/components/ui/ModernCard";
import { ModernButton } from "@/components/ui/ModernButton";
import { Cpu, Database, Network, Server, BookOpen, ArrowRight, Clock, Loader, Code } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

// Course icon mapping for engineering courses
const courseIcons: Record<string, any> = {
  'dsa': Cpu,
  'dbms': Database,
  'operating-systems': Server,
  'computer-networks': Network,
  'software-engineering': BookOpen,
  'web-development': Code,
  'default': BookOpen
};

// Difficulty color mapping
const difficultyColors: Record<string, string> = {
  'Beginner': 'from-green-400 to-emerald-500',
  'Intermediate': 'from-blue-400 to-cyan-500',
  'Advanced': 'from-orange-400 to-red-500',
  'Expert': 'from-purple-400 to-pink-500'
};

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty?: string;
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
  estimatedTime?: string;
}

export function ContinueLearning() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProgress();
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      // Fetch engineering courses and their progress
      const engineeringCoursesResponse = await fetch(`${API_URL}/engineering-courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (engineeringCoursesResponse.ok) {
        const engineeringCourses = await engineeringCoursesResponse.json();

        // Fetch progress for each course
        const coursesWithProgress = await Promise.all(
          engineeringCourses.slice(0, 4).map(async (course: any) => {
            try {
              const progressResponse = await fetch(`${API_URL}/engineering-courses/${course.id}/progress`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (progressResponse.ok) {
                const progressData = await progressResponse.json();
                return {
                  id: course.id,
                  title: course.title,
                  description: course.description,
                  difficulty: course.difficulty,
                  progress: progressData.progressPercentage || 0,
                  totalLessons: course.totalLessons,
                  completedLessons: progressData.completedLessons?.length || 0,
                  estimatedTime: calculateEstimatedTime(course.totalLessons, progressData.completedLessons?.length || 0)
                };
              } else {
                // If progress fetch fails, return course with zero progress
                return {
                  id: course.id,
                  title: course.title,
                  description: course.description,
                  difficulty: course.difficulty,
                  progress: 0,
                  totalLessons: course.totalLessons,
                  completedLessons: 0,
                  estimatedTime: 'Ready to start'
                };
              }
            } catch (error) {
              console.error(`Error fetching progress for course ${course.id}:`, error);
              return {
                id: course.id,
                title: course.title,
                description: course.description,
                difficulty: course.difficulty,
                progress: 0,
                totalLessons: course.totalLessons,
                completedLessons: 0,
                estimatedTime: 'Ready to start'
              };
            }
          })
        );

        setCourses(coursesWithProgress);
      } else {
        throw new Error('Failed to fetch engineering courses');
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
      setError('Failed to load learning progress');
      // Fallback to static engineering courses
      await fetchEngineeringCourses();
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedTime = (totalLessons: number, completedLessons: number): string => {
    const remainingLessons = totalLessons - completedLessons;
    if (remainingLessons <= 0) return 'Completed';

    const estimatedHours = Math.ceil(remainingLessons * 0.5); // Assume 30 minutes per lesson
    if (estimatedHours < 1) return '< 1 hour left';
    if (estimatedHours === 1) return '1 hour left';
    return `${estimatedHours} hours left`;
  };

  const fetchEngineeringCourses = async () => {
    try {
      // Fallback static engineering courses
      const engineeringCourses = [
        {
          id: 'dsa',
          title: 'Data Structures & Algorithms',
          description: 'Master fundamental data structures and algorithms essential for programming interviews and efficient coding.',
          difficulty: 'Intermediate',
          totalLessons: 45,
          estimatedHours: 60
        },
        {
          id: 'dbms',
          title: 'Database Management Systems',
          description: 'Learn database design, SQL, normalization, and advanced database concepts for modern applications.',
          difficulty: 'Intermediate',
          totalLessons: 35,
          estimatedHours: 45
        },
        {
          id: 'operating-systems',
          title: 'Operating Systems',
          description: 'Understand OS concepts including processes, memory management, file systems, and system calls.',
          difficulty: 'Advanced',
          totalLessons: 40,
          estimatedHours: 55
        },
        {
          id: 'computer-networks',
          title: 'Computer Networks',
          description: 'Explore networking protocols, TCP/IP, network security, and distributed systems fundamentals.',
          difficulty: 'Advanced',
          totalLessons: 38,
          estimatedHours: 50
        }
      ];

      // Transform engineering courses
      const transformedCourses = engineeringCourses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        difficulty: course.difficulty,
        progress: 0,
        totalLessons: course.totalLessons,
        completedLessons: 0,
        estimatedTime: 'Ready to start'
      }));

      setCourses(transformedCourses);
    } catch (error) {
      console.error('Error setting fallback engineering courses:', error);
      setCourses([]);
    }
  };

  const getCourseIcon = (courseId: string) => {
    return courseIcons[courseId] || courseIcons.default;
  };

  const getDifficultyGradient = (difficulty: string): string => {
    return difficultyColors[difficulty] || difficultyColors.Intermediate;
  };

  const handleCourseClick = (courseId: string) => {
    // Navigate to engineering courses detail page
    navigate(`/engineering-courses/${courseId}`);
  };

  if (loading) {
    return (
      <ModernCard delay={0.2}>
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-green-400" />
          <span className="ml-3 text-gray-400">Loading your progress...</span>
        </div>
      </ModernCard>
    );
  }

  if (error && courses.length === 0) {
    return (
      <ModernCard delay={0.2}>
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">⚠️ {error}</div>
          <ModernButton onClick={fetchUserProgress} variant="danger" size="sm">
            Try Again
          </ModernButton>
        </div>
      </ModernCard>
    );
  }

  return (
    <ModernCard delay={0.2}>
      <ModernCardHeader
        title="Continue Learning"
        subtitle={courses.length > 0 ? "Continue your engineering courses" : "Start your engineering journey"}
        icon={BookOpen}
        gradient="from-green-400 via-emerald-500 to-teal-400"
        action={
          <Link to="/engineering-courses">
            <ModernButton variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All
            </ModernButton>
          </Link>
        }
      />

      <ModernCardContent>
        {courses.length === 0 ? (
          <div className="text-center py-6">
            <Cpu className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No engineering courses in progress</h3>
            <p className="text-gray-400 mb-4">Start learning core computer science subjects</p>
            <Link to="/engineering-courses">
              <ModernButton variant="primary" icon={ArrowRight} iconPosition="right">
                Browse Engineering Courses
              </ModernButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {courses.map((course, index) => {
              const CourseIcon = getCourseIcon(course.id);
              const gradient = getDifficultyGradient(course.difficulty || 'Intermediate');

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div
                    className="p-4 rounded-lg bg-gray-900/40 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 group cursor-pointer hover:bg-gray-800/40"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`p-2 rounded-md bg-gradient-to-r ${gradient} bg-opacity-20 flex-shrink-0`}>
                        <CourseIcon className={`w-5 h-5 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white group-hover:text-gray-100 transition-colors truncate">
                            {course.title}
                          </h4>
                          {course.difficulty && (
                            <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${gradient} bg-opacity-20 text-transparent bg-clip-text border border-current border-opacity-20 flex-shrink-0`}>
                              {course.difficulty}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Progress Bar */}
                        {course.progress !== undefined && course.progress > 0 && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5">
                              <motion.div
                                className={`h-1.5 rounded-full bg-gradient-to-r ${gradient}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${course.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Time Left */}
                        {course.estimatedTime && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{course.estimatedTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </ModernCardContent>
    </ModernCard>
  );
}