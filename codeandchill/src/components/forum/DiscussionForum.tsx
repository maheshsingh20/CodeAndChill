import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Search, 
  Filter,
  Plus,
  Pin,
  Lock,
  Eye,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  dislikes: number;
  replies: number;
  isPinned: boolean;
  isLocked: boolean;
  isSolved: boolean;
}

interface Reply {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
  createdAt: Date;
  likes: number;
  dislikes: number;
  isAccepted: boolean;
  parentReplyId?: string;
}

export const DiscussionForum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });
  const [replyContent, setReplyContent] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General Discussion' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'react', label: 'React' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'career', label: 'Career Advice' },
    { value: 'projects', label: 'Project Showcase' },
    { value: 'help', label: 'Help & Support' }
  ];

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPosts: ForumPost[] = [
      {
        id: '1',
        title: 'How to optimize React component re-renders?',
        content: 'I\'m working on a large React application and noticing performance issues with unnecessary re-renders. What are the best practices for optimization?',
        author: {
          id: '1',
          username: 'reactdev123',
          reputation: 1250
        },
        category: 'react',
        tags: ['react', 'performance', 'optimization'],
        createdAt: new Date('2024-02-20T10:30:00'),
        updatedAt: new Date('2024-02-20T10:30:00'),
        views: 156,
        likes: 23,
        dislikes: 2,
        replies: 8,
        isPinned: false,
        isLocked: false,
        isSolved: true
      },
      {
        id: '2',
        title: 'Best algorithms for beginners to learn?',
        content: 'I\'m new to programming and want to focus on learning algorithms. Which ones should I start with?',
        author: {
          id: '2',
          username: 'newbie_coder',
          reputation: 45
        },
        category: 'algorithms',
        tags: ['algorithms', 'beginner', 'learning'],
        createdAt: new Date('2024-02-19T15:45:00'),
        updatedAt: new Date('2024-02-19T15:45:00'),
        views: 89,
        likes: 15,
        dislikes: 0,
        replies: 12,
        isPinned: true,
        isLocked: false,
        isSolved: false
      },
      {
        id: '3',
        title: 'JavaScript async/await vs Promises',
        content: 'Can someone explain the differences between async/await and Promises? When should I use each?',
        author: {
          id: '3',
          username: 'js_learner',
          reputation: 320
        },
        category: 'javascript',
        tags: ['javascript', 'async', 'promises'],
        createdAt: new Date('2024-02-18T09:15:00'),
        updatedAt: new Date('2024-02-18T09:15:00'),
        views: 234,
        likes: 31,
        dislikes: 1,
        replies: 6,
        isPinned: false,
        isLocked: false,
        isSolved: true
      }
    ];
    
    setPosts(mockPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'popular':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      case 'views':
        return b.views - a.views;
      case 'replies':
        return b.replies - a.replies;
      default:
        return 0;
    }
  });

  const createPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: {
        id: 'current_user',
        username: 'current_user',
        reputation: 100
      },
      category: newPost.category,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      dislikes: 0,
      replies: 0,
      isPinned: false,
      isLocked: false,
      isSolved: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', category: 'general', tags: '' });
    setIsCreatingPost(false);
  };

  const addReply = () => {
    if (!replyContent.trim() || !selectedPost) return;

    const reply: Reply = {
      id: Date.now().toString(),
      postId: selectedPost.id,
      content: replyContent,
      author: {
        id: 'current_user',
        username: 'current_user',
        reputation: 100
      },
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      isAccepted: false
    };

    setReplies(prev => [...prev, reply]);
    setReplyContent('');
    
    // Update post reply count
    setPosts(prev => prev.map(post => 
      post.id === selectedPost.id 
        ? { ...post, replies: post.replies + 1 }
        : post
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: 'bg-gray-500',
      javascript: 'bg-yellow-500',
      python: 'bg-blue-500',
      react: 'bg-cyan-500',
      algorithms: 'bg-purple-500',
      career: 'bg-green-500',
      projects: 'bg-orange-500',
      help: 'bg-red-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => setSelectedPost(null)}
          className="mb-4"
        >
          ← Back to Forum
        </Button>

        {/* Post Details */}
        <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {selectedPost.isPinned && <Pin size={16} className="text-yellow-400" />}
                  {selectedPost.isLocked && <Lock size={16} className="text-red-400" />}
                  {selectedPost.isSolved && <Badge className="bg-green-600">Solved</Badge>}
                  <Badge className={`${getCategoryColor(selectedPost.category)} text-white`}>
                    {categories.find(c => c.value === selectedPost.category)?.label}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold text-white">{selectedPost.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{selectedPost.author.username}</span>
                    <span className="text-purple-400">({selectedPost.author.reputation} rep)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{formatTimeAgo(selectedPost.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye size={14} />
                    <span>{selectedPost.views} views</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-green-400">
                  <ThumbsUp size={16} className="mr-1" />
                  {selectedPost.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400">
                  <ThumbsDown size={16} className="mr-1" />
                  {selectedPost.dislikes}
                </Button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedPost.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Replies */}
        <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            Replies ({selectedPost.replies})
          </h2>
          
          <div className="space-y-4 mb-6">
            {replies.filter(reply => reply.postId === selectedPost.id).map(reply => (
              <div key={reply.id} className="border-l-2 border-gray-600 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span className="text-white font-medium">{reply.author.username}</span>
                    <span className="text-purple-400">({reply.author.reputation} rep)</span>
                    <span>•</span>
                    <span>{formatTimeAgo(reply.createdAt)}</span>
                    {reply.isAccepted && <Badge className="bg-green-600">Accepted</Badge>}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="text-green-400 p-1">
                      <ThumbsUp size={12} />
                      <span className="ml-1 text-xs">{reply.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 p-1">
                      <ThumbsDown size={12} />
                      <span className="ml-1 text-xs">{reply.dislikes}</span>
                    </Button>
                  </div>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{reply.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          {/* Add Reply */}
          {!selectedPost.isLocked && (
            <div className="space-y-3">
              <h3 className="font-medium text-white">Add a Reply</h3>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply... (Markdown supported)"
                className="bg-gray-800 border-gray-600 text-white"
                rows={4}
              />
              <Button onClick={addReply} className="bg-purple-600 hover:bg-purple-700">
                <Reply size={16} className="mr-1" />
                Post Reply
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Discussion Forum</h1>
        <Button
          onClick={() => setIsCreatingPost(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus size={16} className="mr-1" />
          New Post
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 bg-gray-900/50 backdrop-blur-sm border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, tags, or content..."
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
              <SelectItem value="replies">Most Replies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Create Post Modal */}
      {isCreatingPost && (
        <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Create New Post</h2>
          <div className="space-y-4">
            <Input
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Post title..."
              className="bg-gray-800 border-gray-600 text-white"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Select 
                value={newPost.category} 
                onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.value !== 'all').map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                value={newPost.tags}
                onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Tags (comma separated)"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            
            <Textarea
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your post content... (Markdown supported)"
              className="bg-gray-800 border-gray-600 text-white"
              rows={6}
            />
            
            <div className="flex space-x-2">
              <Button onClick={createPost} className="bg-purple-600 hover:bg-purple-700">
                Create Post
              </Button>
              <Button 
                onClick={() => setIsCreatingPost(false)} 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {sortedPosts.map(post => (
          <Card 
            key={post.id} 
            className="p-4 bg-gray-900/50 backdrop-blur-sm border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  {post.isPinned && <Pin size={16} className="text-yellow-400" />}
                  {post.isLocked && <Lock size={16} className="text-red-400" />}
                  {post.isSolved && <Badge className="bg-green-600">Solved</Badge>}
                  <Badge className={`${getCategoryColor(post.category)} text-white`}>
                    {categories.find(c => c.value === post.category)?.label}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-white hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-400 text-sm line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>by {post.author.username}</span>
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  <span>{post.views} views</span>
                  <span>{post.replies} replies</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2 ml-4">
                <div className="flex items-center space-x-1 text-sm">
                  <ThumbsUp size={14} className="text-green-400" />
                  <span className="text-white">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <MessageSquare size={14} className="text-blue-400" />
                  <span className="text-white">{post.replies}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {sortedPosts.length === 0 && (
          <Card className="p-8 bg-gray-900/50 backdrop-blur-sm border-gray-700 text-center">
            <p className="text-gray-400">No posts found matching your criteria.</p>
          </Card>
        )}
      </div>
    </div>
  );
};