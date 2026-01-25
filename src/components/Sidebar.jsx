import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Sidebar({ isExpanded, setIsExpanded }) {
  const { user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();

      // Subscribe to real-time notifications
      const channel = supabase
        .channel('public:notifications')
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

  const username = user?.user_metadata?.username;
  const myBlogPath = username ? `/blog/${username}` : "/my-blog";

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    
    // Precise My Blog handling
    if (path === myBlogPath || path === "/my-blog") {
      return location.pathname === "/my-blog" || (username && location.pathname.startsWith(`/blog/${username}`));
    }

    // Default startsWith for other items (like /settings, /notifications)
    return location.pathname.startsWith(path);
  };

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
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
      )},
      { path: "/write", label: "글쓰기", icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )},
      { path: myBlogPath, label: "내 블로그", icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )},
      { path: "/settings", label: "설정", icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
    <aside 
      className={`fixed left-0 top-0 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col py-6 z-50 hidden md:flex transition-all duration-300 ease-in-out shadow-2xl ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className={`mb-10 w-full flex ${isExpanded ? "px-6" : "justify-center"}`}>
        <Link to="/" className={`flex items-center group ${isExpanded ? "gap-3" : "gap-0"}`}>
          <img 
            src="/pwa-192x192.png" 
            alt="Logo" 
            className="w-10 h-10 rounded-xl object-contain shadow-lg shrink-0 transition-transform group-hover:scale-105" 
            loading="lazy"
            decoding="async"
          />
          <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 transition-all duration-300 whitespace-nowrap overflow-hidden ${isExpanded ? "w-auto opacity-100 ml-3 text-xl" : "w-0 opacity-0 ml-0 text-[0px]"}`}>
            Gemini Blog
          </span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 w-full flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`h-12 rounded-xl transition-all duration-300 group relative flex items-center overflow-hidden border ${
              isActive(item.path) 
                ? "bg-accent/10 border-accent/20 text-accent shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                : "border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/5"
            } backdrop-blur-md`}
            title={!isExpanded ? item.label : ""}
          >
            <div className={`w-14 flex items-center justify-center flex-shrink-0 h-full`}>
              {item.icon}
            </div>
            
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0"}`}>
              {item.label}
            </span>
            
            {/* Tooltip (Collapsed Only) */}
            {!isExpanded && (
              <span className="absolute left-16 bg-black/80 backdrop-blur-md text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl border border-white/5">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Toggle Button */}
      <div className="px-3 mb-6 w-full">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`h-12 w-full rounded-xl bg-white/5 backdrop-blur-md text-gray-400 hover:text-white hover:bg-white/10 shadow-lg transition-all duration-300 flex items-center overflow-hidden group border border-white/5`}
        >
          <div className="w-14 flex items-center justify-center flex-shrink-0">
             <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </div>
          <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-in-out ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0"}`}>
            사이드바 접기
          </span>
        </button>
      </div>
    </aside>
  );
}
