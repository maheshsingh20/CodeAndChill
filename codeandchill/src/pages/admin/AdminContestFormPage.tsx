import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, X, Code } from 'lucide-react';

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
}

interface ContestProblem {
  problemId: string;
  points: number;
  order: number;
}

interface NewProblem {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }>;
  constraints: string;
  timeLimit: number;
  memoryLimit: number;
}

export const AdminContestFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const isEdit = !!contestId;

  const [loading, setLoading] = useState(false);
  const [availableProblems, setAvailableProblems] = useState<Problem[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 120,
    rules: 'Standard contest rules apply',
    maxParticipants: 1000,
    isPublic: true,
    tags: [] as string[],
    problems: [] as ContestProblem[],
    prizes: [] as { position: number; description: string; points?: number }[]
  });

  const [newTag, setNewTag] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('');
  const [problemPoints, setProblemPoints] = useState(500);
  const [showCreateProblem, setShowCreateProblem] = useState(false);
  const [newProblem, setNewProblem] = useState<NewProblem>({
    title: '',
    description: '',
    difficulty: 'medium',
    points: 500,
    testCases: [{ input: '', expectedOutput: '', isHidden: false }],
    constraints: '',
    timeLimit: 1000,
    memoryLimit: 256
  });

  useEffect(() => {
    fetchAvailableProblems();
    if (isEdit) {
      fetchContestData();
    }
  }, [contestId]);

  const fetchAvailableProblems = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/admin/contests/available-problems', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableProblems(data.problems);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const fetchContestData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3001/api/admin/contests/${contestId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const contest = data.contest;
        
        setFormData({
          title: contest.title,
          description: contest.description,
          startTime: new Date(contest.startTime).toISOString().slice(0, 16),
          endTime: new Date(contest.endTime).toISOString().slice(0, 16),
          duration: contest.duration,
          rules: contest.rules,
          maxParticipants: contest.maxParticipants,
          isPublic: contest.isPublic,
          tags: contest.tags,
          problems: contest.problems.map((p: any) => ({
            problemId: p.problemId._id,
            points: p.points,
            order: p.order
          })),
          prizes: contest.prizes
        });
      }
    } catch (error) {
      console.error('Error fetching contest:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = isEdit
        ? `http://localhost:3001/api/admin/contests/${contestId}`
        : 'http://localhost:3001/api/admin/contests';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(`Contest ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/admin/contests');
      } else {
        const data = await response.json();
        alert(data.message || `Failed to ${isEdit ? 'update' : 'create'} contest`);
      }
    } catch (error) {
      console.error('Error saving contest:', error);
      alert('Failed to save contest');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addProblem = () => {
    if (selectedProblem && !formData.problems.find(p => p.problemId === selectedProblem)) {
      setFormData({
        ...formData,
        problems: [
          ...formData.problems,
          {
            problemId: selectedProblem,
            points: problemPoints,
            order: formData.problems.length + 1
          }
        ]
      });
      setSelectedProblem('');
      setProblemPoints(500);
    }
  };

  const removeProblem = (problemId: string) => {
    setFormData({
      ...formData,
      problems: formData.problems.filter(p => p.problemId !== problemId)
    });
  };

  const addTestCase = () => {
    setNewProblem({
      ...newProblem,
      testCases: [...newProblem.testCases, { input: '', expectedOutput: '', isHidden: false }]
    });
  };

  const removeTestCase = (index: number) => {
    setNewProblem({
      ...newProblem,
      testCases: newProblem.testCases.filter((_, i) => i !== index)
    });
  };

  const updateTestCase = (index: number, field: string, value: any) => {
    const updated = [...newProblem.testCases];
    updated[index] = { ...updated[index], [field]: value };
    setNewProblem({ ...newProblem, testCases: updated });
  };

  const createAndAddProblem = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/admin/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProblem,
          tags: formData.tags,
          isPublic: false // Contest-specific problem
        })
      });

      if (response.ok) {
        const data = await response.json();
        const problemId = data.problem._id;
        
        // Add to contest problems
        setFormData({
          ...formData,
          problems: [
            ...formData.problems,
            {
              problemId,
              points: newProblem.points,
              order: formData.problems.length + 1
            }
          ]
        });

        // Reset form
        setNewProblem({
          title: '',
          description: '',
          difficulty: 'medium',
          points: 500,
          testCases: [{ input: '', expectedOutput: '', isHidden: false }],
          constraints: '',
          timeLimit: 1000,
          memoryLimit: 256
        });
        setShowCreateProblem(false);
        
        // Refresh available problems
        fetchAvailableProblems();
        alert('Problem created and added to contest!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create problem');
      }
    } catch (error) {
      console.error('Error creating problem:', error);
      alert('Failed to create problem');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/contests')}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Contests
        </Button>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              {isEdit ? 'Edit Contest' : 'Create New Contest'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Contest Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-gray-900/50 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="bg-gray-900/50 border-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime" className="text-white">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endTime" className="text-white">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      required
                      min={30}
                      max={300}
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxParticipants" className="text-white">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rules" className="text-white">Rules</Label>
                  <Textarea
                    id="rules"
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    rows={3}
                    className="bg-gray-900/50 border-gray-700 text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isPublic" className="text-white">Public Contest</Label>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-white mb-2 block">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="bg-gray-900/50 border-gray-700 text-white"
                  />
                  <Button type="button" onClick={addTag} className="bg-purple-600">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="bg-gray-700 text-white px-3 py-1 rounded-full flex items-center gap-2">
                      {tag}
                      <X size={14} className="cursor-pointer" onClick={() => removeTag(tag)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Problems */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white">Problems</Label>
                  <Button
                    type="button"
                    onClick={() => setShowCreateProblem(!showCreateProblem)}
                    className="bg-green-600 hover:bg-green-700 text-sm"
                  >
                    <Code size={14} className="mr-1" />
                    {showCreateProblem ? 'Cancel' : 'Create New Problem'}
                  </Button>
                </div>

                {showCreateProblem && (
                  <Card className="bg-gray-900/50 border-gray-700 mb-4 p-4">
                    <div className="space-y-4">
                      <Input
                        placeholder="Problem Title"
                        value={newProblem.title}
                        onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Textarea
                        placeholder="Problem Description"
                        value={newProblem.description}
                        onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                        rows={4}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={newProblem.difficulty}
                          onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value as any })}
                          className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                        <Input
                          type="number"
                          placeholder="Points"
                          value={newProblem.points}
                          onChange={(e) => setNewProblem({ ...newProblem, points: parseInt(e.target.value) })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Input
                          type="number"
                          placeholder="Time Limit (ms)"
                          value={newProblem.timeLimit}
                          onChange={(e) => setNewProblem({ ...newProblem, timeLimit: parseInt(e.target.value) })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <Textarea
                        placeholder="Constraints"
                        value={newProblem.constraints}
                        onChange={(e) => setNewProblem({ ...newProblem, constraints: e.target.value })}
                        rows={2}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-white text-sm">Test Cases</Label>
                          <Button type="button" onClick={addTestCase} size="sm" className="bg-blue-600">
                            <Plus size={12} className="mr-1" />
                            Add Test Case
                          </Button>
                        </div>
                        {newProblem.testCases.map((tc, index) => (
                          <div key={index} className="bg-gray-800/50 p-3 rounded mb-2 space-y-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white text-sm">Test Case {index + 1}</span>
                              <Button
                                type="button"
                                onClick={() => removeTestCase(index)}
                                size="sm"
                                variant="ghost"
                                className="text-red-400"
                              >
                                <X size={14} />
                              </Button>
                            </div>
                            <Input
                              placeholder="Input"
                              value={tc.input}
                              onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white text-sm"
                            />
                            <Input
                              placeholder="Expected Output"
                              value={tc.expectedOutput}
                              onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white text-sm"
                            />
                            <label className="flex items-center gap-2 text-white text-sm">
                              <input
                                type="checkbox"
                                checked={tc.isHidden}
                                onChange={(e) => updateTestCase(index, 'isHidden', e.target.checked)}
                                className="w-4 h-4"
                              />
                              Hidden Test Case
                            </label>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        onClick={createAndAddProblem}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Create & Add Problem
                      </Button>
                    </div>
                  </Card>
                )}

                <div className="flex gap-2 mb-4">
                  <select
                    value={selectedProblem}
                    onChange={(e) => setSelectedProblem(e.target.value)}
                    className="flex-1 bg-gray-900/50 border border-gray-700 text-white rounded-md px-3 py-2"
                  >
                    <option value="">Select existing problem...</option>
                    {availableProblems.map((problem) => (
                      <option key={problem._id} value={problem._id}>
                        {problem.title} ({problem.difficulty})
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    value={problemPoints}
                    onChange={(e) => setProblemPoints(parseInt(e.target.value))}
                    placeholder="Points"
                    className="w-32 bg-gray-900/50 border-gray-700 text-white"
                  />
                  <Button type="button" onClick={addProblem} className="bg-purple-600">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.problems.map((problem) => {
                    const problemData = availableProblems.find(p => p._id === problem.problemId);
                    return (
                      <div key={problem.problemId} className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-white">
                          {problemData?.title || 'Unknown'} - {problem.points} points
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProblem(problem.problemId)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Contest' : 'Create Contest'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/contests')}
                  className="border-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
