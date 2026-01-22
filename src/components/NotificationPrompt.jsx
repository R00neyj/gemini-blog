import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToPushNotifications } from '../utils/pushNotification';
import { toast } from 'react-hot-toast';

export default function NotificationPrompt() {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Check if user is logged in
    // 2. Check if browser supports notifications
    // 3. Check if permission is still 'default' (not granted or denied yet)
    if (user && 'Notification' in window && Notification.permission === 'default') {
      // Show prompt after a short delay for better UX
      const timer = setTimeout(() => {
        const hasDismissed = localStorage.getItem('notification_prompt_dismissed');
        if (!hasDismissed) {
          setShowPrompt(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleAllow = async () => {
    // Close immediately for better feedback
    setShowPrompt(false);
    localStorage.setItem('notification_prompt_dismissed', 'true');

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await subscribeToPushNotifications(user.id);
        toast.success('알림이 활성화되었습니다!');
      }
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Optionally store dismissal to not show again for a while
    localStorage.setItem('notification_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none">
      <div className="w-full max-w-sm bg-surface border border-white/10 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] p-6 pointer-events-auto animate-slide-up">
        <div className="flex flex-col items-center text-center">
          {/* Bell Icon with Animation */}
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 relative">
            <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-lg animate-pulse"></div>
            <svg className="w-8 h-8 text-accent animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">실시간 소통을 시작해보세요</h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            내 글에 댓글이 달리거나 좋아요가 눌리면<br />
            즉시 알림으로 알려드릴까요?
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-2xl transition-all"
            >
              나중에
            </button>
            <button
              onClick={handleAllow}
              className="flex-1 py-3.5 bg-accent hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-accent/20"
            >
              알림 켜기
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
