import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      // Fetch Post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (postError) throw postError;
      setPost(postData);

      // Fetch Comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('정말로 이 글을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate('/');
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다: ' + err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: id,
            user_id: user.id,
            content: newComment
          }
        ])
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .single();

      if (error) throw error;

      setComments([...comments, data]);
      setNewComment('');
    } catch (err) {
      alert('댓글 등록 실패: ' + err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert('댓글 삭제 실패: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>;
  if (error) return <div className="p-12 text-center text-red-400">에러 발생: {error}</div>;
  if (!post) return <div className="p-12 text-center text-gray-400">게시글을 찾을 수 없습니다.</div>;

  const isOwner = user && user.id === post.user_id;

  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-3xl mx-auto">
        {/* Post Content */}
        <article className="bg-surface rounded-xl shadow-lg p-8 mb-8 border border-secondary/50">
          <header className="mb-6 border-b border-secondary pb-6">
            <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center justify-between">
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
                    className="font-medium text-white hover:text-accent hover:underline transition-colors"
                  >
                    {post.profiles?.username || 'Unknown'}
                  </Link>
                  <p className="text-sm text-gray-400">{formatDate(post.created_at)}</p>
                </div>
              </div>
              
              {isOwner && (
                <div className="flex space-x-2">
                  <Link 
                    to={`/post/${id}/edit`} 
                    className="px-3 py-1 text-sm border border-secondary rounded hover:bg-secondary text-gray-300"
                  >
                    수정
                  </Link>
                  <button 
                    onClick={handleDeletePost}
                    className="px-3 py-1 text-sm border border-red-900/50 rounded hover:bg-red-900/20 text-red-400"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </header>
          
          <div className="prose max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-surface rounded-xl shadow-lg p-8 border border-secondary/50">
          <h3 className="text-xl font-bold text-white mb-6">댓글 {comments.length}개</h3>
          
          {/* Comment List */}
          <div className="space-y-6 mb-8">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4 p-4 bg-primary/50 rounded-lg border border-secondary/30">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-gray-300 font-bold text-xs overflow-hidden border border-accent/20">
                    {comment.profiles?.avatar_url ? (
                      <img src={comment.profiles.avatar_url} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      comment.profiles?.username?.[0]?.toUpperCase() || 'U'
                    )}
                 </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-white">{comment.profiles?.username || 'Unknown'}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.content}</p>
                  
                  {user && user.id === comment.user_id && (
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 font-medium"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">첫 번째 댓글을 남겨보세요!</p>
            )}
          </div>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <div className="flex flex-col space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="w-full px-4 py-3 border border-secondary bg-primary text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none min-h-[100px] placeholder-gray-500"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                  >
                    댓글 등록
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-primary/50 p-4 rounded-lg text-center border border-secondary/30">
              <p className="text-gray-400 text-sm">
                댓글을 작성하려면 <Link to="/login" className="text-accent font-medium hover:text-blue-400 hover:underline">로그인</Link>이 필요합니다.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
