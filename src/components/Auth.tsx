import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const Auth: React.FC = () => {
  const { isDarkMode, getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Validate username for sign up
    if (isSignUp && (!username.trim() || username.trim().length < 2)) {
      setError('Username must be at least 2 characters long');
      setLoading(false);
      return;
    }

    if (isSignUp && username.trim().length > 30) {
      setError('Username must be less than 30 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = isSignUp 
        ? await signUp(email, password, username.trim())
        : await signIn(email, password);
  
      if (error) {
        setError(error.message);
      } else if (isSignUp) {
        // More robust redirect
        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.set('signup', 'success');
          window.location.href = url.toString();
        }, 100);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const bgClass = `bg-gradient-to-br ${isDarkMode ? colors.darkBg : colors.lightBg}`;
  
  const cardClass = isDarkMode 
    ? 'bg-white/10 backdrop-blur-sm border-white/10'
    : `${colors.lightCard} backdrop-blur-sm ${colors.lightBorder}`;
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-8`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${colors.primary} rounded-full flex items-center justify-center shadow-2xl p-4`}>
            <img 
              src="/MindWeave.png" 
              alt="MindWeave Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
            MindWeave
          </h1>
          <p className={textSecondaryClass}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <div className={`${cardClass} rounded-2xl p-8 border`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label className={`block ${textSecondaryClass} text-sm font-medium mb-2`}>
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-white/50' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'} border rounded-lg focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent`}
                    placeholder="Choose a username"
                    required
                    minLength={2}
                    maxLength={30}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block ${textSecondaryClass} text-sm font-medium mb-2`}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-white/50' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'} border rounded-lg focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent`}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block ${textSecondaryClass} text-sm font-medium mb-2`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-white/50' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'} border rounded-lg focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-white/50 hover:text-white/70' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${colors.primary} hover:${colors.primaryHover} text-white font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className={`${textSecondaryClass} hover:${textClass} transition-colors`}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;