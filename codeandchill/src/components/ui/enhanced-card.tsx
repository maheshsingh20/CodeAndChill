import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

// Card variant types
export type CardVariant =
  | 'default'
  | 'gradient'
  | 'neon'
  | 'glass'
  | 'minimal'
  | 'elevated'
  | 'bordered'
  | 'cyber'
  | 'aurora'
  | 'matrix';

export type CardColor =
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'pink'
  | 'cyan'
  | 'red'
  | 'yellow'
  | 'indigo'
  | 'emerald';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  color?: CardColor;
  hover?: boolean;
  glow?: boolean;
  animated?: boolean;
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  iconColor?: CardColor;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  gradient?: boolean;
  color?: CardColor;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { }

// Color mappings for different variants
const colorMappings = {
  blue: {
    gradient: 'from-blue-500/20 via-blue-600/10 to-blue-700/20',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/25',
    text: 'text-blue-400',
    accent: 'bg-blue-500/10',
    neon: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
    cyber: 'border-blue-400 bg-gradient-to-br from-blue-950/50 to-slate-950/80',
  },
  purple: {
    gradient: 'from-purple-500/20 via-purple-600/10 to-purple-700/20',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/25',
    text: 'text-purple-400',
    accent: 'bg-purple-500/10',
    neon: 'shadow-[0_0_20px_rgba(147,51,234,0.5)]',
    cyber: 'border-purple-400 bg-gradient-to-br from-purple-950/50 to-slate-950/80',
  },
  green: {
    gradient: 'from-green-500/20 via-green-600/10 to-green-700/20',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/25',
    text: 'text-green-400',
    accent: 'bg-green-500/10',
    neon: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
    cyber: 'border-green-400 bg-gradient-to-br from-green-950/50 to-slate-950/80',
  },
  orange: {
    gradient: 'from-orange-500/20 via-orange-600/10 to-orange-700/20',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/25',
    text: 'text-orange-400',
    accent: 'bg-orange-500/10',
    neon: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
    cyber: 'border-orange-400 bg-gradient-to-br from-orange-950/50 to-slate-950/80',
  },
  pink: {
    gradient: 'from-pink-500/20 via-pink-600/10 to-pink-700/20',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/25',
    text: 'text-pink-400',
    accent: 'bg-pink-500/10',
    neon: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]',
    cyber: 'border-pink-400 bg-gradient-to-br from-pink-950/50 to-slate-950/80',
  },
  cyan: {
    gradient: 'from-cyan-500/20 via-cyan-600/10 to-cyan-700/20',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/25',
    text: 'text-cyan-400',
    accent: 'bg-cyan-500/10',
    neon: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    cyber: 'border-cyan-400 bg-gradient-to-br from-cyan-950/50 to-slate-950/80',
  },
  red: {
    gradient: 'from-red-500/20 via-red-600/10 to-red-700/20',
    border: 'border-red-500/30',
    glow: 'shadow-red-500/25',
    text: 'text-red-400',
    accent: 'bg-red-500/10',
    neon: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
    cyber: 'border-red-400 bg-gradient-to-br from-red-950/50 to-slate-950/80',
  },
  yellow: {
    gradient: 'from-yellow-500/20 via-yellow-600/10 to-yellow-700/20',
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/25',
    text: 'text-yellow-400',
    accent: 'bg-yellow-500/10',
    neon: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
    cyber: 'border-yellow-400 bg-gradient-to-br from-yellow-950/50 to-slate-950/80',
  },
  indigo: {
    gradient: 'from-indigo-500/20 via-indigo-600/10 to-indigo-700/20',
    border: 'border-indigo-500/30',
    glow: 'shadow-indigo-500/25',
    text: 'text-indigo-400',
    accent: 'bg-indigo-500/10',
    neon: 'shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    cyber: 'border-indigo-400 bg-gradient-to-br from-indigo-950/50 to-slate-950/80',
  },
  emerald: {
    gradient: 'from-emerald-500/20 via-emerald-600/10 to-emerald-700/20',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/25',
    text: 'text-emerald-400',
    accent: 'bg-emerald-500/10',
    neon: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    cyber: 'border-emerald-400 bg-gradient-to-br from-emerald-950/50 to-slate-950/80',
  },
};

// Variant styles
const getVariantStyles = (variant: CardVariant, color: CardColor, glow: boolean) => {
  const colors = colorMappings[color];

  const baseStyles = 'rounded-xl transition-all duration-300 ease-in-out';

  switch (variant) {
    case 'gradient':
      return cn(
        baseStyles,
        `bg-gradient-to-br ${colors.gradient}`,
        `border ${colors.border}`,
        'backdrop-blur-sm',
        glow && `shadow-xl ${colors.glow}`
      );

    case 'neon':
      return cn(
        baseStyles,
        'bg-slate-900/80 backdrop-blur-md',
        `border-2 ${colors.border}`,
        colors.neon,
        'relative overflow-hidden'
      );

    case 'glass':
      return cn(
        baseStyles,
        'bg-slate-900/40 backdrop-blur-xl',
        'border border-slate-700/50',
        'shadow-2xl',
        glow && `shadow-xl ${colors.glow}`
      );

    case 'minimal':
      return cn(
        baseStyles,
        'bg-slate-800/50',
        `border-l-4 ${colors.border}`,
        'border-y border-r border-slate-700/30'
      );

    case 'elevated':
      return cn(
        baseStyles,
        'bg-slate-800/80',
        'border border-slate-700/50',
        'shadow-2xl shadow-black/50',
        glow && `shadow-xl ${colors.glow}`
      );

    case 'bordered':
      return cn(
        baseStyles,
        'bg-slate-900/60',
        `border-2 ${colors.border}`,
        'backdrop-blur-sm'
      );

    case 'cyber':
      return cn(
        baseStyles,
        colors.cyber,
        'border-2',
        'shadow-lg',
        'relative overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-1000'
      );

    case 'aurora':
      return cn(
        baseStyles,
        'bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80',
        'border border-slate-600/30',
        'backdrop-blur-md',
        'relative overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-purple-500/10 before:to-transparent before:animate-pulse'
      );

    case 'matrix':
      return cn(
        baseStyles,
        'bg-black/80',
        'border border-green-500/30',
        'shadow-lg shadow-green-500/20',
        'relative overflow-hidden',
        'font-mono'
      );

    default:
      return cn(
        baseStyles,
        'bg-slate-800/60 backdrop-blur-sm',
        'border border-slate-700/50',
        'shadow-lg',
        glow && `shadow-xl ${colors.glow}`
      );
  }
};

export function EnhancedCard({
  variant = 'default',
  color = 'blue',
  hover = true,
  glow = false,
  animated = false,
  className,
  children,
  ...props
}: EnhancedCardProps) {
  return (
    <div
      className={cn(
        getVariantStyles(variant, color, glow),
        hover && 'hover:scale-[1.02] hover:-translate-y-1',
        animated && 'animate-in fade-in-0 slide-in-from-bottom-4 duration-500',
        variant === 'cyber' && 'hover:before:translate-x-[100%]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function EnhancedCardHeader({
  icon: Icon,
  iconColor = 'blue',
  className,
  children,
  ...props
}: CardHeaderProps) {
  const colors = colorMappings[iconColor];

  return (
    <div className={cn('flex flex-col space-y-2 p-6', className)} {...props}>
      {Icon && (
        <div className={cn('w-fit p-2 rounded-lg', colors.accent)}>
          <Icon className={cn('h-6 w-6', colors.text)} />
        </div>
      )}
      {children}
    </div>
  );
}

export function EnhancedCardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function EnhancedCardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}

export function EnhancedCardTitle({
  gradient = false,
  color = 'blue',
  className,
  ...props
}: CardTitleProps) {
  const colors = colorMappings[color];

  return (
    <h3
      className={cn(
        'text-xl font-bold leading-tight tracking-tight',
        gradient
          ? `bg-gradient-to-r from-${color}-400 to-${color}-600 bg-clip-text text-transparent`
          : 'text-slate-100',
        className
      )}
      {...props}
    />
  );
}

export function EnhancedCardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn('text-sm text-slate-400 leading-relaxed', className)}
      {...props}
    />
  );
}