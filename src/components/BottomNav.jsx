import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import defaultAvatar from "../assets/Profile.png";

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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-primary/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl z-50 flex items-center justify-around px-2 py-3 md:hidden animate-slide-up">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`p-3 rounded-full transition-all duration-300 relative ${
            isActive(item.path)
              ? "text-white bg-accent shadow-lg shadow-accent/30 -translate-y-2 scale-110"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {item.icon}
          {isActive(item.path) && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-accent whitespace-nowrap opacity-0 animate-fade-in">
              {item.label}
            </span>
          )}
        </Link>
      ))}
      
      {user && (
         <Link to="/settings" className="p-1">
            <div className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-colors ${isActive('/settings') ? 'border-accent' : 'border-transparent'}`}>
                <img src={user.user_metadata?.avatar_url || defaultAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
         </Link>
      )}
    </nav>
  );
}
