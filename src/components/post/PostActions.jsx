import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { createNotification } from '../../lib/notification';

export default function PostActions({ postId, postAuthorId, initialLikeCount = 0 }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkStatus();
    } else {
      setLoading(false);
    }
    fetchLikeCount();
  }, [user, postId]);

  const checkStatus = async () => {
    try {
      const [likeRes, bookmarkRes] = await Promise.all([
        supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).single(),
        supabase.from('post_bookmarks').select('id').eq('post_id', postId).eq('user_id', user.id).single()
      ]);

      setLiked(!!likeRes.data);
      setBookmarked(!!bookmarkRes.data);
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikeCount = async () => {
    const { count } = await supabase
      .from('post_likes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);
    
    setLikeCount(count || 0);
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    // Optimistic UI update
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);

    try {
      if (liked) {
        const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
        
        // Trigger notification
        if (postAuthorId) {
            createNotification({
                userId: postAuthorId,
                actorId: user.id,
                type: 'like',
                postId
            });
        }
      }
    } catch (error) {
      // Revert on error
      setLiked(!liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
      toast.error('오류가 발생했습니다.');
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    // Optimistic UI update
    setBookmarked(!bookmarked);

    try {
      if (bookmarked) {
        const { error } = await supabase.from('post_bookmarks').delete().eq('post_id', postId).eq('user_id', user.id);
        if (error) throw error;
        toast.success('북마크가 해제되었습니다.');
      } else {
        const { error } = await supabase.from('post_bookmarks').insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
        toast.success('북마크에 저장되었습니다.');
      }
    } catch (error) {
      setBookmarked(!bookmarked);
      toast.error('오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button 
        onClick={handleLike}
        className={`flex items-center space-x-1.5 transition-colors group ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
        title="좋아요"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform group-active:scale-125 ${liked ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="text-sm font-medium">{likeCount}</span>
      </button>

      <button 
        onClick={handleBookmark}
        className={`flex items-center space-x-1.5 transition-colors group ${bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`}
        title="북마크"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform group-active:scale-125 ${bookmarked ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </div>
  );
}
