import React from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import FloatingActionButton from './FloatingActionButton';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { toggleSidebar, isSidebarOpen } = useTheme();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`flex-1 relative transition-all duration-300 ${isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}>
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        {children}
        <FloatingActionButton />
      </main>
    </div>
  );
};

export default Layout;