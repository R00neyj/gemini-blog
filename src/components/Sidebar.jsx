import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import defaultAvatar from "../assets/Profile.png";

export default function Sidebar({ isExpanded, setIsExpanded }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

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
    ] : [])
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-primary/95 backdrop-blur-sm border-r border-secondary flex flex-col py-6 z-50 hidden md:flex transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="px-4 mb-10 w-full">
        <Link to="/" className={`flex items-center ${isExpanded ? "gap-3" : "justify-center"} group overflow-hidden`}>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-blue-500/30 transition-all flex-shrink-0">
            G
          </div>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isExpanded ? "w-32 opacity-100" : "w-0 opacity-0"}`}>
            <span className="text-xl font-bold text-white">
              Gemini<span className="text-accent">Blog</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 w-full flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`h-12 rounded-xl transition-all duration-200 group relative flex items-center overflow-hidden ${
              isActive(item.path) 
                ? "bg-accent text-white shadow-lg shadow-accent/30" 
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
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
              <span className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-gray-700">
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
          className={`h-12 w-full rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center overflow-hidden group`}
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
          <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0"}`}>
            사이드바 접기
          </span>
        </button>
      </div>

      {/* User / Logout */}
      <div className={`border-t border-white/10 pt-4 w-full px-3`}>
        {user ? (
          <div className={`flex items-center overflow-hidden h-12 rounded-xl transition-all duration-200 ${isExpanded ? "" : "justify-center"}`}>
             <div className="w-14 flex items-center justify-center flex-shrink-0">
               <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-accent/50 cursor-pointer hover:border-accent transition-colors">
                 <img 
                   src={user.user_metadata?.avatar_url || defaultAvatar} 
                   alt="Profile" 
                   className="w-full h-full object-cover" 
                 />
               </div>
             </div>

            <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out flex flex-col justify-center ${isExpanded ? "opacity-100 w-auto ml-1" : "opacity-0 w-0"}`}>
              <p className="text-sm font-medium text-white truncate">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </p>
              <button 
                onClick={handleSignOut} 
                className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1 mt-0.5 text-left"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <Link 
            to="/login" 
            className={`flex items-center text-gray-400 hover:text-accent transition-colors h-12 rounded-xl hover:bg-white/5 overflow-hidden`} 
            title={!isExpanded ? "로그인" : ""}
          >
            <div className="w-14 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0"}`}>
              로그인
            </span>
          </Link>
        )}
      </div>
    </aside>
  );
}