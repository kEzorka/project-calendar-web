import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../api/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // без Layout
  return <>{children}</>;
};

export default ProtectedRoute;
