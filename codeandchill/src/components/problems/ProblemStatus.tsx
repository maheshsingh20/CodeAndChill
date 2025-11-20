import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProblemStatusProps {
  problemId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  className?: string;
}

interface ProblemStatus {
  status: 'not_attempted' | 'attempted' | 'solved';
  attempts?: number;
  bestScore?: number;
}

export const ProblemStatus: React.FC<ProblemStatusProps> = ({ 
  problemId, 
  difficulty, 
  className = '' 
}) => {
  const [status, setStatus] = useState<ProblemStatus>({ status: 'not_attempted' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblemStatus();
  }, [problemId]);

  const fetchProblemStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3001/api/submissions/problem/${problemId}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching problem status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400 border-green-400';
      case 'Medium':
        return 'text-yellow-400 border-yellow-400';
      case 'Hard':
        return 'text-red-400 border-red-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = () => {
    if (loading) {
      return <Circle className="w-5 h-5 text-gray-400 animate-pulse" />;
    }

    switch (status.status) {
      case 'solved':
        return <CheckCircle className="w-5 h-5 text-green-400 fill-current" />;
      case 'attempted':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'solved':
        return `Solved${status.bestScore ? ` (${status.bestScore}%)` : ''}`;
      case 'attempted':
        return `Attempted${status.attempts ? ` (${status.attempts}x)` : ''}`;
      default:
        return 'Not Attempted';
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'solved':
        return 'text-green-400';
      case 'attempted':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {getStatusIcon()}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={getDifficultyColor(difficulty)}>
          {difficulty}
        </Badge>
        <span className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
    </div>
  );
};