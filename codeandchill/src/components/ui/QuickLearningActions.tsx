import React from 'react';
import { motion } from 'framer-motion';
import { Search, BookmarkPlus, Filter, Shuffle, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickLearningActionsProps {
  className?: string;
}

export const QuickLearningActions: React.FC<QuickLearningActionsProps> = ({
  className = ""
}) => {
  const actions = [
    {
      icon: Search,
      label: "Browse Courses",
      description: "Discover new learning paths",
      color: "from-blue-500 to-cyan-500",
      onClick: () => console.log("Browse courses")
    },
    {
      icon: BookmarkPlus,
      label: "Saved Courses",
      description: "View your bookmarked content",
      color: "from-green-500 to-emerald-500",
      onClick: () => console.log("Saved courses")
    },
    {
      icon: Calendar,
      label: "Study Schedule",
      description: "Plan your learning time",
      color: "from-purple-500 to-pink-500",
      onClick: () => console.log("Study schedule")
    },
    {
      icon: Target,
      label: "Learning Goals",
      description: "Set and track objectives",
      color: "from-orange-500 to-red-500",
      onClick: () => console.log("Learning goals")
    }
  ];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            onClick={action.onClick}
            className="group relative h-auto p-4 bg-gray-900/50 border-gray-700/50 hover:border-gray-600 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <div className={`
                p-2 rounded-lg bg-gradient-to-r ${action.color} 
                group-hover:scale-110 transition-transform duration-300
              `}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {action.label}
                </div>
                <div className="text-xs text-gray-400">
                  {action.description}
                </div>
              </div>
            </div>

            {/* Hover Glow */}
            <div className={`
              absolute inset-0 rounded-lg bg-gradient-to-r ${action.color} opacity-0 
              group-hover:opacity-10 transition-opacity duration-300 pointer-events-none
            `} />
          </Button>
        </motion.div>
      ))}
    </div>
  );
};