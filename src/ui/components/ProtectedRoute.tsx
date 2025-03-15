import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Mock authentication service - in a real app, this would be a proper auth hook
const useAuth = () => {
  // Check if user is logged in by looking for a token in localStorage
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  return { isAuthenticated };
};

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to='/' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
