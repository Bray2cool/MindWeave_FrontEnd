import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  getThemeColors: () => any;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themeColors = {
  purple: {
    name: 'Purple',
    lightBg: 'from-purple-50 via-purple-100 to-blue-50',
    darkBg: 'from-purple-900 via-purple-800 to-blue-900',
    primary: 'from-purple-600 to-purple-700',
    primaryHover: 'from-purple-700 to-purple-800',
    accent: 'purple-500',
    light: 'purple-100',
    ring: 'ring-purple-500',
    text: 'text-purple-600',
    bg: 'bg-purple-600',
    toggle: 'bg-purple-600',
    border: 'border-purple-500',
    lightCard: 'bg-purple-50/80',
    lightBorder: 'border-purple-200'
  },
  sage: {
    name: 'Sage Green',
    lightBg: 'from-green-50 via-emerald-50 to-teal-50',
    darkBg: 'from-green-900 via-emerald-900 to-teal-900',
    primary: 'from-green-600 to-emerald-700',
    primaryHover: 'from-green-700 to-emerald-800',
    accent: 'emerald-500',
    light: 'emerald-100',
    ring: 'ring-emerald-500',
    text: 'text-emerald-600',
    bg: 'bg-emerald-600',
    toggle: 'bg-emerald-600',
    border: 'border-emerald-500',
    lightCard: 'bg-emerald-50/80',
    lightBorder: 'border-emerald-200'
  },
  ocean: {
    name: 'Ocean Blue',
    lightBg: 'from-blue-50 via-cyan-50 to-sky-50',
    darkBg: 'from-blue-900 via-cyan-900 to-sky-900',
    primary: 'from-blue-600 to-cyan-700',
    primaryHover: 'from-blue-700 to-cyan-800',
    accent: 'cyan-500',
    light: 'cyan-100',
    ring: 'ring-cyan-500',
    text: 'text-cyan-600',
    bg: 'bg-cyan-600',
    toggle: 'bg-cyan-600',
    border: 'border-cyan-500',
    lightCard: 'bg-cyan-50/80',
    lightBorder: 'border-cyan-200'
  },
  sunset: {
    name: 'Warm Sunset',
    lightBg: 'from-orange-50 via-pink-50 to-rose-50',
    darkBg: 'from-orange-900 via-pink-900 to-rose-900',
    primary: 'from-orange-500 to-pink-600',
    primaryHover: 'from-orange-600 to-pink-700',
    accent: 'rose-500',
    light: 'rose-100',
    ring: 'ring-rose-500',
    text: 'text-rose-600',
    bg: 'bg-rose-600',
    toggle: 'bg-rose-600',
    border: 'border-rose-500',
    lightCard: 'bg-rose-50/80',
    lightBorder: 'border-rose-200'
  },
  lavender: {
    name: 'Lavender',
    lightBg: 'from-violet-50 via-purple-50 to-indigo-50',
    darkBg: 'from-violet-900 via-purple-900 to-indigo-900',
    primary: 'from-violet-600 to-purple-700',
    primaryHover: 'from-violet-700 to-purple-800',
    accent: 'violet-500',
    light: 'violet-100',
    ring: 'ring-violet-500',
    text: 'text-violet-600',
    bg: 'bg-violet-600',
    toggle: 'bg-violet-600',
    border: 'border-violet-500',
    lightCard: 'bg-violet-50/80',
    lightBorder: 'border-violet-200'
  },
  forest: {
    name: 'Forest',
    lightBg: 'from-green-50 via-lime-50 to-emerald-50',
    darkBg: 'from-green-900 via-lime-900 to-emerald-900',
    primary: 'from-green-700 to-lime-700',
    primaryHover: 'from-green-800 to-lime-800',
    accent: 'lime-500',
    light: 'lime-100',
    ring: 'ring-lime-500',
    text: 'text-lime-600',
    bg: 'bg-lime-600',
    toggle: 'bg-lime-600',
    border: 'border-lime-500',
    lightCard: 'bg-lime-50/80',
    lightBorder: 'border-lime-200'
  },
  midnight: {
    name: 'Midnight',
    lightBg: 'from-slate-50 via-gray-50 to-zinc-50',
    darkBg: 'from-slate-900 via-gray-900 to-zinc-900',
    primary: 'from-slate-600 to-gray-700',
    primaryHover: 'from-slate-700 to-gray-800',
    accent: 'slate-500',
    light: 'slate-100',
    ring: 'ring-slate-500',
    text: 'text-slate-600',
    bg: 'bg-slate-600',
    toggle: 'bg-slate-600',
    border: 'border-slate-500',
    lightCard: 'bg-slate-50/80',
    lightBorder: 'border-slate-200'
  }
};
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode for new users
  });

  const [themeColor, setThemeColorState] = useState(() => {
    const saved = localStorage.getItem('themeColor');
    return saved || 'purple'; // Default to purple
  });

  const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
    const saved = localStorage.getItem('privacyMode');
    return saved ? JSON.parse(saved) : false; // Default to privacy mode off
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Check if we're on mobile (screen width < 1024px)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    return !isMobile; // Default to open on desktop, closed on mobile
  });

  // Handle window resize to manage sidebar state
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('privacyMode', JSON.stringify(isPrivacyMode));
  }, [isPrivacyMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
  };

  const togglePrivacyMode = () => {
    setIsPrivacyMode(!isPrivacyMode);
  };

  const getThemeColors = () => {
    return themeColors[themeColor as keyof typeof themeColors] || themeColors.purple;
  };
  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      isSidebarOpen, 
      toggleSidebar, 
      themeColor, 
      setThemeColor, 
      getThemeColors,
      isPrivacyMode,
      togglePrivacyMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};