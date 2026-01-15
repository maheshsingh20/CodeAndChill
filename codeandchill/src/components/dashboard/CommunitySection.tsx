import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, ArrowRight, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { communityService, CommunityPost } from "@/services/communityService";

export function CommunitySection() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await communityService.getLatestPosts(3);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching community posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="text-center text-gray-400">Loading posts...</div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-3">
            <Users className="text-purple-400" size={32} />
            From the Community
          </h2>
          <p className="text-gray-400 mt-2">
            Latest discussions and insights from our community
          </p>
        </div>
        <Link to="/forum">
          <div className="px-6 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md hover:border-gray-500 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
              View All Posts
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="group">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="mt-1 border-2 border-gray-600 group-hover:border-purple-500 transition-all duration-300">
                  <AvatarImage src={post.user.profilePicture} alt={`Avatar of ${post.user.name}`} />
                  <AvatarFallback className="bg-gray-800 text-gray-300">{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-lg bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-purple-100 group-hover:to-purple-200 transition-all duration-300 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent mt-1">
                    by {post.user.name}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={14} className="text-purple-400" />
                    <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                      {post.likes}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={14} className="text-purple-400" />
                    <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
