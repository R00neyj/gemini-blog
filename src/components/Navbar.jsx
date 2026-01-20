import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

import defaultAvatar from '../assets/Profile.png';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-primary/95 backdrop-blur-sm shadow-lg z-50 border-b border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white">Gemini<span className="text-accent">Blog</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-300 hover:text-accent font-medium transition-colors">
              홈
            </Link>
            {user && user.role === 'authenticated' ? (
              <>
                <Link to="/write" className="text-gray-300 hover:text-accent font-medium transition-colors">
                  글쓰기
                </Link>
                <Link 
                  to={user.user_metadata?.username ? `/blog/${user.user_metadata.username}` : '/my-blog'}
                  className="text-gray-300 hover:text-accent font-medium transition-colors"
                >
                  내 블로그
                </Link>
                <Link to="/settings" className="text-gray-300 hover:text-accent font-medium transition-colors">
                  설정
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-all text-sm font-medium"
                >
                  로그아웃
                </button>
                <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden border border-accent">
                   <img 
                     src={user.user_metadata?.avatar_url || defaultAvatar} 
                     alt="User Avatar" 
                     className="w-full h-full object-cover"
                   />
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg hover:shadow-accent/20"
              >
                로그인 시작하기
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-accent focus:outline-none"
              aria-label="메인 메뉴 열기"
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-primary border-t border-secondary">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-accent hover:bg-surface"
              onClick={() => setIsMenuOpen(false)}
            >
              홈
            </Link>
            {user && user.role === 'authenticated' ? (
              <>
                <Link
                  to="/write"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-accent hover:bg-surface"
                  onClick={() => setIsMenuOpen(false)}
                >
                  글쓰기
                </Link>
                <Link
                  to={user.user_metadata?.username ? `/blog/${user.user_metadata.username}` : '/my-blog'}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-accent hover:bg-surface"
                  onClick={() => setIsMenuOpen(false)}
                >
                  내 블로그
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-accent hover:bg-surface"
                  onClick={() => setIsMenuOpen(false)}
                >
                  설정
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-surface"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-accent hover:bg-surface"
                onClick={() => setIsMenuOpen(false)}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
