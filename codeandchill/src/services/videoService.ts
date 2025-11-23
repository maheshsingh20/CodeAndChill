import { API_BASE_URL } from '@/constants';

export interface Video {
  _id: string;
  title: string;
  description: string;
  learningPathId: string;
  lessonId?: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  qualities: {
    quality: '360p' | '480p' | '720p' | '1080p';
    url: string;
    size: number;
  }[];
  subtitles: {
    language: string;
    url: string;
  }[];
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  views: number;
  likes: string[];
  isPublished: boolean;
  order: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VideoProgress {
  _id: string;
  userId: string;
  videoId: string;
  watchedDuration: number;
  lastPosition: number;
  completed: boolean;
  completedAt?: string;
  watchHistory: {
    timestamp: string;
    duration: number;
  }[];
}

export class VideoService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Get videos by learning path
  static async getVideosByPath(pathId: string): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos/learning-path/${pathId}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch videos');
    const data = await response.json();
    return data.videos;
  }

  // Get video details
  static async getVideo(videoId: string): Promise<Video> {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch video');
    const data = await response.json();
    return data.video;
  }

  // Get video stream URL
  static getStreamUrl(videoId: string): string {
    const token = localStorage.getItem('authToken');
    return `${API_BASE_URL}/videos/${videoId}/stream${token ? `?token=${token}` : ''}`;
  }

  // Update progress
  static async updateProgress(videoId: string, watchedDuration: number, lastPosition: number) {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/progress`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ watchedDuration, lastPosition })
    });
    if (!response.ok) throw new Error('Failed to update progress');
    return response.json();
  }

  // Get progress
  static async getProgress(videoId: string): Promise<VideoProgress> {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/progress`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch progress');
    const data = await response.json();
    return data.progress;
  }

  // Like/unlike video
  static async toggleLike(videoId: string) {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/like`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to like video');
    return response.json();
  }

  // Get user's all videos
  static async getUserVideos() {
    const response = await fetch(`${API_BASE_URL}/videos/user/all`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch user videos');
    const data = await response.json();
    return data.progress;
  }

  // Format duration
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
