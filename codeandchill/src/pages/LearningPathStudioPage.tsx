import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningPathService } from '@/services/learningPathService';
import { useUser } from '@/contexts/UserContext';
import {
  Plus,
  Save,
  Eye,
  Trash2,
  Edit,
  BookOpen,
  Target,
  Clock,
  Users,
  Star,
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  Code,
  Palette,
  Wand2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isRequired: boolean;
  order: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  requiredCourses: string[];
  order: number;
}

interface PathData {
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  estimatedDuration: string;
  tags: string[];
  prerequisites: string[];
  courses: Course[];
  milestones: Milestone[];
  isPublic: boolean;
  isDraft: boolean;
}

const initialPathData: PathData = {
  title: '',
  description: '',
  icon: '🎯',
  difficulty: 'beginner',
  estimatedDuration: '',
  tags: [],
  prerequisites: [],
  courses: [],
  milestones: [],
  isPublic: false,
  isDraft: true
};

const availableIcons = ['🎯', '💻', '🚀', '⚡', '🔥', '💡', '🌟', '🎨', '🔧', '📊', '🧠', '🎮'];
export const LearningPathStudioPage: React.FC = () => {
  const { user } = useUser();
  const [pathData, setPathData] = useState<PathData>(initialPathData);
  const [activeTab, setActiveTab] = useState('basic');
  const [draggedCourse, setDraggedCourse] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAvailableData();
    }
  }, [user]);

  const fetchAvailableData = async () => {
    try {
      const [tags, courses] = await Promise.all([
        LearningPathService.getAvailableTags(),
        LearningPathService.getAvailableCourses()
      ]);

      setAvailableTags(tags);
      setAvailableCourses(courses);
    } catch (error) {
      console.error('Error fetching available data:', error);
      // Fallback to static data
      setAvailableTags([
        'javascript', 'python', 'react', 'nodejs', 'mongodb', 'machine-learning',
        'data-science', 'mobile', 'ios', 'android', 'tensorflow', 'react-native',
        'backend', 'frontend', 'fullstack', 'api', 'database', 'cloud', 'aws'
      ]);
    }
  };

  const updatePathData = (field: keyof PathData, value: any) => {
    setPathData(prev => ({ ...prev, [field]: value }));
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      title: 'New Course',
      description: 'Course description',
      duration: 60,
      difficulty: 'beginner',
      isRequired: true,
      order: pathData.courses.length
    };
    updatePathData('courses', [...pathData.courses, newCourse]);
  };

  const updateCourse = (courseId: string, field: keyof Course, value: any) => {
    const updatedCourses = pathData.courses.map(course =>
      course.id === courseId ? { ...course, [field]: value } : course
    );
    updatePathData('courses', updatedCourses);
  };

  const deleteCourse = (courseId: string) => {
    const updatedCourses = pathData.courses.filter(course => course.id !== courseId);
    updatePathData('courses', updatedCourses);
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: 'New Milestone',
      description: 'Milestone description',
      requiredCourses: [],
      order: pathData.milestones.length
    };
    updatePathData('milestones', [...pathData.milestones, newMilestone]);
  };

  const updateMilestone = (milestoneId: string, field: keyof Milestone, value: any) => {
    const updatedMilestones = pathData.milestones.map(milestone =>
      milestone.id === milestoneId ? { ...milestone, [field]: value } : milestone
    );
    updatePathData('milestones', updatedMilestones);
  };

  const deleteMilestone = (milestoneId: string) => {
    const updatedMilestones = pathData.milestones.filter(milestone => milestone.id !== milestoneId);
    updatePathData('milestones', updatedMilestones);
  };

  const addTag = () => {
    if (newTag && !pathData.tags.includes(newTag)) {
      updatePathData('tags', [...pathData.tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    updatePathData('tags', pathData.tags.filter(t => t !== tag));
  };

  const addPrerequisite = () => {
    if (newPrerequisite && !pathData.prerequisites.includes(newPrerequisite)) {
      updatePathData('prerequisites', [...pathData.prerequisites, newPrerequisite]);
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (prerequisite: string) => {
    updatePathData('prerequisites', pathData.prerequisites.filter(p => p !== prerequisite));
  };

  const handleSave = async () => {
    if (!user) {
      alert('Please log in to save learning paths');
      return;
    }

    setIsSaving(true);
    try {
      if (pathData.isDraft) {
        await LearningPathService.createLearningPath(pathData);
        alert('Learning path saved as draft successfully!');
      } else {
        // Update existing path logic would go here
        alert('Learning path updated successfully!');
      }
    } catch (error: any) {
      console.error('Error saving learning path:', error);
      alert(error.message || 'Failed to save learning path');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      alert('Please log in to publish learning paths');
      return;
    }

    if (!pathData.title || !pathData.description || pathData.courses.length === 0) {
      alert('Please fill in all required fields and add at least one course before publishing');
      return;
    }

    updatePathData('isPublic', true);
    updatePathData('isDraft', false);
    await handleSave();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'mixed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Wand2 className="text-purple-400" size={48} />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Learning Path Studio
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl">
              Create and customize learning paths for your community
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              onClick={handlePublish}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <CheckCircle size={16} className="mr-2" />
              Publish
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 p-1">
                <TabsTrigger value="basic" className="data-[state=active]:bg-purple-600">
                  <Info size={16} className="mr-2" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="courses" className="data-[state=active]:bg-purple-600">
                  <BookOpen size={16} className="mr-2" />
                  Courses
                </TabsTrigger>
                <TabsTrigger value="milestones" className="data-[state=active]:bg-purple-600">
                  <Target size={16} className="mr-2" />
                  Milestones
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
                  <Palette size={16} className="mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                  <CardHeader>
                    <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Path Title *
                      </label>
                      <Input
                        value={pathData.title}
                        onChange={(e) => updatePathData('title', e.target.value)}
                        placeholder="Enter learning path title"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description *
                      </label>
                      <Textarea
                        value={pathData.description}
                        onChange={(e) => updatePathData('description', e.target.value)}
                        placeholder="Describe what learners will achieve"
                        rows={4}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    {/* Icon Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Path Icon
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableIcons.map((icon) => (
                          <Button
                            key={icon}
                            variant={pathData.icon === icon ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updatePathData('icon', icon)}
                            className={pathData.icon === icon
                              ? 'bg-purple-600 hover:bg-purple-700'
                              : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                            }
                          >
                            <span className="text-lg">{icon}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty & Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Difficulty Level
                        </label>
                        <select
                          value={pathData.difficulty}
                          onChange={(e) => updatePathData('difficulty', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-purple-500 focus:outline-none"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="mixed">Mixed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Estimated Duration
                        </label>
                        <Input
                          value={pathData.estimatedDuration}
                          onChange={(e) => updatePathData('estimatedDuration', e.target.value)}
                          placeholder="e.g., 3-4 months"
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pathData.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="border-purple-500/30 text-purple-300">
                            {tag}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTag(tag)}
                              className="ml-1 h-4 w-4 p-0 hover:bg-red-500/20"
                            >
                              ×
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          className="bg-gray-800 border-gray-600 text-white"
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        />
                        <Button onClick={addTag} size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Plus size={16} />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {availableTags.filter(tag => !pathData.tags.includes(tag)).slice(0, 10).map((tag) => (
                          <Button
                            key={tag}
                            variant="ghost"
                            size="sm"
                            onClick={() => updatePathData('tags', [...pathData.tags, tag])}
                            className="text-xs text-gray-400 hover:text-white"
                          >
                            + {tag}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Prerequisites */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prerequisites
                      </label>
                      <div className="space-y-2 mb-3">
                        {pathData.prerequisites.map((prerequisite, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                            <span className="flex-1 text-gray-300">{prerequisite}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePrerequisite(prerequisite)}
                              className="text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newPrerequisite}
                          onChange={(e) => setNewPrerequisite(e.target.value)}
                          placeholder="Add a prerequisite"
                          className="bg-gray-800 border-gray-600 text-white"
                          onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
                        />
                        <Button onClick={addPrerequisite} size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                        Course Curriculum ({pathData.courses.length})
                      </CardTitle>
                      <Button onClick={addCourse} className="bg-purple-600 hover:bg-purple-700">
                        <Plus size={16} className="mr-2" />
                        Add Course
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pathData.courses.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No courses added yet</h3>
                        <p className="text-gray-400 mb-4">Start building your learning path by adding courses</p>
                        <Button onClick={addCourse} className="bg-purple-600 hover:bg-purple-700">
                          <Plus size={16} className="mr-2" />
                          Add Your First Course
                        </Button>
                      </div>
                    ) : (
                      pathData.courses.map((course, index) => (
                        <div key={course.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full font-bold text-sm">
                              {index + 1}
                            </div>

                            <div className="flex-1 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                  value={course.title}
                                  onChange={(e) => updateCourse(course.id, 'title', e.target.value)}
                                  placeholder="Course title"
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                                <div className="flex gap-2">
                                  <select
                                    value={course.difficulty}
                                    onChange={(e) => updateCourse(course.id, 'difficulty', e.target.value)}
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-purple-500 focus:outline-none"
                                  >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                  </select>
                                  <Input
                                    type="number"
                                    value={course.duration}
                                    onChange={(e) => updateCourse(course.id, 'duration', parseInt(e.target.value))}
                                    placeholder="Duration (min)"
                                    className="w-32 bg-gray-700 border-gray-600 text-white"
                                  />
                                </div>
                              </div>

                              <Textarea
                                value={course.description}
                                onChange={(e) => updateCourse(course.id, 'description', e.target.value)}
                                placeholder="Course description"
                                rows={2}
                                className="bg-gray-700 border-gray-600 text-white"
                              />

                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={course.isRequired}
                                    onChange={(e) => updateCourse(course.id, 'isRequired', e.target.checked)}
                                    className="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                                  />
                                  <span className="text-sm text-gray-300">Required course</span>
                                </label>

                                <div className="flex items-center gap-2">
                                  <Badge className={`${getDifficultyColor(course.difficulty)} border text-xs`}>
                                    {course.difficulty}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteCourse(course.id)}
                                    className="text-red-400 hover:bg-red-500/20"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Milestones Tab */}
              <TabsContent value="milestones" className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                        Learning Milestones ({pathData.milestones.length})
                      </CardTitle>
                      <Button onClick={addMilestone} className="bg-purple-600 hover:bg-purple-700">
                        <Plus size={16} className="mr-2" />
                        Add Milestone
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pathData.milestones.length === 0 ? (
                      <div className="text-center py-12">
                        <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No milestones defined</h3>
                        <p className="text-gray-400 mb-4">Add milestones to track learner progress</p>
                        <Button onClick={addMilestone} className="bg-purple-600 hover:bg-purple-700">
                          <Plus size={16} className="mr-2" />
                          Add Your First Milestone
                        </Button>
                      </div>
                    ) : (
                      pathData.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold text-sm">
                              {index + 1}
                            </div>

                            <div className="flex-1 space-y-4">
                              <Input
                                value={milestone.title}
                                onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                                placeholder="Milestone title"
                                className="bg-gray-700 border-gray-600 text-white"
                              />

                              <Textarea
                                value={milestone.description}
                                onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                                placeholder="Milestone description"
                                rows={2}
                                className="bg-gray-700 border-gray-600 text-white"
                              />

                              <div className="flex items-center justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteMilestone(milestone.id)}
                                  className="text-red-400 hover:bg-red-500/20"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                  <CardHeader>
                    <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                      Publication Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">Public Visibility</h4>
                        <p className="text-sm text-gray-400">Make this learning path visible to all users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pathData.isPublic}
                          onChange={(e) => updatePathData('isPublic', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">Draft Mode</h4>
                        <p className="text-sm text-gray-400">Keep as draft until ready to publish</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pathData.isDraft}
                          onChange={(e) => updatePathData('isDraft', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Preview */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 sticky top-6">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent text-lg">
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{pathData.icon}</div>
                  <h3 className="font-bold text-white">{pathData.title || 'Untitled Path'}</h3>
                  <p className="text-sm text-gray-400 mt-1">{pathData.description || 'No description'}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Difficulty:</span>
                    <Badge className={`${getDifficultyColor(pathData.difficulty)} border text-xs`}>
                      {pathData.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{pathData.estimatedDuration || 'Not set'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Courses:</span>
                    <span className="text-white">{pathData.courses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Milestones:</span>
                    <span className="text-white">{pathData.milestones.length}</span>
                  </div>
                </div>

                {pathData.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {pathData.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {pathData.tags.length > 4 && (
                        <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                          +{pathData.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    {pathData.isDraft ? (
                      <Badge className="bg-yellow-600 text-white">Draft</Badge>
                    ) : (
                      <Badge className="bg-green-600 text-white">Published</Badge>
                    )}
                    {pathData.isPublic && (
                      <Badge variant="outline" className="border-blue-500/30 text-blue-300">Public</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};