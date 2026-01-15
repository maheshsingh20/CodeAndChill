import React, { useState, useEffect } from 'react';
import {
  Play,
  Clock,
  Trophy,
  Search,
  CheckCircle,
  Star,
  BookOpen,
  Target,
  ArrowRight
} from 'lucide-react';
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
      setSkillTests(data.skillTests || []);
    } catch (error) {
      console.error('Error fetching skill tests:', error);
      // Fallback data
      setSkillTests([
        {
          _id: '1',
          skillName: 'JavaScript',
          title: 'JavaScript Fundamentals',
          description: 'Test your knowledge of JavaScript basics, ES6+ features, and modern development practices.',
          difficulty: 'Beginner',
          duration: 30,
          passingScore: 70,
          questions: Array(20).fill({}),
          tags: ['ES6', 'Functions', 'Objects'],
          alreadyPassed: false
        },
        {
          _id: '2',
          skillName: 'React',
          title: 'React Development',
          description: 'Assess your React skills including components, hooks, state management, and best practices.',
          difficulty: 'Intermediate',
          duration: 45,
          passingScore: 75,
          questions: Array(25).fill({}),
          tags: ['Components', 'Hooks', 'State'],
          alreadyPassed: false
        },
        {
          _id: '3',
          skillName: 'Node.js',
          title: 'Node.js Backend Development',
          description: 'Evaluate your Node.js expertise in building scalable backend applications and APIs.',
          difficulty: 'Advanced',
          duration: 60,
          passingScore: 80,
          questions: Array(30).fill({}),
          tags: ['Express', 'APIs', 'Database'],
          alreadyPassed: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSkills = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/skill-tests/skills');
      if (!response.ok) throw new Error('Failed to fetch skills');

      const data = await response.json();
      setAvailableSkills(data.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'Java']);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setAvailableSkills(['JavaScript', 'React', 'Node.js', 'Python', 'Java']);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleStartTest = (testId: string) => {
    navigate(`/skill-test/${testId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Target className="text-orange-400" size={48} />
            Skill Tests
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Test your knowledge and earn verified skills for your profile. Pass a skill test to automatically add that skill to your profile!
          </p>
        </header>

        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skill tests..."
                  className="w-full h-12 pl-12 pr-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="px-4 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none transition-all duration-300"
            >
              <option value="all">All Skills</option>
              {availableSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none transition-all duration-300"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main>
          {skillTests.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                  No Skill Tests Found
                </h2>
                <p className="text-gray-400">
                  Try adjusting your search criteria or check back later for new skill tests.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {skillTests.map((test) => (
                <div key={test._id} className="group h-full">
                  <div className="h-full min-h-[380px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-md text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                            {test.difficulty}
                          </div>
                          {test.alreadyPassed && (
                            <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-md text-xs font-medium">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span className="text-green-400">Passed</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock size={14} />
                          <span>{test.duration} min</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow space-y-4">
                        {/* Title */}
                        <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-orange-100 group-hover:to-orange-200 transition-all duration-300 leading-tight">
                          {test.title}
                        </h3>

                        {/* Skill Name */}
                        <div className="flex items-center gap-2">
                          <Target size={14} className="text-orange-400" />
                          <span className="text-orange-300 font-medium text-sm">{test.skillName}</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed">
                          {test.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-400">
                            <BookOpen size={14} />
                            <span>{test.questions.length} questions</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Trophy size={14} />
                            <span>{test.passingScore}% to pass</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {test.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {test.tags.slice(0, 3).map((tag, index) => (
                              <div key={index} className="px-2 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded text-xs">
                                <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                                  {tag}
                                </span>
                              </div>
                            ))}
                            {test.tags.length > 3 && (
                              <div className="px-2 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded text-xs">
                                <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                                  +{test.tags.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-6 pt-4 border-t border-gray-700">
                        <button
                          onClick={() => handleStartTest(test._id)}
                          disabled={test.alreadyPassed}
                          className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2 ${test.alreadyPassed
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                            }`}
                        >
                          {test.alreadyPassed ? (
                            <>
                              <CheckCircle size={16} />
                              Already Passed
                            </>
                          ) : (
                            <>
                              <Play size={16} />
                              Start Test
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Card */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-8">
            <div className="flex items-start gap-4">
              <Star className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
                  How Skill Tests Work
                </h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>Choose a skill test that matches your expertise level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>Complete the test within the time limit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>Score 70% or higher to pass and earn the skill</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>Successfully passed skills are automatically added to your profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>Showcase your verified skills to potential employers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};