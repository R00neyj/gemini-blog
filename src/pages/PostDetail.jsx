import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import PostHeader from '../components/post/PostHeader';
import CommentSection from '../components/post/CommentSection';
import { createNotification } from '../lib/notification';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostAndComments = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

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

  const handleCommentSubmit = async (e, content = null, parentId = null) => {
    e.preventDefault();
    
    // If content is passed (reply), use it. Otherwise use state (main comment).
    const commentContent = content !== null ? content : newComment;
    
    if (!commentContent.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: id,
            user_id: user.id,
            content: commentContent,
            parent_id: parentId // Add parent_id
          }
        ])
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .single();

      if (error) throw error;

      setComments([...comments, data]);
      if (content === null) {
          setNewComment(''); // Clear main input only if it was main submission
      }
      
      toast.success('댓글이 등록되었습니다.');

      // Create Notification
      // If reply, notify the parent comment author
      // If root comment, notify post author
      
      // Logic for notification target:
      let targetUserId = post?.user_id;
      let notifType = 'comment';

      if (parentId) {
          // Find parent comment to get its author
          const parentComment = comments.find(c => c.id === parentId);
          if (parentComment) {
              targetUserId = parentComment.user_id;
              notifType = 'reply'; // We can use 'comment' type but distinguish message logic if needed, or just 'comment' is fine as per spec
          }
      }

      if (targetUserId && targetUserId !== user.id) {
        createNotification({
            userId: targetUserId,
            actorId: user.id,
            type: notifType === 'reply' ? 'comment' : 'comment', // Keeping 'comment' for now to match existing enum
            postId: id
        });
      }

      // Trigger Push Notification
      fetch('https://itfsgqvydtcdglmnflpy.supabase.co/functions/v1/push-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NODE_ENV === 'development' ? import.meta.env.VITE_SUPABASE_ANON_KEY : ''}`
        },
        body: JSON.stringify({
            record: {
                post_id: id,
                content: commentContent,
                user_id: user.id
            }
        })
      }).catch(err => console.error('Push trigger error:', err));

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
    <div className="animate-fade-in">
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
