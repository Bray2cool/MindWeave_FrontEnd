import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, PenTool } from 'lucide-react';

const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on journal page since that's where the input is
  if (location.pathname === '/journal') {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Tooltip */}
      <div className="absolute bottom-20 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
        Write new entry
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
      
      {/* Main Button */}
      <button
        onClick={() => navigate('/journal')}
        className="group w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full shadow-2xl hover:shadow-purple-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
      >
        {/* Animated background pulse */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        
        {/* Icon container */}
        <div className="relative flex items-center justify-center">
          <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300 absolute" />
          <PenTool className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
      </button>
      
      {/* Pulsing ring animation */}
      <div className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-60 animate-ping"></div>
      <div className="absolute inset-2 rounded-full border border-purple-300 opacity-40 animate-pulse"></div>
    </div>
  );
};

export default FloatingActionButton;