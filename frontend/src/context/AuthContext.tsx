import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of the context state
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  // Add user info state if needed later
  // user: UserInfo | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode; // To wrap around parts of the app
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  // Check localStorage for a token when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      // Optionally: Decode token to get user info or expiry
      // Optionally: Make an API call to verify token and get user data
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    // Optionally: Fetch and set user info after login
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    // Optionally: Clear user info state
    // Redirect logic will be handled by routing components
  };

  const isAuthenticated = !!token; // True if token is not null or empty

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext easily in other components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 