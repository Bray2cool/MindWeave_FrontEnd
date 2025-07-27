import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Reflections from './pages/Reflections';
import Pricing from './pages/Pricing';
import Success from './pages/Success';
import Settings from './pages/Settings';
import Journal from './pages/Journal';
import SEOHead from './components/SEOHead';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { isDarkMode, getThemeColors } = useTheme();
  const colors = getThemeColors();

  if (loading) {
    const bgClass = `bg-gradient-to-br ${isDarkMode ? colors.darkBg : colors.lightBg}`;
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <SEOHead />
      <div className="min-h-screen">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reflections" element={<Reflections />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/success" element={<Success />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/journal" element={<Journal />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;