import React from 'react';
import { FloatingParticles } from '../ui/FloatingParticles';

export const FloatingParticlesDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <FloatingParticles particleCount={100} />

      <div className="text-center z-10">
        <h1 className="text-4xl font-bold text-white mb-4">
          Floating Particles Demo
        </h1>
        <p className="text-gray-400 text-lg">
          Watch the white dots flowing upward in the background
        </p>
      </div>
    </div>
  );
};