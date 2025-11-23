import React, { useState, useEffect } from 'react';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { VideoList } from '@/components/video/VideoList';
import { VideoService, Video, VideoProgress } from '@/services/videoService';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VideoTestPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [progress, setProgress] = useState<Record<string, VideoProgress>>({});
  const [loading, setLoading] = useState(true);

  // Demo data for testing (since we don't have videos uploaded yet)
  const demoVideos: Video[] = [
    {
      _id: 'demo1',
      title: 'Introduction to React',
      description: 'Learn the basics of React and component-based architecture',
      learningPathId: 'path1',
      duration: 600, // 10 minutes
      thumbnail: 'https://via.placeholder.com/320x180/9333ea/ffffff?text=React+Intro',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      qualities: [],
      subtitles: [],
      uploadedBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
      views: 150,
      likes: [],
      isPublished: true,
      order: 1,
      tags: ['react', 'javascript'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'demo2',
      title: 'React Hooks Deep Dive',
      description: 'Master useState, useEffect, and custom hooks',
      learningPathId: 'path1',
      duration: 900, // 15 minutes
      thumbnail: 'https://via.placeholder.com/320x180/7c3aed/ffffff?text=React+Hooks',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      qualities: [],
      subtitles: [],
      uploadedBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
      views: 120,
      likes: [],
      isPublished: true,
      order: 2,
      tags: ['react', 'hooks'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'demo3',
      title: 'Building a Todo App',
      description: 'Create a complete todo application with React',
      learningPathId: 'path1',
      duration: 1200, // 20 minutes
      thumbnail: 'https://via.placeholder.com/320x180/6366f1/ffffff?text=Todo+App',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      qualities: [],
      subtitles: [],
      uploadedBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
      views: 200,
      likes: [],
      isPublished: true,
      order: 3,
      tags: ['react', 'project'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // For now, use demo data
    setVideos(demoVideos);
    setSelectedVideo(demoVideos[0]);
    setLoading(false);

    // In production, fetch real videos:
    // VideoService.getVideosByPath(pathId).then(setVideos);
  }, []);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleProgressUpdate = (duration: number, position: number) => {
    if (selectedVideo) {
      setProgress(prev => ({
        ...prev,
        [selectedVideo._id]: {
          ...prev[selectedVideo._id],
          watchedDuration: duration,
          lastPosition: position,
          completed: (duration / selectedVideo.duration) >= 0.9
        } as VideoProgress
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Video Courses Demo</h1>
          <p className="text-gray-400">Experience the new video learning feature</p>
        </div>

        {/* Video Player and List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            {selectedVideo && (
              <div className="space-y-4">
                <VideoPlayer
                  videoId={selectedVideo._id}
                  videoUrl={selectedVideo.videoUrl}
                  thumbnail={selectedVideo.thumbnail}
                  initialPosition={progress[selectedVideo._id]?.lastPosition || 0}
                  onProgressUpdate={handleProgressUpdate}
                />
                
                {/* Video Info */}
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h2>
                  <p className="text-gray-400 mb-4">{selectedVideo.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{selectedVideo.views} views</span>
                    <span>•</span>
                    <span>{selectedVideo.likes.length} likes</span>
                    <span>•</span>
                    <span>By {selectedVideo.uploadedBy.name}</span>
                  </div>

                  {selectedVideo.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {selectedVideo.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Video List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-lg p-4 sticky top-4">
              <VideoList
                videos={videos}
                progress={progress}
                onVideoSelect={handleVideoSelect}
                selectedVideoId={selectedVideo?._id}
              />
            </div>
          </div>
        </div>

        {/* Feature Info */}
        <div className="mt-12 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">✨ Video Course Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">Player Features:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Play/Pause controls</li>
                <li>• Seek forward/backward (10s)</li>
                <li>• Volume control</li>
                <li>• Playback speed (0.5x - 2x)</li>
                <li>• Fullscreen mode</li>
                <li>• Auto-hide controls</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">Progress Tracking:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Auto-save progress every 5s</li>
                <li>• Resume from last position</li>
                <li>• Completion detection (90%)</li>
                <li>• Watch history tracking</li>
                <li>• Visual progress indicators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
