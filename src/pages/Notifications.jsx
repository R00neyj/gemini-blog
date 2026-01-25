import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import Avatar from '../components/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    console.log("Fetching notifications for user:", user?.id);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:profiles!notifications_actor_id_fkey_profiles (username, avatar_url),
          post:post_id (title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching notifications:', error);
        throw error;
      }
      
      console.log("Fetched notifications:", data);
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const deleteNotification = async (e, notificationId) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    // Optimistic update
    setNotifications(prev => prev.filter(n => n.id !== notificationId));

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      toast.success('알림이 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Revert if needed, but for delete we usually just show error toast
      toast.error('알림 삭제 실패');
      fetchNotifications();
    }
  };

  const getNotificationContent = (notification) => {
    const actorName = notification.actor?.username || '알 수 없는 사용자';
    const postTitle = notification.post?.title || '삭제된 게시글';
    
    switch (notification.type) {
      case 'like':
        return (
          <span>
            <span className="font-bold text-white">{actorName}</span>님이 회원님의 글 
            <span className="font-medium text-accent mx-1">"{postTitle}"</span>을(를) 좋아합니다.
          </span>
        );
      case 'comment':
        return (
          <span>
             <span className="font-bold text-white">{actorName}</span>님이 회원님의 글 
             <span className="font-medium text-accent mx-1">"{postTitle}"</span>에 댓글을 남겼습니다.
          </span>
        );
      default:
        return '새로운 알림이 있습니다.';
    }
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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">알림 센터</h1>
          {notifications.some(n => !n.is_read) && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-accent hover:text-blue-400 font-medium transition-colors"
            >
              모두 읽음으로 표시
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-gray-600">
            <p className="text-gray-400 text-lg">새로운 알림이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                to={`/post/${notification.post_id}`}
                className={`block bg-surface p-5 rounded-xl border transition-all hover:border-accent group relative ${
                  !notification.is_read ? 'border-accent/50 bg-accent/5' : 'border-secondary/50'
                }`}
              >
                <button
                  onClick={(e) => deleteNotification(e, notification.id)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-400 p-1 rounded-full hover:bg-white/5 transition-colors"
                  title="알림 삭제"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-start space-x-4 pr-6">
                  <div className="flex-shrink-0 relative">
                    <Avatar src={notification.actor?.avatar_url} size="md" />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${
                        notification.type === 'like' ? 'bg-red-500' : 'bg-blue-500'
                    } border-2 border-surface`}>
                         {notification.type === 'like' ? (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                         ) : (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
                         )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                      {getNotificationContent(notification)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
