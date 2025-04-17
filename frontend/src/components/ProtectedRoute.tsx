import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import MainLayout from './MainLayout'; // Import MainLayout here

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status from context

  if (!isAuthenticated) {
    // If not authenticated, redirect to the landing page
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the MainLayout which contains the Outlet
  // The Outlet will then render the specific matched child route (e.g., HomePage)
  return (
    <MainLayout>
      <Outlet /> 
    </MainLayout>
  );
};

export default ProtectedRoute; 