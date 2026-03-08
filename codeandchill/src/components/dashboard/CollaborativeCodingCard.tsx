import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, Users, Plus } from 'lucide-react';

export function CollaborativeCodingCard() {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 p-6 hover:border-purple-500/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Code2 className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Collaborative Coding</h3>
            <p className="text-gray-400 text-sm">Code together in real-time</p>
          </div>
        </div>
        <Users className="h-5 w-5 text-purple-400" />
      </div>

      <p className="text-gray-300 mb-6">
        Create or join coding sessions for pair programming, interviews, or learning together.
      </p>

      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/collaborative')}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Start Session
        </Button>
        <Button
          onClick={() => navigate('/collaborative')}
          variant="outline"
          className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
        >
          Join Session
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-400">∞</div>
            <div className="text-xs text-gray-400">Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">8</div>
            <div className="text-xs text-gray-400">Max Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-400">24h</div>
            <div className="text-xs text-gray-400">Duration</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
