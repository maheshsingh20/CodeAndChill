import React from 'react';
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardFooter,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Zap,
  Shield,
  Cpu,
  Palette,
  Layers,
  Code,
  Database,
  Globe,
  Rocket
} from 'lucide-react';

export function CardShowcase() {
  const cardVariants = [
    {
      variant: 'gradient' as const,
      color: 'blue' as const,
      icon: Sparkles,
      title: 'Gradient Card',
      description: 'Beautiful gradient backgrounds with subtle animations',
    },
    {
      variant: 'neon' as const,
      color: 'purple' as const,
      icon: Zap,
      title: 'Neon Card',
      description: 'Glowing neon effects perfect for dark themes',
    },
    {
      variant: 'glass' as const,
      color: 'cyan' as const,
      icon: Shield,
      title: 'Glass Card',
      description: 'Modern glassmorphism with backdrop blur effects',
    },
    {
      variant: 'cyber' as const,
      color: 'green' as const,
      icon: Cpu,
      title: 'Cyber Card',
      description: 'Futuristic cyberpunk-inspired design',
    },
    {
      variant: 'aurora' as const,
      color: 'pink' as const,
      icon: Palette,
      title: 'Aurora Card',
      description: 'Dynamic aurora-like color shifting effects',
    },
    {
      variant: 'matrix' as const,
      color: 'emerald' as const,
      icon: Code,
      title: 'Matrix Card',
      description: 'Matrix-inspired design with digital rain effects',
    },
    {
      variant: 'elevated' as const,
      color: 'orange' as const,
      icon: Layers,
      title: 'Elevated Card',
      description: 'Deep shadows and elevated appearance',
    },
    {
      variant: 'minimal' as const,
      color: 'indigo' as const,
      icon: Database,
      title: 'Minimal Card',
      description: 'Clean and minimal design with accent borders',
    },
    {
      variant: 'bordered' as const,
      color: 'red' as const,
      icon: Globe,
      title: 'Bordered Card',
      description: 'Prominent borders with subtle backgrounds',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Enhanced Card System
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A comprehensive collection of beautiful, animated cards designed for dark mode interfaces
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardVariants.map((card, index) => (
            <EnhancedCard
              key={card.variant}
              variant={card.variant}
              color={card.color}
              hover={true}
              glow={true}
              animated={true}
              className="h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <EnhancedCardHeader
                icon={card.icon}
                iconColor={card.color}
              >
                <EnhancedCardTitle
                  gradient={true}
                  color={card.color}
                >
                  {card.title}
                </EnhancedCardTitle>
                <EnhancedCardDescription>
                  {card.description}
                </EnhancedCardDescription>
              </EnhancedCardHeader>

              <EnhancedCardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-2 h-2 bg-current rounded-full"></span>
                    Variant: {card.variant}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-2 h-2 bg-current rounded-full"></span>
                    Color: {card.color}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-2 h-2 bg-current rounded-full"></span>
                    Hover effects enabled
                  </div>
                </div>
              </EnhancedCardContent>

              <EnhancedCardFooter>
                <Button
                  className={`w-full bg-${card.color}-600 hover:bg-${card.color}-500 text-white border-0`}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Explore
                </Button>
              </EnhancedCardFooter>
            </EnhancedCard>
          ))}
        </div>

        {/* Usage Examples */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Usage Examples
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Code Example */}
            <EnhancedCard variant="glass" color="blue" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Usage</h3>
              <pre className="text-sm text-slate-300 bg-slate-800/50 p-4 rounded-lg overflow-x-auto">
                {`<EnhancedCard 
  variant="gradient" 
  color="blue" 
  hover={true} 
  glow={true}
>
  <EnhancedCardHeader icon={Sparkles}>
    <EnhancedCardTitle gradient={true}>
      My Card Title
    </EnhancedCardTitle>
  </EnhancedCardHeader>
</EnhancedCard>`}
              </pre>
            </EnhancedCard>

            {/* Features */}
            <EnhancedCard variant="neon" color="purple" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  10 unique card variants
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  10 color themes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Hover animations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Glow effects
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Responsive design
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Accessibility support
                </li>
              </ul>
            </EnhancedCard>
          </div>
        </div>
      </div>
    </div>
  );
}