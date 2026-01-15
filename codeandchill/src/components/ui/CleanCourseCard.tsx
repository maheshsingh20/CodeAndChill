import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CleanCourseCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  progress?: number;
  className?: string;
}

export const CleanCourseCard: React.FC<CleanCourseCardProps> = ({
  id,
  icon,
  title,
  description,
  progress = 0,
  className = ""
}) => {
  const getColorBySubject = (subjectId: string) => {
    const colors = {
      'operating-systems': {
        primary: 'blue-500',
        secondary: 'blue-400',
        bg: 'blue-600/20',
        border: 'blue-500/30',
        hover: 'blue-600/30'
      },
      'dbms': {
        primary: 'green-500',
        secondary: 'green-400',
        bg: 'green-600/20',
        border: 'green-500/30',
        hover: 'green-600/30'
      },
      'computer-networks': {
        primary: 'purple-500',
        secondary: 'purple-400',
        bg: 'purple-600/20',
        border: 'purple-500/30',
        hover: 'purple-600/30'
      },
      'dsa': {
        primary: 'orange-500',
        secondary: 'orange-400',
        bg: 'orange-600/20',
        border: 'orange-500/30',
        hover: 'orange-600/30'
      },
      'software-engineering': {
        primary: 'cyan-500',
        secondary: 'cyan-400',
        bg: 'cyan-600/20',
        border: 'cyan-500/30',
        hover: 'cyan-600/30'
      },
      'web-development': {
        primary: 'pink-500',
        secondary: 'pink-400',
        bg: 'pink-600/20',
        border: 'pink-500/30',
        hover: 'pink-600/30'
      }
    };
    return colors[subjectId as keyof typeof colors] || colors['operating-systems'];
  };

  const colorScheme = getColorBySubject(id);

  return (
    <div className={`group relative bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60 ${className}`}>

      {/* Progress bar if course is in progress */}
      {progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 rounded-t-xl overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-${colorScheme.primary} to-${colorScheme.secondary} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header with Icon and Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 bg-gradient-to-br from-${colorScheme.bg} to-${colorScheme.bg} backdrop-blur-sm border border-${colorScheme.border} rounded-lg group-hover:from-${colorScheme.hover} group-hover:to-${colorScheme.hover} transition-all duration-300`}>
          <div className={`text-${colorScheme.secondary} w-6 h-6 flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-purple-100 group-hover:to-purple-200 transition-all duration-300 mb-1">
            {title}
          </h3>
          {progress > 0 && (
            <div className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              {progress}% completed
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-sm leading-relaxed mb-6">
        {description}
      </p>

      {/* Progress section for ongoing courses */}
      {progress > 0 && (
        <div className="mb-4 p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-lg">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">Progress</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`bg-gradient-to-r from-${colorScheme.primary} to-${colorScheme.secondary} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button
        asChild
        className={`w-full bg-gradient-to-r from-${colorScheme.primary} to-${colorScheme.secondary} hover:from-purple-700 hover:to-blue-700 text-white border-0 group/btn`}
      >
        <Link to={`/engineering-courses/${id}`} className="flex items-center justify-center gap-2">
          <PlayCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
          <span>Continue Learning</span>
        </Link>
      </Button>

      {/* Subtle hover arrow */}
      <ArrowRight className="absolute top-6 right-6 w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" />
    </div>
  );
};