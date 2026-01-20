import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import qrCodeImg from '../assets/qrcode.png';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

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
    <div className="min-h-screen p-6 pt-24 relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">최신 글</h1>
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

      {/* QR Code Floating Action Button */}
      <button
        onClick={() => setShowQrModal(true)}
        className="fixed bottom-8 right-8 p-4 bg-accent text-white rounded-full shadow-lg hover:bg-blue-600 transition-all z-40 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent/50"
        aria-label="모바일 설치 QR코드 보기"
        title="모바일에서 보기"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" strokeWidth="2" rx="1" />
          <rect x="14" y="3" width="7" height="7" strokeWidth="2" rx="1" />
          <rect x="3" y="14" width="7" height="7" strokeWidth="2" rx="1" />
          <path d="M14 14h7v7h-7z" fill="currentColor" stroke="none" className="opacity-50"/>
        </svg>
      </button>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowQrModal(false)}>
          <div className="bg-surface p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative border border-secondary" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">모바일에서 즐기기</h2>
            <p className="text-gray-400 mb-6">QR코드를 스캔하여 앱을 설치하세요.</p>
            
            <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-inner">
              <img src={qrCodeImg} alt="App QR Code" className="w-48 h-48 object-contain" />
            </div>
            
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-secondary hover:bg-slate-600 text-white rounded-xl font-bold transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
