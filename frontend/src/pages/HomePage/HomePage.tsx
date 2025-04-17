import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import BookSearch from '../../components/BookSearch'; // Import BookSearch

const HomePage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth(); // Get isAuthenticated state
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]); // Dependency array

  const handleLogout = () => {
    logout();
    // Navigate will happen automatically due to isAuthenticated changing
  };

  // Return null or a loading indicator while checking auth state 
  // to prevent flash of content for unauthenticated users.
  if (!isAuthenticated) {
    return null; 
  }

  // Render actual content only if authenticated
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">Find Books</h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 border border-error text-error rounded hover:bg-error hover:text-white transition-colors duration-200 whitespace-nowrap"
        >
          Logout
        </button>
      </div>

      <BookSearch />
      
      <hr className="my-8 border-border-muted" />

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">My Library Preview</h2>
        {/* TODO: Add library preview component here */}
        <p className="text-foreground-secondary">A preview of your saved books could appear here.</p>
      </div>
    </>
  );
};

export default HomePage; 