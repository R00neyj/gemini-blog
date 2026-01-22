import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Avatar from '../components/Avatar';
import PostActions from '../components/post/PostActions';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      setSearchInput(query);
      fetchSearchResults(query);
    } else {
      setPosts([]);
    }
  }, [query]);

  const fetchSearchResults = async (searchTerm) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .eq('is_public', true)
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error searching posts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">검색</h1>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="관심있는 내용을 검색해보세요..."
              className="w-full bg-surface border border-secondary rounded-xl px-5 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-lg"
              autoFocus
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              검색
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            {query && (
              <p className="text-gray-400 mb-6">
                '<span className="text-white font-bold">{query}</span>' 검색 결과: <span className="text-accent">{posts.length}</span>건
              </p>
            )}

            {posts.length === 0 ? (
              query && (
                <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-gray-600">
                  <p className="text-gray-400 text-lg">검색 결과가 없습니다.</p>
                  <p className="text-gray-500 mt-2">다른 키워드로 검색해보세요.</p>
                </div>
              )
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
          </>
        )}
      </div>
    </div>
  );
}
