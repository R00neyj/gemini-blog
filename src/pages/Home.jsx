import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { format } from 'date-fns'; // We might need date-fns, but for now I'll use standard JS date

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">최신 글</h1>
          {/* Write button will be in Navbar, but can be here too for better UX if needed */}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-xl shadow-lg border border-secondary/50">
            <p className="text-gray-400 text-lg">아직 작성된 글이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="block bg-surface rounded-xl shadow-md hover:shadow-xl hover:shadow-accent/10 transition-all p-6 border border-secondary/50 hover:border-accent"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Link to={post.profiles?.username ? `/blog/${post.profiles.username}` : '#'} className="block">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-gray-300 font-bold overflow-hidden border border-accent/30 hover:border-accent transition-colors">
                        {post.profiles?.avatar_url ? (
                          <img src={post.profiles.avatar_url} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                          post.profiles?.username?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                    </Link>
                    <div>
                      <Link 
                        to={post.profiles?.username ? `/blog/${post.profiles.username}` : '#'}
                        className="text-sm font-medium text-white hover:text-accent hover:underline transition-colors"
                      >
                        {post.profiles?.username || 'Unknown User'}
                      </Link>
                      <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                </div>
                
                <Link to={`/post/${post.id}`} className="block group">
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 line-clamp-3 mb-4 group-hover:text-gray-200 transition-colors">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center text-accent text-sm font-medium group-hover:underline">
                    더 읽기 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
