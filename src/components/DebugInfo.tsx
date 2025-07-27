import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugInfo: React.FC = () => {
  const { user } = useAuth();
  
  const debugInfo = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not Set',
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
    reflectionApiUrl: import.meta.env.VITE_REFLECTION_API_URL || 'https://mind-be-ruddy.vercel.app (default)',
    userAuthenticated: !!user,
    userId: user?.id || 'Not authenticated'
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key}>
            <span className="font-mono">{key}:</span> {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugInfo; 