import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LearningPathService} from '@/services/learningPathService';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  Users,
  Star,
  BookOpen,
  Target,
  ArrowRight,
  X,
  TrendingUp,
  Award,
  Zap,
  ChevronDown,
  Grid3X3,
  List
} from 'lucide-react';

interface SearchFilters {
  query: string;
  difficulty: string[];
  duration: string[];
  rating: number;
  tags: string[];
  sortBy: 'relevance' | 'popular' | 'rating' | 'newest' | 'duration';
  viewMode: 'grid' | 'list';
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  courseCount: number;
  enrollmentCount: number;
  averageRating: number;
  totalRatings: number;
  tags: string[];
  createdAt: string;
  isPopular: boolean;
  isFeatured: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  courseCount: number;
  enrollmentCount: number;
  averageRating: number;
  totalRatings: number;
  tags: string[];
  createdAt: string;
  isPopular: boolean;
  isFeatured: boolean;
}

export const LearningPathSearchPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    difficulty: [],
    duration: [],
    rating: 0,
    tags: [],
    sortBy: 'relevance',
    viewMode: 'grid'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<LearningPath[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const fetchAvailableTags = async () => {
    try {
      const tags = await LearningPathService.getAvailableTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      // Fallback to static tags
      setAvailableTags([
        'javascript', 'python', 'react', 'nodejs', 'mongodb', 'machine-learning',
        'data-science', 'mobile', 'ios', 'android', 'tensorflow', 'react-native',
        'backend', 'frontend', 'fullstack', 'api', 'database', 'cloud', 'aws'
      ]);
    }
  };

  const performSearch = async () => {
    try {
      setIsSearching(true);
      const searchParams = {
        query: filters.query,
        difficulty: filters.difficulty,
        duration: filters.duration,
        rating: filters.rating,
        tags: filters.tags,
        sortBy: filters.sortBy,
        page: 1,
        limit: 20
      };

      const response = await LearningPathService.searchPaths(searchParams);

      // Map API response to component format
      const mappedResults = response.paths.map((path: any) => ({
        id: path._id,
        title: path.title,
        description: path.description,
        icon: path.icon,
        difficulty: path.difficulty,
        duration: LearningPathService.formatDuration(path.estimatedDuration),
        courseCount: path.courses.length,
        enrollmentCount: path.enrollmentCount,
        averageRating: path.averageRating,
        totalRatings: path.totalRatings,
        tags: path.tags,
        createdAt: path.createdAt,
        isPopular: path.enrollmentCount > 10000,
        isFeatured: path.isFeatured || false
      }));

      setSearchResults(mappedResults);
      setTotalResults(response.total);
    } catch (error) {
      console.error('Error searching paths:', error);
      // Fallback to empty results
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'difficulty' | 'duration' | 'tags', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      difficulty: [],
      duration: [],
      rating: 0,
      tags: [],
      sortBy: 'relevance',
      viewMode: filters.viewMode
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const activeFiltersCount = filters.difficulty.length + filters.duration.length + filters.tags.length + (filters.rating > 0 ? 1 : 0);

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Search className="text-purple-400" size={48} />
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Search Learning Paths
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Find the perfect learning path with advanced search and filtering
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search learning paths, technologies, or skills..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="pl-12 pr-4 py-4 text-lg bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <SlidersHorizontal size={16} className="mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-purple-600 text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} className="mr-2" />
                Clear All
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="px-4 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none"
            >
              <option value="relevance">Most Relevant</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="duration">Shortest Duration</option>
            </select>

            <div className="flex items-center border border-gray-600 rounded-md overflow-hidden">
              <Button
                variant={filters.viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateFilter('viewMode', 'grid')}
                className="rounded-none"
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={filters.viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateFilter('viewMode', 'list')}
                className="rounded-none"
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                <Filter size={20} />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Difficulty Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Difficulty Level</h4>
                <div className="flex flex-wrap gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <Button
                      key={level}
                      variant={filters.difficulty.includes(level) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('difficulty', level)}
                      className={filters.difficulty.includes(level)
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                      }
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Duration</h4>
                <div className="flex flex-wrap gap-2">
                  {['1-2 months', '3-4 months', '5-6 months', '6+ months'].map((duration) => (
                    <Button
                      key={duration}
                      variant={filters.duration.includes(duration) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('duration', duration)}
                      className={filters.duration.includes(duration)
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                      }
                    >
                      {duration}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Minimum Rating</h4>
                <div className="flex items-center gap-2">
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <Button
                      key={rating}
                      variant={filters.rating === rating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('rating', filters.rating === rating ? 0 : rating)}
                      className={filters.rating === rating
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                      }
                    >
                      <Star size={14} className="mr-1 fill-current" />
                      {rating}+
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Technologies & Skills</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('tags', tag)}
                      className={filters.tags.includes(tag)
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                      }
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Search Results
            </h2>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              {totalResults} paths found
            </Badge>
          </div>

          {filters.query && (
            <div className="text-gray-400">
              Searching for: <span className="text-white font-medium">"{filters.query}"</span>
            </div>
          )}
        </div>

        {/* Search Results */}
        {isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
            ))}
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                No Results Found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters} className="bg-purple-600 hover:bg-purple-700">
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className={filters.viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {searchResults.map((path) => (
              <Link key={path.id} to={`/learning-paths/${path.id}`}>
                <Card className={`group bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60 ${filters.viewMode === 'grid' ? 'h-full hover:scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}>
                  <CardHeader className={filters.viewMode === 'list' ? 'pb-4' : ''}>
                    <div className={`flex ${filters.viewMode === 'list' ? 'items-center gap-6' : 'items-start justify-between mb-4'}`}>
                      <div className={`flex items-center gap-3 ${filters.viewMode === 'list' ? '' : 'flex-col items-start'}`}>
                        <div className="text-4xl">{path.icon}</div>
                        <div className={filters.viewMode === 'list' ? 'flex-1' : ''}>
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-purple-100 group-hover:to-purple-200 transition-all duration-300">
                              {path.title}
                            </CardTitle>
                            {path.isFeatured && (
                              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                Featured
                              </Badge>
                            )}
                            {path.isPopular && (
                              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                                <TrendingUp size={12} className="mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                            {path.description}
                          </p>
                        </div>
                      </div>

                      {filters.viewMode === 'grid' && (
                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className={`grid ${filters.viewMode === 'list' ? 'grid-cols-5' : 'grid-cols-2'} gap-4 text-sm`}>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getDifficultyColor(path.difficulty)} border text-xs`}>
                          {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={14} />
                        <span>{path.duration}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <BookOpen size={14} />
                        <span>{path.courseCount} courses</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <Users size={14} />
                        <span>{path.enrollmentCount.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2 text-yellow-400">
                        <Star size={14} className="fill-current" />
                        <span>{path.averageRating} ({path.totalRatings})</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {path.tags.slice(0, filters.viewMode === 'list' ? 6 : 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {path.tags.length > (filters.viewMode === 'list' ? 6 : 4) && (
                        <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                          +{path.tags.length - (filters.viewMode === 'list' ? 6 : 4)}
                        </Badge>
                      )}
                    </div>

                    {filters.viewMode === 'list' && (
                      <div className="flex items-center justify-end">
                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {searchResults.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Load More Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};