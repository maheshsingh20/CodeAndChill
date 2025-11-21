import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Database, Users, BookOpen, Code, Trophy, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SeedResult {
  type: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  count?: number;
}

export function AdminDataSeedPage() {
  const [seeding, setSeeding] = useState(false);
  const [results, setResults] = useState<SeedResult[]>([]);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const seedData = async () => {
    setSeeding(true);
    setResults([]);
    setProgress(0);

    const seedOperations = [
      { type: 'Users', endpoint: '/api/admin/seed/users', icon: Users },
    ];

    const token = localStorage.getItem("adminToken");

    for (let i = 0; i < seedOperations.length; i++) {
      const operation = seedOperations[i];
      
      try {
        setResults(prev => [...prev, {
          type: operation.type,
          status: 'pending',
          message: `Seeding ${operation.type.toLowerCase()}...`
        }]);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${operation.endpoint}`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();

        setResults(prev => prev.map(r => 
          r.type === operation.type 
            ? {
                type: operation.type,
                status: response.ok ? 'success' : 'error',
                message: data.message || (response.ok ? 'Seeded successfully' : 'Failed to seed'),
                count: data.count
              }
            : r
        ));

        setProgress(((i + 1) / seedOperations.length) * 100);
      } catch (error) {
        setResults(prev => prev.map(r => 
          r.type === operation.type 
            ? {
                type: operation.type,
                status: 'error',
                message: 'Network error occurred'
              }
            : r
        ));
      }

      // Small delay between operations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setSeeding(false);
  };

  const clearData = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone!')) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/seed/clear`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      alert(data.message || 'Data cleared successfully');
      setResults([]);
      setProgress(0);
    } catch (error) {
      alert('Failed to clear data');
    }
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
            <h1 className="text-2xl font-bold">Data Seeding</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="w-6 h-6 text-purple-400" />
              Database Seeding
            </CardTitle>
            <CardDescription className="text-gray-400">
              Populate your database with sample data for testing and development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button
                onClick={seedData}
                disabled={seeding}
                className="bg-purple-600 hover:bg-purple-700 flex-1"
              >
                <Database className="w-4 h-4 mr-2" />
                {seeding ? 'Seeding Data...' : 'Seed All Data'}
              </Button>
              <Button
                onClick={clearData}
                disabled={seeding}
                variant="destructive"
                className="flex-1"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>

            {seeding && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Seeding Results</h3>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.status === 'success'
                        ? 'bg-green-900/20 border-green-700'
                        : result.status === 'error'
                        ? 'bg-red-900/20 border-red-700'
                        : 'bg-blue-900/20 border-blue-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {result.status === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : result.status === 'error' ? (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        )}
                        <div>
                          <div className="font-semibold text-white">{result.type}</div>
                          <div className="text-sm text-gray-400">{result.message}</div>
                        </div>
                      </div>
                      {result.count !== undefined && (
                        <div className="text-2xl font-bold text-purple-400">
                          {result.count}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">What will be seeded?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                <Users className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <div className="font-semibold text-white">Sample Users</div>
                  <div className="text-sm text-gray-400">Test user accounts with various profiles</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <div className="font-semibold text-white">Courses</div>
                  <div className="text-sm text-gray-400">Programming courses with lessons</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                <Code className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <div className="font-semibold text-white">Coding Problems</div>
                  <div className="text-sm text-gray-400">Practice problems with test cases</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-400 mt-1" />
                <div>
                  <div className="font-semibold text-white">Quizzes</div>
                  <div className="text-sm text-gray-400">Multiple choice quizzes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
