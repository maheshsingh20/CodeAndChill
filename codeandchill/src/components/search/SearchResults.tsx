import React from 'react';
import { Link } from 'react-router-dom';
import { SearchResult } from '@/services/searchService';
import { Code, BookOpen, Trophy, Zap, Target, Clock } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  onResultClick: () => void;
}

const getTypeIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'course':
      return <BookOpen className="w-4 h-4 text-blue-400" />;
    case 'problem':
      return <Code className="w-4 h-4 text-green-400" />;
    case 'quiz':
      return <Target className="w-4 h-4 text-purple-400" />;
    case 'contest':
      return <Trophy className="w-4 h-4 text-yellow-400" />;
    case 'skill-test':
      return <Zap className="w-4 h-4 text-orange-400" />;
    default:
      return <Code className="w-4 h-4 text-gray-400" />;
  }
};

const getTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'course':
      return 'Course';
    case 'problem':
      return 'Problem';
    case 'quiz':
      return 'Quiz';
    case 'contest':
      return 'Contest';
    case 'skill-test':
      return 'Skill Test';
    default:
      return 'Content';
  }
};

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'text-green-400';
    case 'medium':
      return 'text-yellow-400';
    case 'hard':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  query,
  onResultClick
}) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 p-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
          <span className="ml-2 text-gray-400">Searching...</span>
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 p-4">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No results found for "{query}"</div>
          <div className="text-sm text-gray-500">
            Try searching for courses, problems, quizzes, or contests
          </div>
        </div>
      </div>
    );
  }

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<SearchResult['type'], SearchResult[]>);

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-2">
        <div className="text-xs text-gray-400 px-3 py-2 border-b border-gray-700">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </div>
        
        {Object.entries(groupedResults).map(([type, typeResults]) => (
          <div key={type} className="mt-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-1 uppercase tracking-wide">
              {getTypeLabel(type as SearchResult['type'])}s ({typeResults.length})
            </div>
            {typeResults.slice(0, 5).map((result) => (
              <Link
                key={result.id}
                to={result.url}
                onClick={onResultClick}
                className="block px-3 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-200 truncate">
                        {result.title}
                      </h4>
                      {result.difficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-gray-800 ${getDifficultyColor(result.difficulty)}`}>
                          {result.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {result.description}
                    </p>
                    {result.category && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">
                          {result.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            {typeResults.length > 5 && (
              <div className="px-3 py-2 text-xs text-gray-500 text-center border-b border-gray-800">
                +{typeResults.length - 5} more {getTypeLabel(type as SearchResult['type']).toLowerCase()}s
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};