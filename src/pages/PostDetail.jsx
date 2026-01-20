import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import PostHeader from '../components/post/PostHeader';
import CommentSection from '../components/post/CommentSection';

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
      toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
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
      toast.success('게시글이 삭제되었습니다.');
      navigate('/');
    } catch (err) {
      toast.error('삭제 중 오류가 발생했습니다: ' + err.message);
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
      toast.success('댓글이 등록되었습니다.');
    } catch (err) {
      toast.error('댓글 등록 실패: ' + err.message);
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
      toast.success('댓글이 삭제되었습니다.');
    } catch (err) {
      toast.error('댓글 삭제 실패: ' + err.message);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>;
  if (error) return <div className="p-12 text-center text-red-400">에러 발생: {error}</div>;
  if (!post) return <div className="p-12 text-center text-gray-400">게시글을 찾을 수 없습니다.</div>;

  const isOwner = user && user.id === post.user_id;

  return (
    <div className="min-h-screen p-4 pt-20 sm:p-6 sm:pt-24">
      <div className="max-w-3xl mx-auto">
        <PostHeader 
          post={post} 
          isOwner={isOwner} 
          onDelete={handleDeletePost} 
        />
        <CommentSection 
          comments={comments}
          user={user}
          newComment={newComment}
          onCommentChange={setNewComment}
          onSubmit={handleCommentSubmit}
          onDelete={handleDeleteComment}
        />
      </div>
    </div>
  );
}
