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

// Wrapper for protected routes that applies the layout *after* checking auth
const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to landing page if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the layout, and the Outlet will render the matched child route
  return (
    <MainLayout>
      <Outlet /> {/* Child routes will render here */}
    </MainLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<PublicRouteWrapper />} />

          {/* Protected Routes Parent */}
          <Route element={<ProtectedLayout />}>
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
