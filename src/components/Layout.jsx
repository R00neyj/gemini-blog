import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import InstallPrompt from './InstallPrompt';

export default function Layout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-primary text-gray-100 font-sans flex">
      {/* Desktop Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      {/* Main Content Area */}
      <main 
        className={`flex-1 w-full min-h-screen pb-24 md:pb-0 transition-all duration-300 ${
          isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Area */}
      <div className="fixed bottom-6 left-8 right-8 max-w-md mx-auto z-50 flex items-center gap-3 md:hidden animate-slide-up">
        <BottomNav />
        <InstallPrompt />
      </div>
    </div>
  );
}
