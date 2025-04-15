import React, { useState } from 'react';
import styles from './SignupForm.module.css'; // Import the CSS module

// Define the props for the SignupForm component
interface SignupFormProps {
  onSubmit: (username: string, email: string, password: string) => Promise<void>; // Function to call on form submission
  onCancel: () => void; // Function to call when cancelling/closing the form
  errorMessage?: string | null; // Optional error message to display
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, onCancel, errorMessage }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(username, email, password);
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
        <h3 className={styles.title}>Sign Up</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="signup-username" className={styles.label}>Username</label>
            <input 
              type="text" 
              id="signup-username" 
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              minLength={3}
              maxLength={80}
              className={styles.input} 
              placeholder="Username (3-80 characters)"
            />
          </div>
          <div>
            <label htmlFor="signup-email" className={styles.label}>Email Address</label>
            <input 
              type="email" 
              id="signup-email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className={styles.input} 
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className={styles.label}>Password</label>
            <input 
              type="password" 
              id="signup-password" 
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
              className={styles.input} 
              placeholder="Password (min 6 characters)"
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
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm; 