import React from 'react';
import { motion } from 'framer-motion';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'feature';
  glowColor?: 'blue' | 'purple' | 'green' | 'orange';
  animated?: boolean;
  onClick?: () => void;
}

export const NeonCard: React.FC<NeonCardProps> = ({
  children,
  className = '',
  variant = 'default',
  glowColor = 'blue',
  animated = true,
  onClick
}) => {
  const glowColors = {
    blue: {
      border: 'hover:border-blue-600/40',
      shine: 'from-blue-500/5 via-blue-600/3 to-blue-700/5',
      lines: {
        top: 'rgba(96, 165, 250, 0.7)',
        bottom: 'rgba(59, 130, 246, 0.7)',
        left: 'rgba(59, 130, 246, 0.6)',
        right: 'rgba(37, 99, 235, 0.6)'
      },
      dots: ['bg-blue-400', 'bg-blue-500', 'bg-blue-600'],
      corners: 'from-blue-500/15 via-blue-600/8 to-blue-700/15'
    },
    purple: {
      border: 'hover:border-purple-600/40',
      shine: 'from-purple-500/5 via-purple-600/3 to-purple-700/5',
      lines: {
        top: 'rgba(168, 85, 247, 0.7)',
        bottom: 'rgba(147, 51, 234, 0.7)',
        left: 'rgba(147, 51, 234, 0.6)',
        right: 'rgba(126, 34, 206, 0.6)'
      },
      dots: ['bg-purple-400', 'bg-purple-500', 'bg-purple-600'],
      corners: 'from-purple-500/15 via-purple-600/8 to-purple-700/15'
    },
    green: {
      border: 'hover:border-green-600/40',
      shine: 'from-green-500/5 via-green-600/3 to-green-700/5',
      lines: {
        top: 'rgba(34, 197, 94, 0.7)',
        bottom: 'rgba(22, 163, 74, 0.7)',
        left: 'rgba(22, 163, 74, 0.6)',
        right: 'rgba(21, 128, 61, 0.6)'
      },
      dots: ['bg-green-400', 'bg-green-500', 'bg-green-600'],
      corners: 'from-green-500/15 via-green-600/8 to-green-700/15'
    },
    orange: {
      border: 'hover:border-orange-600/40',
      shine: 'from-orange-500/5 via-orange-600/3 to-orange-700/5',
      lines: {
        top: 'rgba(251, 146, 60, 0.7)',
        bottom: 'rgba(234, 88, 12, 0.7)',
        left: 'rgba(234, 88, 12, 0.6)',
        right: 'rgba(194, 65, 12, 0.6)'
      },
      dots: ['bg-orange-400', 'bg-orange-500', 'bg-orange-600'],
      corners: 'from-orange-500/15 via-orange-600/8 to-orange-700/15'
    }
  };

  const colors = glowColors[glowColor];

  const baseClasses = `
    relative bg-gradient-to-br from-black via-gray-950 to-gray-900 
    backdrop-blur-sm border border-gray-800/50 rounded-lg 
    ${colors.border} hover:shadow-xl hover:shadow-black/60 
    transition-all duration-300 overflow-hidden group
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  const variantClasses = {
    default: 'p-6 min-h-[200px]',
    compact: 'p-4 min-h-[120px]',
    feature: 'p-8 min-h-[300px]'
  };

  const CardContent = (
    <div className={`${baseClasses} ${variantClasses[variant]}`} onClick={onClick}>
      {/* Blue shine effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.shine} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      {/* Neon Curved Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top curved neon line */}
        <div
          className="absolute top-2 left-4 right-4 h-0.5 rounded-full opacity-50 group-hover:opacity-90 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to right, transparent, ${colors.lines.top}, transparent)`
          }}
        >
          <div
            className="absolute inset-0 rounded-full blur-sm"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.lines.top}, transparent)`
            }}
          />
        </div>

        {/* Left curved accent */}
        <div
          className="absolute left-2 top-8 bottom-8 w-0.5 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to bottom, transparent, ${colors.lines.left}, transparent)`
          }}
        >
          <div
            className="absolute inset-0 rounded-full blur-sm"
            style={{
              background: `linear-gradient(to bottom, transparent, ${colors.lines.left}, transparent)`
            }}
          />
        </div>

        {/* Right curved accent */}
        <div
          className="absolute right-2 top-12 bottom-12 w-0.5 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to bottom, transparent, ${colors.lines.right}, transparent)`
          }}
        >
          <div
            className="absolute inset-0 rounded-full blur-sm"
            style={{
              background: `linear-gradient(to bottom, transparent, ${colors.lines.right}, transparent)`
            }}
          />
        </div>

        {/* Bottom curved neon line */}
        <div
          className="absolute bottom-2 left-6 right-6 h-0.5 rounded-full opacity-50 group-hover:opacity-90 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to right, transparent, ${colors.lines.bottom}, transparent)`
          }}
        >
          <div
            className="absolute inset-0 rounded-full blur-sm"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.lines.bottom}, transparent)`
            }}
          />
        </div>

        {/* Diagonal curved accent - top left */}
        <div className="absolute top-4 left-4 w-16 h-16 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
          <div className={`w-full h-full border-l-2 border-t-2 border-${glowColor}-400/70 rounded-tl-full`} />
          <div className={`absolute inset-0 w-full h-full border-l-2 border-t-2 border-${glowColor}-400 rounded-tl-full blur-sm`} />
        </div>

        {/* Diagonal curved accent - bottom right */}
        <div className="absolute bottom-4 right-4 w-12 h-12 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
          <div className={`w-full h-full border-r-2 border-b-2 border-${glowColor}-600/70 rounded-br-full`} />
          <div className={`absolute inset-0 w-full h-full border-r-2 border-b-2 border-${glowColor}-600 rounded-br-full blur-sm`} />
        </div>

        {/* Floating dots */}
        <div className={`absolute top-6 right-8 w-1.5 h-1.5 ${colors.dots[0]} rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500`}>
          <div className={`absolute inset-0 w-full h-full ${colors.dots[0]} rounded-full blur-sm`} />
        </div>
        <div className={`absolute bottom-8 left-8 w-1.5 h-1.5 ${colors.dots[1]} rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500`}>
          <div className={`absolute inset-0 w-full h-full ${colors.dots[1]} rounded-full blur-sm`} />
        </div>
        <div className={`absolute top-1/2 left-6 w-1 h-1 ${colors.dots[2]} rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-500`}>
          <div className={`absolute inset-0 w-full h-full ${colors.dots[2]} rounded-full blur-sm`} />
        </div>
      </div>

      {/* Corner highlights */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${colors.corners} rounded-full -translate-y-8 translate-x-8 opacity-60`} />
      <div className={`absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr ${colors.corners} rounded-full translate-y-6 -translate-x-6 opacity-40`} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
      >
        {CardContent}
      </motion.div>
    );
  }

  return CardContent;
};

// Neon Button Component
interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  glowColor?: 'blue' | 'purple' | 'green' | 'orange';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  glowColor = 'blue',
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const glowColors = {
    blue: 'border-blue-500/30 hover:border-blue-600/50 from-blue-500/10 via-blue-600/5 to-blue-700/10 from-white via-blue-100 to-blue-200',
    purple: 'border-purple-500/30 hover:border-purple-600/50 from-purple-500/10 via-purple-600/5 to-purple-700/10 from-white via-purple-100 to-purple-200',
    green: 'border-green-500/30 hover:border-green-600/50 from-green-500/10 via-green-600/5 to-green-700/10 from-white via-green-100 to-green-200',
    orange: 'border-orange-500/30 hover:border-orange-600/50 from-orange-500/10 via-orange-600/5 to-orange-700/10 from-white via-orange-100 to-orange-200'
  };

  const colors = glowColors[glowColor].split(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden group py-3 px-6 
        bg-gradient-to-r from-black via-gray-950 to-black 
        hover:from-gray-950 hover:via-black hover:to-gray-950 
        font-medium rounded-lg border ${colors[0]} ${colors[1]}
        shadow-lg hover:shadow-xl hover:shadow-black/50 
        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <span className={`relative z-10 bg-gradient-to-r ${colors[6]} ${colors[7]} ${colors[8]} bg-clip-text text-transparent`} style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' }}>
        {children}
      </span>
      <div className={`absolute inset-0 bg-gradient-to-r ${colors[2]} ${colors[3]} ${colors[4]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </button>
  );
};