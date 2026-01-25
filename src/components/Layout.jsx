import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import InstallPrompt from './InstallPrompt';
import DesktopQrButton from './DesktopQrButton';
import NotificationPrompt from './NotificationPrompt';

export default function Layout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isEditorPage = location.pathname === '/write' || location.pathname.includes('/edit');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show if scrolling up or at the very top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsNavVisible(true);
      } 
      // Hide if scrolling down and moved past threshold
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-primary text-gray-100 font-sans flex relative overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      {/* Main Content Area */}
      <main 
        className={`flex-1 w-full min-h-screen pb-24 md:pb-0 transition-all duration-300 ${
          isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'
        } ${isEditorPage ? '!pb-0' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Area */}
      {!isEditorPage && (
        <div 
          className={`fixed bottom-6 left-4 right-4 max-w-xl mx-auto z-50 md:hidden transition-all duration-500 ease-in-out bg-[#191919]/60 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-2 py-2 ${
            isNavVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
          }`}
          style={{ WebkitBackdropFilter: 'blur(20px)' }}
        >
          <BottomNav />
        </div>
      )}

      {/* Mobile Install FAB (Positioned above BottomNav, Home Only) */}
      {isHomePage && (
        <div 
          className={`md:hidden fixed right-8 z-40 transition-all duration-500 ease-in-out bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden ${
            isNavVisible ? 'bottom-[118px] opacity-100' : 'bottom-[-100px] opacity-0'
          }`}
          style={{ WebkitBackdropFilter: 'blur(20px)' }}
        >
          <InstallPrompt />
        </div>
      )}

      {/* Desktop QR/Install Button (Bottom Right) */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50 animate-fade-in">
        <DesktopQrButton />
      </div>

      <NotificationPrompt />
    </div>
  );
}
