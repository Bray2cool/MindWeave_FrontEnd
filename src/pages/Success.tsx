import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../hooks/useSubscription';

const Success: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { refetch } = useSubscription();

  useEffect(() => {
    // Refetch subscription data after successful payment
    const timer = setTimeout(() => {
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetch]);

  const bgClass = isDarkMode 
    ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900' 
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
  
  const cardClass = isDarkMode 
    ? 'bg-white/10 backdrop-blur-sm border-white/10' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${bgClass}`}>
      <div className="max-w-md w-full text-center">
        <div className={`${cardClass} rounded-2xl p-8 border`}>
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className={`text-3xl font-bold ${textClass} mb-4`}>
            Payment Successful!
          </h1>

          <p className={`${textSecondaryClass} mb-6`}>
            Thank you for your purchase. Your subscription has been activated and you now have access to all premium features.
          </p>

          <div className="space-y-3 mb-8">
            <div className={`flex items-center justify-center space-x-2 ${textSecondaryClass}`}>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Unlimited cloud sync enabled</span>
            </div>
            <div className={`flex items-center justify-center space-x-2 ${textSecondaryClass}`}>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Premium features unlocked</span>
            </div>
            <div className={`flex items-center justify-center space-x-2 ${textSecondaryClass}`}>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Priority support activated</span>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Continue to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;