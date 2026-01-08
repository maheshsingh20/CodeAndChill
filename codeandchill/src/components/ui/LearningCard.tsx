import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, BookOpen, Star, ChevronRight, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface LearningCardProps {
  title: string;
  author: string;
  progress: number;
  image: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: number;
  totalLessons?: number;
  completedLessons?: number;
  category?: string;
  isNew?: boolean;
  link?: string;
  className?: string;
}

export const LearningCard: React.FC<LearningCardProps> = ({
  title,
  author,
  progress,
  image,
  duration = "2h 30m",
  difficulty = "Intermediate",
  rating = 4.8,
  totalLessons = 24,
  completedLessons = Math.floor((progress / 100) * 24),
  category = "Programming",
  isNew = false,
  link = "#",
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getProgressColor = () => {
    if (progress >= 80) return 'from-green-500 to-emerald-600';
    if (progress >= 50) return 'from-blue-500 to-cyan-600';
    if (progress >= 25) return 'from-yellow-500 to-orange-600';
    return 'from-purple-500 to-pink-600';
  };

  return (
    <motion.div
      className={`group relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">

        {/* Animated Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-4 left-4 z-20">
            <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              New
            </Badge>
          </div>
        )}

        {/* Image Section with Overlay */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Progress Ring Overlay */}
          <div className="absolute top-4 right-4">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`bg-gradient-to-r ${getProgressColor()}`}
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Play Button Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Category and Difficulty */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
              {category}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </Badge>
          </div>

          {/* Title and Author */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-400">by {author}</p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{completedLessons}/{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-semibold">{progress}%</span>
            </div>
            <div className="relative">
              <Progress
                value={progress}
                className="h-2 bg-gray-700"
              />
              <div
                className={`absolute top-0 left-0 h-2 bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Achievement Indicator */}
          {progress >= 75 && (
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <Trophy className="w-4 h-4" />
              <span>Almost complete!</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg group/btn transition-all duration-300"
          >
            <Link to={link} className="flex items-center justify-center gap-2">
              <PlayCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
              <span>Continue Learning</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Shadow Enhancement */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10" />
    </motion.div>
  );
};