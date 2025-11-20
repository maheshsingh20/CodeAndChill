import { API_BASE_URL } from '@/constants';

export interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'upcoming' | 'active' | 'completed';
  problems: {
    problemId: string;
    points: number;
    order: number;
  }[];
  participants: string[];
  rules: string;
  prizes: {
    position: number;
    description: string;
    points?: number;
  }[];
  maxParticipants?: number;
  isPublic: boolean;
  createdBy: {
    _id: string;
    username: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContestProblem {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  points: number;
  order: number;
  attempts: number;
  solved: boolean;
  bestScore: number;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

export interface ContestSubmission {
  _id: string;
  contestId: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error';
  score: number;
  executionTime: number;
  memoryUsed: number;
  testCasesPassed: number;
  totalTestCases: number;
  submittedAt: string;
  judgedAt?: string;
  penalty: number;
}

export interface LeaderboardEntry {
  _id: string;
  contestId: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  username: string;
  totalScore: number;
  totalPenalty: number;
  problemsSolved: number;
  lastSubmissionTime: string;
  rank: number;
  problemScores: {
    problemId: string;
    score: number;
    attempts: number;
    solvedAt?: string;
    penalty: number;
  }[];
  isActive: boolean;
}

export class ContestService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Get all contests
  static async getContests(status?: string, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status })
      });

      const response = await fetch(`${API_BASE_URL}/contests?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contests');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching contests:', error);
      throw error;
    }
  }

  // Get contest by ID
  static async getContest(contestId: string): Promise<Contest> {
    try {
      const response = await fetch(`${API_BASE_URL}/contests/${contestId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contest');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching contest:', error);
      throw error;
    }
  }

  // Register for contest
  static async registerForContest(contestId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/contests/${contestId}/register`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register for contest');
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering for contest:', error);
      throw error;
    }
  }

  // Get contest problems
  static async getContestProblems(contestId: string): Promise<{ problems: ContestProblem[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/contests/${contestId}/problems`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch contest problems');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching contest problems:', error);
      throw error;
    }
  }

  // Submit solution
  static async submitSolution(contestId: string, problemId: string, code: string, language: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/contests/${contestId}/submit`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          problemId,
          code,
          language
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit solution');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting solution:', error);
      throw error;
    }
  }

  // Get contest leaderboard
  static async getLeaderboard(contestId: string, page = 1, limit = 50) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`${API_BASE_URL}/contests/${contestId}/leaderboard?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  // Get user's contest submissions
  static async getUserSubmissions(contestId: string): Promise<ContestSubmission[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/contests/${contestId}/submissions`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  }

  // Helper methods
  static getStatusColor(status: Contest['status']) {
    switch (status) {
      case 'upcoming': return 'text-blue-400';
      case 'active': return 'text-green-400';
      case 'completed': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  }

  static getStatusBadgeColor(status: Contest['status']) {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }

  static getSubmissionStatusColor(status: ContestSubmission['status']) {
    switch (status) {
      case 'accepted': return 'text-green-400';
      case 'wrong_answer': return 'text-red-400';
      case 'time_limit_exceeded': return 'text-yellow-400';
      case 'runtime_error': return 'text-orange-400';
      case 'compilation_error': return 'text-purple-400';
      case 'pending': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  }

  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  static formatTimeRemaining(endTime: string): string {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  }

  static isContestActive(contest: Contest): boolean {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    
    return now >= start && now <= end;
  }

  static canRegister(contest: Contest): boolean {
    return contest.status === 'upcoming' && 
           (!contest.maxParticipants || contest.participants.length < contest.maxParticipants);
  }
}