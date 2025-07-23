import React from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import FloatingActionButton from './FloatingActionButton';
import Breadcrumbs from './Breadcrumbs';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { toggleSidebar, isSidebarOpen } = useTheme();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`flex-1 relative transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className={`${isSidebarOpen ? 'lg:hidden' : ''} fixed top-4 left-4 z-30 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-colors`}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Desktop close button when sidebar is open */}
        {isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="hidden lg:block fixed top-4 left-72 z-30 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg shadow-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="p-8">
          <Breadcrumbs />
          {children}
        </div>
        <FloatingActionButton />
      </main>
    </div>
  );
};

export default Layout;