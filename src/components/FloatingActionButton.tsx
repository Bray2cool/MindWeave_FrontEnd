import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on journal page since that's where the input is
  if (location.pathname === '/journal') {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/journal')}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-110 transition-all duration-300 flex items-center justify-center group z-50"
    >
      <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
    </button>
  );
};

export default FloatingActionButton;