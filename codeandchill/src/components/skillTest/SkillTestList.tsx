import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  Trophy, 
  Filter, 
  Search, 
  CheckCircle,
  Star,
  BookOpen,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface SkillTest {
  _id: string;
  skillName: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  passingScore: number;
  questions: any[];
  tags: string[];
  alreadyPassed?: boolean;
}

export const SkillTestList: React.FC = () => {
  const [skillTests, setSkillTests] = useState<SkillTest[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkillTests();
    fetchAvailableSkills();
  }, [searchQuery, selectedSkill, selectedDifficulty, page]);

  const fetchSkillTests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });
      
      if (searchQuery) params.append('skill', searchQuery);
      if (selectedSkill !== 'all') params.append('skill', selectedSkill);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);

      const response = await fetch(`http://localhost:3001/api/skill-tests?${params}`);
      if (!response.ok) throw new Error('Failed to fetch skill tests');
      
      const data = await response.json();
      setSkillTests(data.skillTests);
    } catch (error) {
      console.error('Error fetching skill tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSkills = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/skill-tests/skills');
      if (!response.ok) throw new Error('Failed to fetch skills');
      
      const data = await response.json();
      setAvailableSkills(data.skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStartTest = (testId: string) => {
    navigate(`/skill-test/${testId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 bg-gray-800 border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Skill Tests</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Test your knowledge and earn verified skills for your profile. 
            Pass a skill test to automatically add that skill to your profile!
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skill tests..."
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {availableSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Skill Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillTests.map((test) => (
            <Card 
              key={test._id} 
              className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-purple-500 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge className={`${getDifficultyColor(test.difficulty)} text-white`}>
                      {test.difficulty}
                    </Badge>
                    {test.alreadyPassed && (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle size={12} className="mr-1" />
                        Passed
                      </Badge>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {test.duration} min
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {test.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <Target className="text-purple-400" size={16} />
                    <span className="text-purple-300 font-medium">{test.skillName}</span>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-3">
                    {test.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <BookOpen size={14} className="mr-1" />
                      {test.questions.length} questions
                    </div>
                    <div className="flex items-center">
                      <Trophy size={14} className="mr-1" />
                      {test.passingScore}% to pass
                    </div>
                  </div>

                  {/* Tags */}
                  {test.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {test.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                      {test.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                          +{test.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleStartTest(test._id)}
                  className={`w-full ${
                    test.alreadyPassed 
                      ? 'bg-gray-600 hover:bg-gray-700' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  disabled={test.alreadyPassed}
                >
                  {test.alreadyPassed ? (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Already Passed
                    </>
                  ) : (
                    <>
                      <Play size={16} className="mr-2" />
                      Start Test
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {skillTests.length === 0 && !loading && (
          <Card className="p-12 bg-gray-800/50 backdrop-blur-sm border-gray-700 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Skill Tests Found</h3>
            <p className="text-gray-400">
              Try adjusting your search criteria or check back later for new skill tests.
            </p>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50">
          <div className="flex items-start space-x-4">
            <Star className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">How Skill Tests Work</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Choose a skill test that matches your expertise level</li>
                <li>• Complete the test within the time limit</li>
                <li>• Score {skillTests[0]?.passingScore || 70}% or higher to pass</li>
                <li>• Successfully passed skills are automatically added to your profile</li>
                <li>• Showcase your verified skills to potential employers</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};