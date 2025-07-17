import React from 'react';
import { BarChart3, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useJournalEntries } from '../hooks/useJournalEntries';

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { 
    entries, 
    loading, 
    getTotalEntries, 
    getEntriesThisWeek, 
    getCurrentStreak, 
    getAverageMood 
  } = useJournalEntries();

  const stats = [
    { 
      icon: BookOpen, 
      label: 'Total Entries', 
      value: loading ? '...' : getTotalEntries().toString(), 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      icon: TrendingUp, 
      label: 'This Week', 
      value: loading ? '...' : getEntriesThisWeek().toString(), 
      color: 'from-green-500 to-green-600' 
    },
    { 
      icon: Calendar, 
      label: 'Streak', 
      value: loading ? '...' : `${getCurrentStreak()} days`, 
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      icon: BarChart3, 
      label: 'Avg Mood', 
      value: loading ? '...' : `${getAverageMood()}/10`, 
      color: 'from-yellow-500 to-yellow-600' 
    },
  ];

  const bgClass = isDarkMode 
    ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900' 
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
  
  const cardClass = isDarkMode 
    ? 'bg-white/10 backdrop-blur-sm border-white/10' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  const getRecentEntries = () => {
    return entries.slice(0, 3);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      default: return '😐';
    }
  };

  return (
    <div className={`p-8 min-h-screen ${bgClass}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className={`${textSecondaryClass} text-lg`}>Welcome back! Here's your journaling overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${cardClass} rounded-2xl p-6 hover:${isDarkMode ? 'bg-white/15' : 'bg-white/90'} transition-all duration-300 border`}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${textClass} mb-1`}>{stat.value}</h3>
                <p className={textSecondaryClass}>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Entries */}
        <div className={`${cardClass} rounded-2xl p-6 border`}>
          <h2 className={`text-2xl font-bold ${textClass} mb-6`}>Recent Entries</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-lg p-4 animate-pulse`}>
                  <div className={`h-4 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} rounded mb-2`}></div>
                  <div className={`h-3 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} rounded w-3/4`}></div>
                </div>
              ))}
            </div>
          ) : getRecentEntries().length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className={`w-12 h-12 ${textSecondaryClass} mx-auto mb-4`} />
              <p className={`${textSecondaryClass} text-lg`}>No entries yet</p>
              <p className={`${textSecondaryClass} text-sm mt-2`}>Start journaling to see your recent entries here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getRecentEntries().map((entry) => (
                <div key={entry.id} className={`${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg p-4 transition-colors cursor-pointer`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                        <h3 className={`${textClass} font-medium`}>
                          {new Date(entry.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </h3>
                      </div>
                      <p className={`${textSecondaryClass} text-sm line-clamp-2`}>
                        {entry.content.length > 100 
                          ? `${entry.content.substring(0, 100)}...` 
                          : entry.content
                        }
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`${isDarkMode ? 'text-white/50' : 'text-gray-400'} text-xs`}>
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;