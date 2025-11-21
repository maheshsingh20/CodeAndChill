import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  Trophy,
  Clock,
  Search
} from 'lucide-react';

interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'upcoming' | 'active' | 'completed';
  participants: string[];
  problems: any[];
  isPublic: boolean;
  tags: string[];
}

export const AdminContestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchContests();
  }, [statusFilter]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const url = statusFilter === 'all' 
        ? 'http://localhost:3001/api/admin/contests'
        : `http://localhost:3001/api/admin/contests?status=${statusFilter}`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContests(data.contests);
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contestId: string) => {
    if (!confirm('Are you sure you want to delete this contest?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3001/api/admin/contests/${contestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Contest deleted successfully');
        fetchContests();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete contest');
      }
    } catch (error) {
      console.error('Error deleting contest:', error);
      alert('Failed to delete contest');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Upcoming</Badge>;
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Completed</Badge>;
      default:
        return null;
    }
  };

  const filteredContests = contests.filter(contest =>
    contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contest.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Contest Management</h1>
            <p className="text-gray-400">Create and manage coding contests</p>
          </div>
          <Button
            onClick={() => navigate('/admin/contests/create')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus size={16} className="mr-2" />
            Create Contest
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search contests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-purple-600' : ''}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'upcoming' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('upcoming')}
                  className={statusFilter === 'upcoming' ? 'bg-blue-600' : ''}
                >
                  Upcoming
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('active')}
                  className={statusFilter === 'active' ? 'bg-green-600' : ''}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('completed')}
                  className={statusFilter === 'completed' ? 'bg-gray-600' : ''}
                >
                  Completed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contests List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading contests...</p>
          </div>
        ) : filteredContests.length === 0 ? (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-12 text-center">
              <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No contests found</h3>
              <p className="text-gray-400 mb-6">Create your first contest to get started</p>
              <Button
                onClick={() => navigate('/admin/contests/create')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus size={16} className="mr-2" />
                Create Contest
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredContests.map((contest) => (
              <Card key={contest._id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{contest.title}</h3>
                        {getStatusBadge(contest.status)}
                        {!contest.isPublic && (
                          <Badge variant="outline" className="border-gray-600 text-gray-400">
                            Private
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 mb-4">{contest.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(contest.startTime).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{contest.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>{contest.participants.length} participants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy size={16} />
                          <span>{contest.problems.length} problems</span>
                        </div>
                      </div>

                      {contest.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {contest.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="border-gray-600 text-gray-400">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/contests/edit/${contest._id}`)}
                        className="border-gray-600 hover:border-purple-500"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contest._id)}
                        disabled={contest.status === 'active'}
                        className="border-gray-600 hover:border-red-500 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
