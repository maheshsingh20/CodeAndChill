import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CoursePlayerProps {
  videoUrl: string;
  title: string;
  duration: number;
  onProgressUpdate: (progress: number) => void;
  initialProgress?: number;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  videoUrl,
  title,
  duration,
  onProgressUpdate,
  initialProgress = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (videoRef.current && initialProgress > 0) {
      videoRef.current.currentTime = (initialProgress / 100) * duration;
    }
  }, [initialProgress, duration]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
      const progress = (current / duration) * 100;
      onProgressUpdate(progress);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="relative bg-black rounded-lg overflow-hidden">
      <div 
        className="relative group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.volume = volume;
            }
          }}
        />
        
        {/* Controls Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Play/Pause Button (Center) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlay}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Progress Bar */}
            <Slider
              value={[currentTime ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
            />
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={togglePlay}>
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </Button>
                
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={toggleMute}>
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    className="w-20"
                  />
                </div>
                
                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Playback Speed */}
                <select
                  value={playbackRate}
                  onChange={(e) => changePlaybackRate(Number(e.target.value))}
                  className="bg-black/50 text-white text-sm rounded px-2 py-1"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
                
                <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                  <Maximize size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Info */}
      <div className="p-4 bg-gray-900 text-white">
        <h3 className="font-semibold">{title}</h3>
        <Progress value={(currentTime / duration) * 100} className="mt-2" />
      </div>
    </Card>
  );
};