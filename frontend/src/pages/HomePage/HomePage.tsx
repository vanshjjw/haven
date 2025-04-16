import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

const HomePage: React.FC = () => {
  const { logout } = useAuth(); // Get the logout function from context

  const handleLogout = () => {
    logout();
    // No need to redirect here, ProtectedRoute will handle it
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <div className="w-full max-w-4xl bg-white p-8 rounded shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to StoryRoom!</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-600">
          This is your homepage. You can start adding books to your library here.
        </p>
        {/* TODO: Add book searching and library display components here */}
      </div>
    </div>
  );
};

export default HomePage; 