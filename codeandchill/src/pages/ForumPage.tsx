import React from 'react';
import { DiscussionForum } from '@/components/forum/DiscussionForum';
import { useActivityTracking } from '@/hooks/useActivityTracking';

export const ForumPage: React.FC = () => {
  // Track forum browsing activity
  useActivityTracking('forum_browsing');
  
  return (
    <div className="min-h-screen bg-gray-900">
      <DiscussionForum />
    </div>
  );
};