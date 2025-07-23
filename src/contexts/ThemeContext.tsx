import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
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
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, isSidebarOpen, toggleSidebar }}>
      {children}
    </ThemeContext.Provider>
  );
};