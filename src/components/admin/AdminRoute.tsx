import React, { useEffect, useState } from 'react';
import { AdminLoginPage } from './AdminLoginPage';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check for existing authentication
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('adminAuthenticated');
      const authTimestamp = sessionStorage.getItem('adminAuthTimestamp');
      
      if (authStatus === 'true' && authTimestamp) {
        // Check if session is still valid (1 hour timeout)
        const timestamp = parseInt(authTimestamp);
        const now = Date.now();
        const hourInMs = 60 * 60 * 1000;
        
        if (now - timestamp < hourInMs) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }
      
      // Check URL parameter for secret key
      const urlParams = new URLSearchParams(window.location.search);
      const secretParam = urlParams.get('secret');
      
      if (secretParam) {
        const validSecret = import.meta.env.VITE_ADMIN_SECRET_KEY || 'BK-ADMIN-SECRET-2024';
        
        if (secretParam === validSecret) {
          sessionStorage.setItem('adminAuthenticated', 'true');
          sessionStorage.setItem('adminAuthTimestamp', Date.now().toString());
          setIsAuthenticated(true);
          // Remove secret from URL for security
          window.history.replaceState({}, '', window.location.pathname);
          setIsLoading(false);
          return;
        }
      }
      
      setIsLoading(false);
      setShowLogin(true);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminAuthTimestamp');
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return <AdminLoginPage onLoginSuccess={handleLoginSuccess} onCancel={() => window.history.back()} />;
  }

  if (isAuthenticated) {
    return (
      <div>
        {children}
        <button
          onClick={handleLogout}
          className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg z-50"
        >
          Logout Admin
        </button>
      </div>
    );
  }

  return null;
};