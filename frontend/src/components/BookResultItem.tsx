import React from 'react';
import { BookSearchResult } from '../services/bookService'; // Import the interface
import styles from './BookResultItem.module.css';

// Define the props for the component
interface BookResultItemProps {
  book: BookSearchResult;
  onAdd: (book: BookSearchResult) => void; // Function to call when adding the book
}

const BookResultItem: React.FC<BookResultItemProps> = ({ book, onAdd }) => {
  const { title, authors, cover_url, first_publish_year, isbn } = book;

  // Placeholder image if cover URL is missing
  const placeholderCover = 'https://via.placeholder.com/64x96.png?text=No+Cover'; // Simple placeholder

  return (
    <div className={styles.container}>
      <img 
        src={cover_url || placeholderCover}
        alt={`Cover for ${title}`}
        className={styles.cover}
        // Handle image loading errors if desired
        onError={(e) => (e.currentTarget.src = placeholderCover)} 
      />
      <div className={styles.details}>
        <h3 className={styles.title}>{title || 'Unknown Title'}</h3>
        <p className={styles.authors}>{authors?.join(', ') || 'Unknown Author(s)'}</p>
        <p className={styles.meta}>
          {first_publish_year && <span>First Published: {first_publish_year}</span>}
          {isbn && <span> | ISBN: {isbn}</span>}
        </p>
      </div>
      <button 
        onClick={() => onAdd(book)}
        className={styles.addButton}
      >
        Add
      </button>
    </div>
  );
};

export default BookResultItem; 