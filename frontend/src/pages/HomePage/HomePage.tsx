import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook
import BookSearch from '../../components/BookSearch'; // Import BookSearch

const HomePage: React.FC = () => {
  const { logout } = useAuth(); // Get the logout function from context

  const handleLogout = () => {
    logout();
    // No need to redirect here, ProtectedRoute will handle it
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 md:p-10">
      <div className="w-full max-w-5xl bg-background-surface p-6 md:p-8 rounded shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-primary">Welcome to StoryRoom!</h1>
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
          <h2 className="text-2xl font-semibold text-foreground mb-4">My Library</h2>
          <p className="text-foreground-secondary">Your saved books will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 