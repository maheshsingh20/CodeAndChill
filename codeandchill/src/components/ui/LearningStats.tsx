import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Trophy, Target, TrendingUp, Award } from 'lucide-react';

interface LearningStatsProps {
  totalCourses?: number;
  completedCourses?: number;
  totalHours?: number;
  currentStreak?: number;
  className?: string;
}

export const LearningStats: React.FC<LearningStatsProps> = ({
  totalCourses = 12,
  completedCourses = 8,
  totalHours = 47,
  currentStreak = 5,
  className = ""
}) => {
  const stats = [
    {
      icon: BookOpen,
      label: "Courses",
      value: `${completedCourses}/${totalCourses}`,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      icon: Clock,
      label: "Hours Learned",
      value: totalHours.toString(),
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
    {
      icon: TrendingUp,
      label: "Current Streak",
      value: `${currentStreak} days`,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    },
    {
      icon: Trophy,
      label: "Completion Rate",
      value: `${Math.round((completedCourses / totalCourses) * 100)}%`,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    }
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group"
        >
          <div className={`
            relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300
            ${stat.bgColor} ${stat.borderColor}
            hover:scale-105 hover:shadow-lg
          `}>
            {/* Icon */}
            <div className={`
              inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-3
              group-hover:scale-110 transition-transform duration-300
            `}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>

            {/* Value */}
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-sm text-gray-400">
              {stat.label}
            </div>

            {/* Hover Glow */}
            <div className={`
              absolute inset-0 rounded-xl bg-gradient-to-r ${stat.color} opacity-0 
              group-hover:opacity-10 transition-opacity duration-300 pointer-events-none
            `} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};