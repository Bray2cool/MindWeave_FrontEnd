import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Settings, LogOut, Menu, User, CreditCard, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SubscriptionStatus from './SubscriptionStatus';

const Sidebar: React.FC = () => {
  const { isDarkMode, isSidebarOpen, toggleSidebar, getThemeColors } = useTheme();
  const colors = getThemeColors();
  const location = useLocation();
  const { signOut, user, getUserDisplayName } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/reflections', icon: Sparkles, label: 'Reflections', italic: true },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/pricing', icon: CreditCard, label: 'Pricing' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sidebarClass = `bg-gradient-to-b ${isDarkMode ? colors.darkBg.replace('to-br', 'to-b') : colors.primary}`;

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed w-64 ${sidebarClass} min-h-screen flex flex-col shadow-2xl transition-transform duration-300 ease-in-out z-50`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-purple-700/50' : 'border-purple-600/50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${colors.primary} rounded-full flex items-center justify-center shadow-lg overflow-hidden`}>
              <img 
                src="/MindWeave.png" 
                alt="MindWeave Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
              MindWeave
            </h1>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-white/70 w-5 h-5 cursor-pointer hover:text-white transition-colors lg:hidden"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={`font-medium ${item.italic ? 'italic font-bold' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Sign Out */}
        <div className="mt-8">
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* User Profile */}
      <div className={`p-6 border-t ${isDarkMode ? 'border-purple-700/50' : 'border-purple-600/50'}`}>
        <div className="mb-3">
          <SubscriptionStatus />
        </div>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${colors.primary} rounded-full flex items-center justify-center`}>
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">{getUserDisplayName()}</p>
            <p className="text-white/50 text-sm">Active now</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;