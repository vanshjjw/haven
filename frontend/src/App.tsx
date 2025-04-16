import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage/LandingPage'; 
import HomePage from './pages/HomePage/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; 

// Component to handle conditional rendering of LandingPage or redirect
const PublicRouteWrapper: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // If user is already authenticated, redirect from landing page to home
  return isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />;
};

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app in AuthProvider */}
      <Router>
        <div className="App">
          <Routes>
            {/* Public route for landing/login page */}
            <Route path="/" element={<PublicRouteWrapper />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              {/* Add other protected routes here */}
              {/* e.g., <Route path="/library" element={<LibraryPage />} /> */}
            </Route>

            {/* Optional: Catch-all route for 404 Not Found */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
