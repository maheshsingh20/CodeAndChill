import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  delay?: number;
  onClick?: () => void;
  clickable?: boolean;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  hoverScale = 1.02,
  delay = 0,
  onClick,
  clickable = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{
        scale: hoverScale,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      className={`group relative ${clickable ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Main card */}
      <div className={`relative backdrop-blur-xl bg-black/40 border border-gray-800/50 rounded-lg p-8 shadow-2xl hover:border-gray-700/50 transition-all duration-500 overflow-hidden ${className}`}>
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

interface ModernCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  gradient?: string;
  action?: React.ReactNode;
}

export const ModernCardHeader: React.FC<ModernCardHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  gradient = 'from-white via-gray-100 to-gray-300',
  action
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {Icon && (
          <motion.div
            className="p-3 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-700/50"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className={`w-6 h-6 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`} />
          </motion.div>
        )}
        <div>
          <h3 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

interface ModernCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ModernCardContent: React.FC<ModernCardContentProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};

interface ModernCardItemProps {
  title: string;
  description?: string;
  value?: string | number;
  icon?: LucideIcon;
  gradient?: string;
  onClick?: () => void;
  progress?: number;
  badge?: string;
  className?: string;
}

export const ModernCardItem: React.FC<ModernCardItemProps> = ({
  title,
  description,
  value,
  icon: Icon,
  gradient = 'from-blue-400 to-cyan-500',
  onClick,
  progress,
  badge,
  className = ''
}) => {
  return (
    <motion.div
      className={`p-4 rounded-lg bg-gray-900/30 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      whileHover={onClick ? { scale: 1.02, x: 5 } : undefined}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {Icon && (
            <div className={`p-2 rounded-md bg-gradient-to-r ${gradient} bg-opacity-20`}>
              <Icon className={`w-4 h-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white group-hover:text-gray-100 transition-colors truncate">
                {title}
              </h4>
              {badge && (
                <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${gradient} bg-opacity-20 text-transparent bg-clip-text border border-current border-opacity-20`}>
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors truncate">
                {description}
              </p>
            )}
            {progress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full bg-gradient-to-r ${gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {value && (
          <div className={`text-right font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </div>
        )}
      </div>
    </motion.div>
  );
};