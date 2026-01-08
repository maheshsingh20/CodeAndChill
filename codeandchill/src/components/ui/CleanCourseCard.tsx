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
      'operating-systems': 'blue',
      'dbms': 'green',
      'computer-networks': 'purple',
      'dsa': 'orange',
      'software-engineering': 'cyan',
      'web-development': 'pink'
    };
    return colors[subjectId as keyof typeof colors] || 'blue';
  };

  const color = getColorBySubject(id);

  return (
    <div className={`group relative bg-gray-900/60 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300 hover:bg-gray-900/80 ${className}`}>

      {/* Progress bar if course is in progress */}
      {progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 rounded-t-xl overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header with Icon and Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 bg-${color}-500/20 border border-${color}-500/30 rounded-lg group-hover:bg-${color}-500/30 transition-all duration-300`}>
          <div className={`text-${color}-400 w-6 h-6 flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 mb-1">
            {title}
          </h3>
          {progress > 0 && (
            <div className="text-sm text-gray-400">
              {progress}% completed
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed mb-6">
        {description}
      </p>

      {/* Progress section for ongoing courses */}
      {progress > 0 && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button
        asChild
        className={`w-full bg-${color}-600 hover:bg-${color}-700 text-white border-0 group/btn`}
      >
        <Link to={`/engineering-courses/${id}`} className="flex items-center justify-center gap-2">
          <PlayCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
          <span>Continue Learning</span>
        </Link>
      </Button>

      {/* Subtle hover glow */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-${color}-500/5 via-${color}-500/5 to-${color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
    </div>
  );
};