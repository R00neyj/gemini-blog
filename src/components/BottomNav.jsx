import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "홈", icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    ...(user ? [
      { path: "/write", label: "글쓰기", icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
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
    <nav className={`w-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl grid ${user ? 'grid-cols-4' : 'grid-cols-2'} items-center px-2 py-1.5`}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center gap-0.5 transition-all duration-200 px-2 py-1 rounded-full ${
            isActive(item.path)
              ? "text-accent bg-white/10"
              : "text-gray-400 active:text-gray-200"
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
