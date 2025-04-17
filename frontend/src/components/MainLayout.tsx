import React from 'react';
import { Outlet } from 'react-router-dom'; // To render nested routes
import Header from './Header'; // Import the header component
import styles from './MainLayout.module.css';

// Define as a standard function component returning JSX.Element
// No need for React.FC as it doesn't take props directly
function MainLayout() {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <main className={styles.contentArea}>
        {/* Child routes will be rendered here */}
        <Outlet /> 
      </main>
      {/* Optional: Add a Footer component here */}
    </div>
  );
}

export default MainLayout; 