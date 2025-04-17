import React from 'react';
import { BookSearchResult } from '../../services/bookService'; // Assuming location
import styles from './BookDetailModal.module.css';

interface BookDetailModalProps {
  book: BookSearchResult;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { title, authors, cover_url, first_publish_year, isbn, public_rating } = book;
  const placeholderCover = 'https://via.placeholder.com/128x192.png?text=No+Cover'; // Larger placeholder

  // Prevent background scroll when modal is open (optional but good UX)
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle clicking the backdrop to close
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">&times;</button>
        
        <div className={styles.bookDetailsContainer}>
          {/* Image Container */}
          <div className={styles.modalCoverContainer}>
            <img
              src={cover_url || ''} // Don't set src to placeholder initially
              alt={`Cover for ${title}`}
              className={styles.modalCover}
              // On error, hide image and show the next sibling (placeholder div)
              onError={(e) => { 
                e.currentTarget.style.display = 'none'; 
                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                if (placeholder) {
                   placeholder.style.display = 'block';
                }
              }}
            />
             {/* Placeholder Div - Hidden by default */}
            <div className={styles.modalCoverPlaceholder}></div>
          </div>

          <div className={styles.modalTextDetails}>
            <h2 className={styles.modalTitle}>{title || 'Unknown Title'}</h2>
            <p className={styles.modalAuthors}>{authors?.join(', ') || 'Unknown Author(s)'}</p>
            {first_publish_year && <p className={styles.modalMeta}>First Published: {first_publish_year}</p>}
            {isbn && <p className={styles.modalMeta}>ISBN: {isbn}</p>}
            {/* Display Public Rating */} 
            {public_rating !== null && typeof public_rating !== 'undefined' && (
              <p className={styles.modalMeta}>Avg. Rating: {public_rating} / 5</p> 
            )}
            {/* Placeholder for user rating later */}
            {/* <p className={styles.modalMeta}>Your Rating: N/A</p> */}
          </div>
        </div>

        <div className={styles.actionsContainer}>
          <h3 className={styles.actionsTitle}>My Library</h3>
          {/* Placeholder for actions based on LibraryEntry */}
          <button className={styles.actionButton} /* onClick={handleAdd} */>
            Add to Library (Want to Read)
          </button>
          {/* More actions (Set Reading, Set Read, Remove) will go here later */}
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal; 