import React, { useState } from 'react';
import styles from './LoginForm.module.css'; // Import the CSS module

// Define the props for the LoginForm component
interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>; // Function to call on form submission
  onCancel: () => void; // Function to call when cancelling/closing the form
  errorMessage?: string | null; // Optional error message to display
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onCancel, errorMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(email, password);
      // If onSubmit succeeds, the parent component will handle navigation/state change
    } catch (error) { 
      // Error is handled by the parent component via the errorMessage prop
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <button 
          onClick={onCancel} 
          className={styles.closeButton}
        >
          &times;
        </button>
        <h3 className={styles.title}>Login</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="login-email" className={styles.label}>Email Address</label>
            <input 
              type="email" 
              id="login-email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className={styles.input} 
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="login-password" className={styles.label}>Password</label>
            <input 
              type="password" 
              id="login-password" 
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className={styles.input} 
              placeholder="Password"
            />
          </div>
          
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          <div>
            <button 
              type="submit" 
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm; 