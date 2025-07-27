import React from 'react';
import { Calendar, PenTool, BarChart3, Settings, Crown } from 'lucide-react';
import InternalLink from './InternalLink';
import { useTheme } from '../contexts/ThemeContext';

interface ContextualLinksProps {
  context: 'dashboard' | 'journal' | 'calendar' | 'empty-state' | 'premium-feature';
  className?: string;
}

const ContextualLinks: React.FC<ContextualLinksProps> = ({ context, className = '' }) => {
  const { isDarkMode } = useTheme();

  const cardClass = isDarkMode 
    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
    : 'bg-gray-50 border-gray-200 hover:bg-gray-100';

  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  const renderLinks = () => {
    switch (context) {
      case 'dashboard':
        return (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
            <InternalLink
              to="/journal"
              className={`${cardClass} border rounded-lg p-4 transition-all duration-300 group`}
              aria-label="Start writing a new journal entry"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`${textClass} font-medium`}>Write New Entry</h3>
                  <p className={`${textSecondaryClass} text-sm`}>Capture your thoughts</p>
                </div>
              </div>
            </InternalLink>

            <InternalLink
              to="/calendar"
              className={`${cardClass} border rounded-lg p-4 transition-all duration-300 group`}
              aria-label="View your journal entries in calendar format"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`${textClass} font-medium`}>View Calendar</h3>
                  <p className={`${textSecondaryClass} text-sm`}>Track your journey</p>
                </div>
              </div>
            </InternalLink>

            <InternalLink
              to="/pricing"
              className={`${cardClass} border rounded-lg p-4 transition-all duration-300 group`}
              aria-label="Upgrade to premium features for enhanced journaling"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`${textClass} font-medium`}>Upgrade Premium</h3>
                  <p className={`${textSecondaryClass} text-sm`}>Unlock all features</p>
                </div>
              </div>
            </InternalLink>
          </div>
        );

      case 'journal':
        return (
          <div className={`flex flex-wrap gap-3 ${className}`}>
            <InternalLink
              to="/calendar"
              variant="subtle"
              className="flex items-center space-x-2"
              aria-label="View past journal entries in calendar"
            >
              <Calendar className="w-4 h-4" />
              <span>View Past Entries</span>
            </InternalLink>
            <InternalLink
              to="/dashboard"
              variant="subtle"
              className="flex items-center space-x-2"
              aria-label="Return to dashboard overview"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </InternalLink>
          </div>
        );

      case 'calendar':
        return (
          <div className={`flex flex-wrap gap-3 ${className}`}>
            <InternalLink
              to="/journal"
              variant="button"
              className="flex items-center space-x-2"
              aria-label="Create a new journal entry"
            >
              <PenTool className="w-4 h-4" />
              <span>Write New Entry</span>
            </InternalLink>
            <InternalLink
              to="/dashboard"
              variant="subtle"
              className="flex items-center space-x-2"
              aria-label="View dashboard statistics"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Stats</span>
            </InternalLink>
          </div>
        );

      case 'empty-state':
        return (
          <div className={`text-center space-y-4 ${className}`}>
            <InternalLink
              to="/journal"
              variant="cta"
              aria-label="Start your journaling journey by writing your first entry"
            >
              Start Your First Entry
            </InternalLink>
            <div className="flex justify-center space-x-4">
              <InternalLink
                to="/calendar"
                variant="subtle"
                aria-label="Explore the calendar view"
              >
                Explore Calendar
              </InternalLink>
              <InternalLink
                to="/settings"
                variant="subtle"
                aria-label="Customize your journaling experience"
              >
                Customize Settings
              </InternalLink>
            </div>
          </div>
        );

      case 'premium-feature':
        return (
          <div className={`${className}`}>
            <InternalLink
              to="/pricing"
              variant="cta"
              aria-label="Upgrade to premium to unlock advanced journaling features"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </InternalLink>
          </div>
        );

      default:
        return null;
    }
  };

  return renderLinks();
};

export default ContextualLinks;