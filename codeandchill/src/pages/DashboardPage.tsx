import React from 'react';
import { UserDashboard } from '@/components/dashboard/UserDashboard';

export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
            Your Dashboard
          </h1>
          <p className="text-gray-400">
            Track your learning progress and achievements
          </p>
        </div>
        <UserDashboard />
      </div>
    </div>
  );
};