import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status from context

  // If authenticated, render the child route components
  // Otherwise, redirect to the landing page (or login page)
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute; 