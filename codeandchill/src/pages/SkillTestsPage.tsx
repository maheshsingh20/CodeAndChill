import React from 'react';
import { SkillTestList } from '@/components/skillTest/SkillTestList';
import { useActivityTracking } from '@/hooks/useActivityTracking';

export const SkillTestsPage: React.FC = () => {
  // Track skill testing activity
  useActivityTracking('skill_testing');
  
  return <SkillTestList />;
};