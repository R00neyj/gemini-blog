import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

import defaultAvatar from '../assets/Profile.png';

export default function MyBlog() {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [blogOwner, setBlogOwner] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = user && blogOwner && user.id === blogOwner.id;

  useEffect(() => {
    // Handle redirect logic for /my-blog route
    if (!username) {
      if (user?.user_metadata?.username) {
        navigate(`/blog/${user.user_metadata.username}`, { replace: true });
      } else if (!user) {
        navigate('/login');
      }
      return;
    }

    fetchBlogData();
  }, [username, user]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Blog Owner Profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) {
        setError('사용자를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }
      
      setBlogOwner(profile);

      // 2. Fetch Posts
      let query = supabase
        .from('posts')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      // If not owner, show only public posts
      // Note: We check user.id against profile.id. Since user might be null, optional chaining is used.
      if (!user || user.id !== profile.id) {
        query = query.eq('is_public', true);
      }

      const { data: postsData, error: postsError } = await query;

      if (postsError) throw postsError;
      setPosts(postsData || []);

    } catch (err) {
      console.error('Error fetching blog data:', err.message);
      setError('블로그 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (e, postId) => {
    e.preventDefault(); 
    if (!window.confirm('정말로 이 글을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다: ' + err.message);
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

  if (error) {
    return (
      <div className="min-h-screen p-6 pt-24 flex justify-center text-center">
        <div className="max-w-md bg-surface p-8 rounded-xl shadow-lg border border-secondary/50">
           <h2 className="text-xl font-bold text-red-400 mb-4">오류 발생</h2>
           <p className="text-gray-300">{error}</p>
           <Link to="/" className="mt-4 inline-block text-accent hover:underline">홈으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-24 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6 animate-slide-up">
          <div className="flex items-center space-x-4">
             <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-accent">
                <img 
                  src={blogOwner?.avatar_url || defaultAvatar} 
                  alt="profile" 
                  className="w-full h-full object-cover" 
                />
             </div>
             <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white break-all">{blogOwner?.username}님의 블로그</h1>
                <p className="text-gray-400 mt-1 text-sm sm:text-base">
                  {isOwner ? '내가 작성한 모든 글을 관리합니다.' : `${blogOwner?.username}님이 공유한 이야기들입니다.`}
                </p>
             </div>
          </div>
          
          {isOwner && (
            <Link 
              to="/write" 
              className="w-full sm:w-auto px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-secondary transition-colors font-bold shadow-sm hover:shadow-accent/20 text-center"
            >
              새 글 쓰기
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-xl shadow-sm border border-dashed border-gray-600 animate-slide-up-delay">
            <p className="text-gray-400 text-lg mb-4">아직 작성한 글이 없습니다.</p>
            {isOwner && (
               <Link to="/write" className="text-accent hover:underline font-medium">첫 글을 작성해보세요!</Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 animate-slide-up-delay">
            {posts.map((post) => (
              <div
                key={post.id}
                className="block bg-surface rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 border border-secondary/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link to={`/post/${post.id}`} className="hover:underline">
                      <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {isOwner && (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.is_public ? 'bg-green-900/30 text-green-300 border border-green-900/50' : 'bg-gray-700 text-gray-300 border border-gray-600'}`}>
                        {post.is_public ? '공개' : '비공개'}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 line-clamp-2 mb-4">
                  {post.content}
                </p>
                
                <div className="flex flex-wrap items-center justify-end gap-4 pt-4 border-t border-secondary/50">
                  <Link 
                    to={`/post/${post.id}`}
                    className="text-gray-400 hover:text-white text-sm font-medium whitespace-nowrap"
                  >
                    보기
                  </Link>
                  {isOwner && (
                    <>
                      <Link 
                        to={`/post/${post.id}/edit`}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium whitespace-nowrap"
                      >
                        수정
                      </Link>
                      <button
                        onClick={(e) => handleDeletePost(e, post.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium whitespace-nowrap"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}