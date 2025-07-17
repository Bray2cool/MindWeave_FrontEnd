import React from 'react';
import Sidebar from './Sidebar';
import FloatingActionButton from './FloatingActionButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative">
        {children}
        <FloatingActionButton />
      </main>
    </div>
  );
};

export default Layout;