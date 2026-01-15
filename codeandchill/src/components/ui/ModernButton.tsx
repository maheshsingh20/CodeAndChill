import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ModernButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg";

  const sizeClasses = {
    sm: 'h-9 px-4 py-2 text-sm',
    md: 'h-11 px-6 py-2 text-sm',
    lg: 'h-12 px-8 py-3 text-base'
  };

  const variantStyles = {
    primary: {
      className: 'border border-gray-600 hover:border-gray-500 shadow-lg hover:shadow-xl',
      style: {
        background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
        color: 'transparent',
        backgroundClip: 'text' as const,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 50%, #e5e7eb 100%)'
      },
      hoverStyle: {
        background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
        backgroundClip: 'padding-box' as const,
        WebkitBackgroundClip: 'padding-box',
        color: 'white',
        WebkitTextFillColor: 'white'
      }
    },
    secondary: {
      className: 'border border-gray-700 hover:border-gray-600 shadow-md hover:shadow-lg',
      style: {
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        color: 'transparent',
        backgroundClip: 'text' as const,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundImage: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 50%, #d1d5db 100%)'
      },
      hoverStyle: {
        background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
        backgroundClip: 'padding-box' as const,
        WebkitBackgroundClip: 'padding-box',
        color: 'white',
        WebkitTextFillColor: 'white'
      }
    },
    outline: {
      className: 'border-2 border-gray-600 bg-transparent hover:bg-gray-800 hover:border-gray-500',
      style: {
        color: 'transparent',
        backgroundClip: 'text' as const,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 50%, #e5e7eb 100%)'
      },
      hoverStyle: {
        color: 'white',
        WebkitTextFillColor: 'white'
      }
    },
    ghost: {
      className: 'hover:bg-gray-800/50',
      style: {
        color: 'transparent',
        backgroundClip: 'text' as const,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundImage: 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 50%, #9ca3af 100%)'
      },
      hoverStyle: {
        color: 'white',
        WebkitTextFillColor: 'white'
      }
    },
    danger: {
      className: 'border border-gray-600 hover:border-gray-500 shadow-md hover:shadow-lg',
      style: {
        background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
        color: 'transparent',
        backgroundClip: 'text' as const,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundImage: 'linear-gradient(135deg, #fca5a5 0%, #f87171 50%, #ef4444 100%)'
      },
      hoverStyle: {
        background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
        backgroundClip: 'padding-box' as const,
        WebkitBackgroundClip: 'padding-box',
        color: '#fca5a5',
        WebkitTextFillColor: '#fca5a5'
      }
    }
  };

  const currentVariant = variantStyles[variant];
  const classes = `${baseClasses} ${sizeClasses[size]} ${currentVariant.className} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        style={currentVariant.style}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      style={currentVariant.style}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
};