import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage/LandingPage';
import HomePage from './pages/HomePage/HomePage';
import MyLibraryPage from './pages/MyLibraryPage';
import ProfilePage from './pages/ProfilePage';
import MainLayout from './components/MainLayout';
import './App.css';

// Wrapper for public routes (like LandingPage)
const PublicRouteWrapper: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // Redirect to home if already logged in
  return isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<PublicRouteWrapper />} />

          {/* Routes requiring authentication and the main layout */}
          {/* The auth check is now inside HomePage, MyLibraryPage, ProfilePage */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/library" element={<MyLibraryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Add other protected routes here */}
          </Route>

          {/* Optional: Catch-all route for 404 Not Found could go here */}
          {/* <Route path="*" element={<NotFoundPage />} /> */} 

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
