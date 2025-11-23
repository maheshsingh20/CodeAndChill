import React from 'react';
import { Play, Clock, Eye, ThumbsUp, CheckCircle } from 'lucide-react';
import { Video, VideoProgress } from '@/services/videoService';
import { VideoService } from '@/services/videoService';

interface VideoListProps {
  videos: Video[];
  progress?: Record<string, VideoProgress>;
  onVideoSelect: (video: Video) => void;
  selectedVideoId?: string;
}

export const VideoList: React.FC<VideoListProps> = ({
  videos,
  progress,
  onVideoSelect,
  selectedVideoId
}) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No videos available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white mb-4">Course Videos</h3>
      {videos.map((video, index) => {
        const videoProgress = progress?.[video._id];
        const isCompleted = videoProgress?.completed;
        const progressPercent = videoProgress 
          ? (videoProgress.watchedDuration / video.duration) * 100 
          : 0;

        return (
          <div
            key={video._id}
            onClick={() => onVideoSelect(video)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedVideoId === video._id
                ? 'bg-purple-600/20 border-2 border-purple-500'
                : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700 hover:bg-gray-800/70'
            }`}
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0">
                <img
                  src={video.thumbnail || '/placeholder-video.jpg'}
                  alt={video.title}
                  className="w-32 h-20 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="80" viewBox="0 0 128 80"%3E%3Crect fill="%23374151" width="128" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-family="sans-serif" font-size="14"%3EVideo%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded group-hover:bg-black/50 transition-colors">
                  <Play size={24} className="text-white" />
                </div>
                {isCompleted && (
                  <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-white truncate">
                    {index + 1}. {video.title}
                  </h4>
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                  {video.description}
                </p>

                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {VideoService.formatDuration(video.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={14} />
                    {video.likes.length}
                  </span>
                </div>

                {/* Progress Bar */}
                {videoProgress && progressPercent > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>{Math.round(progressPercent)}% complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          isCompleted ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
