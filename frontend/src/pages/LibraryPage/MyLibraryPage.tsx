import React from 'react';
import styles from './MyLibraryPage.module.css';

const MyLibraryPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>My Library</h1>
      <p className={styles.placeholderText}>Your collection of saved books will appear here.</p>
      {/* TODO: Implement library grid/list view */}
    </div>
  );
};

export default MyLibraryPage; 