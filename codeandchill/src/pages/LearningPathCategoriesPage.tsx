import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LearningPathService } from '@/services/learningPathService';
import {
  Code,
  Database,
  Smartphone,
  Globe,
  Brain,
  Palette,
  Shield,
  TrendingUp,
  Users,
  BookOpen,
  ArrowRight,
  Star,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  pathCount: number;
  totalEnrollments: number;
  averageRating: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  estimatedTime: string;
  color: string;
  gradient: string;
}

export const LearningPathCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, statsData] = await Promise.all([
        LearningPathService.getCategories(),
        LearningPathService.getGlobalStats()
      ]);

      // Map API data to component format
      const mappedCategories = categoriesData.map((cat: any) => ({
        id: cat._id,
        name: cat.name,
        description: cat.description,
        icon: getIconForCategory(cat.name),
        pathCount: cat.pathCount,
        totalEnrollments: cat.totalEnrollments,
        averageRating: cat.averageRating,
        difficulty: cat.difficulty || 'mixed',
        estimatedTime: cat.estimatedTime || '2-6 months',
        color: getColorForCategory(cat.name),
        gradient: getGradientForCategory(cat.name)
      }));

      setCategories(mappedCategories);
      setGlobalStats(statsData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to static data if API fails
      setCategories(getStaticCategories());
      setGlobalStats({
        totalPaths: 72,
        totalStudents: 89200,
        totalCategories: 8,
        averageRating: 4.8
      });
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (categoryName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Web Development': <Globe size={32} />,
      'Mobile Development': <Smartphone size={32} />,
      'Data Science': <Brain size={32} />,
      'Backend Development': <Database size={32} />,
      'Cybersecurity': <Shield size={32} />,
      'UI/UX Design': <Palette size={32} />,
      'Programming Fundamentals': <Code size={32} />,
      'Business & Technology': <TrendingUp size={32} />
    };
    return iconMap[categoryName] || <BookOpen size={32} />;
  };

  const getColorForCategory = (categoryName: string) => {
    const colorMap: { [key: string]: string } = {
      'Web Development': 'blue',
      'Mobile Development': 'green',
      'Data Science': 'purple',
      'Backend Development': 'orange',
      'Cybersecurity': 'red',
      'UI/UX Design': 'pink',
      'Programming Fundamentals': 'indigo',
      'Business & Technology': 'yellow'
    };
    return colorMap[categoryName] || 'blue';
  };

  const getGradientForCategory = (categoryName: string) => {
    const gradientMap: { [key: string]: string } = {
      'Web Development': 'from-blue-500 to-cyan-500',
      'Mobile Development': 'from-green-500 to-emerald-500',
      'Data Science': 'from-purple-500 to-pink-500',
      'Backend Development': 'from-orange-500 to-red-500',
      'Cybersecurity': 'from-red-500 to-pink-500',
      'UI/UX Design': 'from-pink-500 to-rose-500',
      'Programming Fundamentals': 'from-indigo-500 to-blue-500',
      'Business & Technology': 'from-yellow-500 to-orange-500'
    };
    return gradientMap[categoryName] || 'from-blue-500 to-cyan-500';
  };

  const getStaticCategories = (): Category[] => [
    {
      id: 'web-development',
      name: 'Web Development',
      description: 'Master modern web technologies from frontend to backend',
      icon: <Globe size={32} />,
      pathCount: 12,
      totalEnrollments: 15420,
      averageRating: 4.8,
      difficulty: 'mixed',
      estimatedTime: '3-6 months',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    // ... other static categories
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'mixed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const filteredCategories = categories.filter(category =>
    selectedDifficulty === 'all' || category.difficulty === selectedDifficulty
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.totalEnrollments - a.totalEnrollments;
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'newest':
        return b.pathCount - a.pathCount;
      default:
        return 0;
    }
  });

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Target className="text-purple-400" size={48} />
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Learning Categories
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Explore structured learning paths organized by technology and skill level
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {globalStats?.totalPaths || 0}
              </div>
              <div className="text-sm text-gray-400">Total Paths</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {globalStats?.totalStudents?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-400">Students</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {globalStats?.totalCategories || categories.length}
              </div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {globalStats?.averageRating?.toFixed(1) || '4.7'}★
              </div>
              <div className="text-sm text-gray-400">Avg Rating</div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none transition-all duration-300"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="mixed">Mixed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none transition-all duration-300"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Most Paths</option>
          </select>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCategories.map((category) => (
              <Link key={category.id} to={`/learning-paths?category=${category.id}`}>
                <Card className="group h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60 hover:scale-[1.02]">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {category.icon}
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-purple-100 group-hover:to-purple-200 transition-all duration-300">
                      {category.name}
                    </CardTitle>

                    <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 line-clamp-2">
                      {category.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Difficulty Badge */}
                    <div className="flex items-center justify-between">
                      <Badge className={`${getDifficultyColor(category.difficulty)} border text-xs`}>
                        {category.difficulty.charAt(0).toUpperCase() + category.difficulty.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={14} className="fill-current" />
                        <span className="text-sm font-medium">{category.averageRating}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <BookOpen size={14} />
                          <span>Learning Paths</span>
                        </div>
                        <span className="font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                          {category.pathCount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users size={14} />
                          <span>Students</span>
                        </div>
                        <span className="font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                          {category.totalEnrollments.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock size={14} />
                          <span>Duration</span>
                        </div>
                        <span className="font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                          {category.estimatedTime}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <Zap size={14} className="text-purple-400" />
                        <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-purple-200 group-hover:to-purple-300 transition-all duration-300 font-medium">
                          Explore Paths
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-400 mb-6">
              Explore all learning paths or use our advanced search to find the perfect match for your goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/learning-paths">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <BookOpen size={16} className="mr-2" />
                  Browse All Paths
                </Button>
              </Link>
              <Link to="/learning-paths/search">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Advanced Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};