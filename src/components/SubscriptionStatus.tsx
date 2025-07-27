import React from 'react';
import { Crown, Loader2 } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useTheme } from '../contexts/ThemeContext';

const SubscriptionStatus: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { subscription, loading, getProductName, isActive, isPending } = useSubscription();

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
        isDarkMode ? 'bg-white/10' : 'bg-gray-100'
      }`}>
        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
        <span className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
          Loading...
        </span>
      </div>
    );
  }

  if (!subscription || !isActive()) {
    return (
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
        isDarkMode ? 'bg-white/10 border-white/20' : 'bg-gray-100 border-gray-300'
      }`}>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
          Free Plan
        </span>
      </div>
    );
  }

  const productName = getProductName();

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
      isDarkMode ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20' : 'bg-gradient-to-r from-purple-100 to-blue-100'
    }`}>
      <Crown className="w-4 h-4 text-purple-500" />
      <span className={`text-sm font-medium ${
        isDarkMode ? 'text-purple-300' : 'text-purple-700'
      }`}>
        {productName || 'Premium'}
      </span>
      {isPending() && (
        <span className={`text-xs ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
          (Pending)
        </span>
      )}
    </div>
  );
};

export default SubscriptionStatus;