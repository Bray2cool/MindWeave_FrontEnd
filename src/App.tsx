import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Pricing from './pages/Pricing';
import Success from './pages/Success';
import Settings from './pages/Settings';
import Journal from './pages/Journal';
import SEOHead from './components/SEOHead';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <SEOHead />
        <Auth />
      </Router>
    );
  }

  return (
    <Router>
      <SEOHead />
      <Routes>
        <Route path="/journal" element={<Journal />} />
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
            <Layout>
              <Dashboard />
            </Layout>
          </div>
        } />
        <Route path="/dashboard" element={
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
            <Layout>
              <Dashboard />
            </Layout>
          </div>
        } />
        <Route path="/calendar" element={
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
            <Layout>
              <Calendar />
            </Layout>
          </div>
        } />
        <Route path="/pricing" element={
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
            <Layout>
              <Pricing />
            </Layout>
          </div>
        } />
        <Route path="/success" element={
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
            <Layout>
              <Success />
            </Layout>
          </div>
        } />
        <Route path="/settings" element={
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
            <Layout>
              <Settings />
            </Layout>
          </div>
        } />
      </Routes>
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