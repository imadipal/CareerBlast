import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useNavigationGuard } from '../../hooks/useNavigationGuard';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Initialize navigation guard to prevent navigation issues
  useNavigationGuard();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
