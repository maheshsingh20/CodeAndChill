import React, { useState } from 'react';
import { CoursePlayer } from '@/components/course/CoursePlayer';
import { CourseNotes } from '@/components/course/CourseNotes';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { Play, BookOpen, Bot, Clock, Star } from 'lucide-react';

export const CoursePlayerPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const { recordActivity } = useUser();

  // Track course viewing activity
  useActivityTracking('course_viewing', { courseId: 'course-1' });

  const handleProgressUpdate = async (progress: number) => {
    // Update progress in backend
    console.log('Progress updated:', progress);

    // If course is completed (100% progress), record the activity
    if (progress >= 100) {
      try {
        await recordActivity('course_completed');
        console.log('Course completion recorded!');
      } catch (error) {
        console.error('Failed to record course completion:', error);
      }
    }
  };

  const handleSeekTo = (time: number) => {
    if (videoRef) {
      videoRef.currentTime = time;
    }
  };

  // Mock course data
  const courseData = {
    id: 'course-1',
    title: 'Advanced React Patterns',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596 // 9:56 in seconds
  };

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/3 via-blue-500/3 to-cyan-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl">
              <Play className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                {courseData.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(courseData.duration / 60)}:{(courseData.duration % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>4.8 (2.1k reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
              <CoursePlayer
                videoUrl={courseData.videoUrl}
                title={courseData.title}
                duration={courseData.duration}
                onProgressUpdate={handleProgressUpdate}
                initialProgress={0}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
              <Tabs defaultValue="notes" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm border border-gray-600">
                  <TabsTrigger
                    value="notes"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    AI Help
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="mt-6">
                  <div className="bg-black/30 backdrop-blur-sm border border-gray-600 rounded-lg p-4">
                    <CourseNotes
                      courseId={courseData.id}
                      currentTime={currentTime}
                      onSeekTo={handleSeekTo}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-6">
                  <div className="bg-black/30 backdrop-blur-sm border border-gray-600 rounded-lg p-4">
                    <AIAssistant
                      courseContext={courseData.title}
                      onCodeSuggestion={(code) => console.log('Code suggestion:', code)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Course Info Card */}
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
                Course Progress
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                    Overall Progress
                  </span>
                  <span className="text-blue-400 font-medium">0%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" style={{ width: '0%' }} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-lg">
                    <div className="text-lg font-bold text-white">0</div>
                    <div className="text-gray-400">Lessons Completed</div>
                  </div>
                  <div className="text-center p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-lg">
                    <div className="text-lg font-bold text-white">0h</div>
                    <div className="text-gray-400">Time Spent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};