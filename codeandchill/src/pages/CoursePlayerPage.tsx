import React, { useState } from 'react';
import { CoursePlayer } from '@/components/course/CoursePlayer';
import { CourseNotes } from '@/components/course/CourseNotes';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { useActivityTracking } from '@/hooks/useActivityTracking';

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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <CoursePlayer
              videoUrl={courseData.videoUrl}
              title={courseData.title}
              duration={courseData.duration}
              onProgressUpdate={handleProgressUpdate}
              initialProgress={0}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="ai">AI Help</TabsTrigger>
              </TabsList>
              
              <TabsContent value="notes">
                <CourseNotes
                  courseId={courseData.id}
                  currentTime={currentTime}
                  onSeekTo={handleSeekTo}
                />
              </TabsContent>
              
              <TabsContent value="ai">
                <AIAssistant
                  courseContext={courseData.title}
                  onCodeSuggestion={(code) => console.log('Code suggestion:', code)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};