import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Plus, Code, Edit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Problem {
  _id?: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic?: string; // Add topic field
  category: string; // Keep category for form compatibility
  testCases: Array<{ input: string; output: string }>;
  starterCode?: string;
  solution?: string;
}

export function AdminProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [formData, setFormData] = useState<Problem>({
    title: "",
    description: "",
    difficulty: "Easy",
    category: "",
    testCases: [{ input: "", output: "" }],
    starterCode: "",
    solution: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/problems`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setProblems(data.problems || []);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const url = editingProblem
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/problems/${editingProblem._id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/problems`;

      // Transform the data to match backend expectations
      const backendData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        topic: formData.category, // Map category to topic
        testCases: formData.testCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.output // Map output to expectedOutput
        })),
        examples: [], // Add empty examples array
        constraints: [] // Add empty constraints array
      };

      console.log('Sending data to backend:', backendData);

      const response = await fetch(url, {
        method: editingProblem ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      });

      const responseData = await response.json();
      console.log('Backend response:', responseData);

      if (response.ok) {
        fetchProblems();
        resetForm();
        alert(editingProblem ? "Problem updated!" : "Problem created!");
      } else {
        alert(`Failed to save problem: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving problem:", error);
      alert("Failed to save problem");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this problem?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/problems/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        fetchProblems();
        alert("Problem deleted!");
      }
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      difficulty: "Easy",
      category: "",
      testCases: [{ input: "", output: "" }],
      starterCode: "",
      solution: ""
    });
    setEditingProblem(null);
    setShowForm(false);
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: "", output: "" }]
    });
  };

  const updateTestCase = (index: number, field: 'input' | 'output', value: string) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData({ ...formData, testCases: newTestCases });
  };

  const removeTestCase = (index: number) => {
    setFormData({
      ...formData,
      testCases: formData.testCases.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold">Manage Problems</h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Problem
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">All Problems</CardTitle>
          </CardHeader>
          <CardContent>
            {problems.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No problems yet. Create your first one!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">Title</TableHead>
                    <TableHead className="text-gray-400">Difficulty</TableHead>
                    <TableHead className="text-gray-400">Topic</TableHead>
                    <TableHead className="text-gray-400">Test Cases</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problems.map((problem) => (
                    <TableRow key={problem._id} className="border-gray-700">
                      <TableCell className="text-white font-medium">{problem.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            problem.difficulty === "Easy"
                              ? "bg-green-600/20 text-green-300"
                              : problem.difficulty === "Medium"
                                ? "bg-yellow-600/20 text-yellow-300"
                                : "bg-red-600/20 text-red-300"
                          }
                        >
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{problem.topic || problem.category}</TableCell>
                      <TableCell className="text-gray-300">{problem.testCases?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingProblem(problem);
                              // Map backend data to form format
                              setFormData({
                                ...problem,
                                category: problem.topic || problem.category || '',
                                testCases: problem.testCases?.map(tc => ({
                                  input: tc.input,
                                  output: (tc as any).expectedOutput || tc.output || ''
                                })) || [{ input: '', output: '' }]
                              });
                              setShowForm(true);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(problem._id!)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={resetForm}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProblem ? "Edit Problem" : "Create New Problem"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Topic/Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., Arrays, Strings, Dynamic Programming"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Starter Code (Optional)</Label>
              <Textarea
                value={formData.starterCode}
                onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                placeholder="function solution() { ... }"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Test Cases</Label>
                <Button type="button" onClick={addTestCase} size="sm" variant="outline" className="border-gray-600">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Test Case
                </Button>
              </div>
              {formData.testCases.map((testCase, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 mb-2 p-3 bg-gray-700/50 rounded">
                  <div>
                    <Label className="text-xs">Input</Label>
                    <Input
                      value={testCase.input}
                      onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white text-sm"
                      placeholder="[1, 2, 3]"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="text-xs">Output</Label>
                      <Input
                        value={testCase.output}
                        onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                        placeholder="6"
                        required
                      />
                    </div>
                    {formData.testCases.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTestCase(index)}
                        className="text-red-400 hover:text-red-300 mt-5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm} className="border-gray-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                {editingProblem ? "Update" : "Create"} Problem
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
