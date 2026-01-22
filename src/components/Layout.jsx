import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import InstallPrompt from './InstallPrompt';
import DesktopQrButton from './DesktopQrButton';
import NotificationPrompt from './NotificationPrompt';

export default function Layout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-primary text-gray-100 font-sans flex relative overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      {/* Main Content Area */}
      <main 
        className={`flex-1 w-full min-h-screen pb-24 md:pb-0 transition-all duration-300 ${
          isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Area */}
      <div className="fixed bottom-6 left-4 right-4 max-w-xl mx-auto z-50 md:hidden animate-slide-up">
        <BottomNav />
      </div>

      {/* Mobile Install FAB (Positioned above BottomNav, Home Only) */}
      {isHomePage && (
        <div className="md:hidden fixed bottom-[118px] right-8 z-40 animate-fade-in">
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
