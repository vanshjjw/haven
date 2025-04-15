import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import * as authService from '../services/authService'; // Import API service functions
import styles from './LandingPage.module.css'; // Import the CSS module
// Helper function to combine multiple CSS module classes (optional but useful)
import cn from 'classnames';

type AuthMode = 'login' | 'signup' | null;

const LandingPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>(null); // State to track which form to show
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- Handlers for Login --- 
  const handleLoginSubmit = async (email: string, password: string) => {
    setErrorMessage(null); // Clear previous errors
    try {
      const data = await authService.login({ email, password });
      console.log('Login successful:', data);
      localStorage.setItem('authToken', data.access_token);
      setAuthMode(null); // Close the form on success
      // TODO: Add proper state update/redirect for logged-in state
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  // --- Handlers for Signup --- 
  const handleSignupSubmit = async (username: string, email: string, password: string) => {
    setErrorMessage(null); // Clear previous errors
    try {
      const data = await authService.register({ username, email, password });
      console.log('Registration successful:', data);
      setAuthMode('login'); // Switch to login form after successful signup
      // Optionally: setErrorMessage('Registration successful! Please log in.');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleCancel = () => {
    setAuthMode(null);
    setErrorMessage(null); // Clear errors when cancelling
  };

  return (
    // Use styles object for class names
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to StoryRoom</h1>
        <p className={styles.subtitle}>Your personal digital library.</p>
        <div className={styles.buttonGroup}>
          <button 
            onClick={() => setAuthMode('login')} 
            // Combine base and modifier classes using classnames helper or template literal
            className={`${styles.btn} ${styles.btnPrimary}`}
            // Alternatively, using classnames library: className={cn(styles.btn, styles.btnPrimary)}
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

      {/* Conditionally render the forms as modals */} 
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