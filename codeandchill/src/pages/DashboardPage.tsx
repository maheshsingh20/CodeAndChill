import React from 'react';
import { UserDashboard } from '@/components/dashboard/UserDashboard';

export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <UserDashboard />
      </div>
    </div>
  );
};