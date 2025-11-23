import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  MessageCircle,
  User,
  Pin,
  TrendingUp
} from 'lucide-react';

interface DiscussionPanelProps {
  pathId: string;
}

export const DiscussionPanel: React.FC<DiscussionPanelProps> = ({ pathId }) => {
  const [newComment, setNewComment] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'recent'>('all');
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, [pathId, activeFilter]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const { LearningPathService } = await import('@/services/learningPathService');
      const data = await LearningPathService.getDiscussions(pathId, activeFilter);
      setDiscussions(data.discussions || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (newComment.trim()) {
      try {
        setPosting(true);
        const { LearningPathService } = await import('@/services/learningPathService');
        await LearningPathService.postDiscussion(pathId, newComment);
        setNewComment('');
        await fetchDiscussions();
      } catch (error) {
        console.error('Error posting comment:', error);
        alert('Failed to post comment');
      } finally {
        setPosting(false);
      }
    }
  };

  const handleLike = async (discussionId: string) => {
    try {
      const { LearningPathService } = await import('@/services/learningPathService');
      await LearningPathService.likeDiscussion(pathId, discussionId);
      await fetchDiscussions();
    } catch (error) {
      console.error('Error liking discussion:', error);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* New Comment */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare size={20} />
            Join the Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, ask questions, or help others..."
            className="bg-gray-900/50 border-gray-600 text-white min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={!newComment.trim() || posting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send size={16} className="mr-2" />
              {posting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('all')}
          className={activeFilter === 'all' ? 'bg-purple-600' : 'border-gray-600'}
        >
          All
        </Button>
        <Button
          variant={activeFilter === 'popular' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('popular')}
          className={activeFilter === 'popular' ? 'bg-purple-600' : 'border-gray-600'}
        >
          <TrendingUp size={14} className="mr-1" />
          Popular
        </Button>
        <Button
          variant={activeFilter === 'recent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('recent')}
          className={activeFilter === 'recent' ? 'bg-purple-600' : 'border-gray-600'}
        >
          Recent
        </Button>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="py-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading discussions...</p>
            </CardContent>
          </Card>
        ) : discussions.length === 0 ? (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="py-10 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-white font-semibold mb-2">No discussions yet</h3>
              <p className="text-gray-400">Be the first to start a conversation!</p>
            </CardContent>
          </Card>
        ) : (
          discussions.map((discussion) => {
            const author = discussion.userId;
            const avatar = author?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';
            
            return (
              <Card key={discussion._id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-purple-500/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {avatar}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">{author?.name || 'Anonymous'}</span>
                            {discussion.isPinned && (
                              <Pin size={14} className="text-yellow-400" />
                            )}
                          </div>
                          <span className="text-gray-400 text-sm">{getTimeAgo(discussion.createdAt)}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300">{discussion.content}</p>
                      
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(discussion._id)}
                          className="text-gray-400 hover:text-purple-400"
                        >
                          <ThumbsUp size={16} className="mr-1" />
                          {discussion.likes?.length || 0}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-purple-400"
                        >
                          <MessageCircle size={16} className="mr-1" />
                          {discussion.replies?.length || 0} replies
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
