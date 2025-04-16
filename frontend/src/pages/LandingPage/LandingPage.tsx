import React, { useState } from 'react';
// Updated import paths for components (now up one level)
import LoginForm from '../../components/LoginForm';
import SignupForm from '../../components/SignupForm'; 
// Updated import path for service (now up one level)
import * as authService from '../../services/authService'; 
// Updated import path for CSS module (now in same directory)
import styles from './LandingPage.module.css'; 
// Helper function remains the same (assuming classnames is installed)
import cn from 'classnames';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

type AuthMode = 'login' | 'signup' | null;

const LandingPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>(null); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate(); // Hook for programmatic navigation

  // --- Handlers for Login --- 
  const handleLoginSubmit = async (email: string, password: string) => {
    setErrorMessage(null); 
    try {
      const data = await authService.login({ email, password });
      console.log('Login successful:', data);
      login(data.access_token); // Update context state (which handles localStorage)
      setAuthMode(null); // Close the form
      navigate('/home'); // Redirect to home page
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  // --- Handlers for Signup --- 
  const handleSignupSubmit = async (username: string, email: string, password: string) => {
    setErrorMessage(null); 
    try {
      const data = await authService.register({ username, email, password });
      console.log('Registration successful:', data);
      setAuthMode('login'); 
      // Optionally set a success message here to display on the login form
      setErrorMessage('Registration successful! Please log in.'); 
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleCancel = () => {
    setAuthMode(null);
    setErrorMessage(null); 
  };

  // Note: The redirection if already logged in is handled in App.tsx
  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to StoryRoom</h1>
        <p className={styles.subtitle}>Your personal digital library.</p>
        <div className={styles.buttonGroup}>
          <button 
            onClick={() => setAuthMode('login')} 
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Login
          </button>
          <button 
            onClick={() => setAuthMode('signup')} 
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {authMode === 'login' && (
        <LoginForm 
          onSubmit={handleLoginSubmit} 
          onCancel={handleCancel} 
          errorMessage={errorMessage}
        />
      )}
      {authMode === 'signup' && (
        <SignupForm 
          onSubmit={handleSignupSubmit} 
          onCancel={handleCancel}
          errorMessage={errorMessage} 
        />
      )}
    </div>
  );
};

export default LandingPage; 