import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import BookSearch from '../../components/BookSearch/BookSearch'; // Import BookSearch
import styles from './HomePage.module.css'; // Import the CSS module

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Only need isAuthenticated here now
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]); 

  if (!isAuthenticated) {
    return null; 
  }

  // Render actual content only if authenticated
  return (
    <div className={styles.pageContainer}> {/* Add container for padding/centering */}
      <BookSearch />
    </div>
  );
};

export default HomePage; 