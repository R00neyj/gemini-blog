import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      
       const channel = supabase
        .channel('public:notifications:bottom')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
             setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    const { count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    setUnreadCount(count || 0);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "홈", icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { path: "/search", label: "검색", icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )},
    ...(user ? [
      { path: "/notifications", label: "알림", icon: (
        <div className="relative">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          )}
        </div>
      )},
      { path: user.user_metadata?.username ? `/blog/${user.user_metadata.username}` : "/my-blog", label: "내 블로그", icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )}
    ] : [
      { path: "/login", label: "로그인", icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      )}
    ])
  ];

  return (
    <nav 
      className={`w-full grid ${user ? 'grid-cols-5' : 'grid-cols-3'} gap-1 items-center`}
    >
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 px-1 py-1.5 rounded-full ${
            isActive(item.path)
              ? "text-accent bg-white/10 shadow-inner"
              : "text-gray-400 active:scale-90"
          }`}
        >
          {item.icon}
          <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
        </Link>
      ))}
      
      {user && (
         <Link to="/settings" className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-full transition-all duration-200 ${isActive('/settings') ? 'bg-white/10' : ''}`}>
            <Avatar 
              src={user.user_metadata?.avatar_url} 
              alt="Profile" 
              size="xs" 
              className={isActive('/settings') ? 'border-accent' : 'border-transparent'} 
            />
            <span className={`text-xs font-medium whitespace-nowrap ${isActive('/settings') ? 'text-accent' : 'text-gray-400'}`}>프로필</span>
         </Link>
      )}
    </nav>
  );
}
