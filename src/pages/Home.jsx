import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Avatar from '../components/Avatar';
import PostActions from '../components/post/PostActions';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchPosts();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time sync

    return () => clearInterval(timer);
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
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 animate-slide-up">
          <div className="text-sm font-medium text-accent mb-2 tracking-wide uppercase">
            {format(currentTime, 'yyyy년 M월 d일 HH:mm', { locale: ko })}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">오늘의 이야기</h1>
          <p className="text-gray-400">Geminist들이 공유하는 최신 글들을 만나보세요.</p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-gray-600">
            <p className="text-gray-400">아직 게시글이 없습니다. 첫 글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col bg-surface rounded-xl shadow-md hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1 p-5 sm:p-6 border border-secondary/50 hover:border-accent h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Link to={post.profiles?.username ? `/blog/${post.profiles.username}` : '#'} className="block">
                      <Avatar 
                        src={post.profiles?.avatar_url} 
                        alt="profile" 
                        size="md" 
                        className="hover:border-accent transition-colors" 
                      />
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
                
                <Link to={`/post/${post.id}`} className="block group flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 line-clamp-3 mb-4 group-hover:text-gray-200 transition-colors flex-1">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <PostActions postId={post.id} postAuthorId={post.user_id} />
                    
                    <div className="flex items-center text-accent text-sm font-medium group-hover:underline">
                      더 읽기 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
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
