import React from 'react';
import { ProblemSolver } from '@/components/problem/ProblemSolver';
import { useUser } from '@/contexts/UserContext';
import { useActivityTracking } from '@/hooks/useActivityTracking';

export const ProblemSolverPage: React.FC = () => {
  const { recordActivity } = useUser();
  
  // Track problem solving activity
  useActivityTracking('problem_solving', { problemId: 'problem-1' });
  
  // Mock problem data
  const problemData = {
    id: 'problem-1',
    title: 'Two Sum',
    description: `
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
      
      <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
      
      <p>You can return the answer in any order.</p>
      
      <h3>Constraints:</h3>
      <ul>
        <li><code>2 <= nums.length <= 10^4</code></li>
        <li><code>-10^9 <= nums[i] <= 10^9</code></li>
        <li><code>-10^9 <= target <= 10^9</code></li>
        <li>Only one valid answer exists.</li>
      </ul>
    `,
    difficulty: 'Easy' as const,
    testCases: [
      {
        id: 'test-1',
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        isHidden: false
      },
      {
        id: 'test-2',
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        isHidden: false
      },
      {
        id: 'test-3',
        input: 'nums = [3,3], target = 6',
        expectedOutput: '[0,1]',
        isHidden: false
      },
      {
        id: 'test-4',
        input: 'nums = [1,5,3,7,9,2], target = 8',
        expectedOutput: '[2,3]',
        isHidden: true
      }
    ],
    starterCode: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
    language: 'javascript'
  };

  const handleSubmit = async (code: string, results: any) => {
    console.log('Submission:', { code, results });
    
    // Record problem solving activity
    try {
      await recordActivity('problem_solved');
      
      if (results.passed) {
        console.log('Problem solved successfully! Stats updated.');
      }
    } catch (error) {
      console.error('Failed to record problem solving activity:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <ProblemSolver
        problem={problemData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};