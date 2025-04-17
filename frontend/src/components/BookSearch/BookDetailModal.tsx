import React, { useState, useEffect } from 'react';
import styles from './BookDetailModal.module.css';

type LibraryStatus = 0 | 1 | 2 | null; // 0: Want to Read, 1: Reading, 2: Read
import { BookSearchResult } from '../../services/bookService'; 
import { addOrUpdateLibraryEntry } from '../../services/libraryService'; 
import { useAuth } from '../../context/AuthContext'; 


interface BookDetailModalProps {
  book: BookSearchResult;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { title, authors, cover_url, first_publish_year, isbn, public_rating } = book;

  // --- State for Library Actions ---
  const [selectedStatus, setSelectedStatus] = useState<LibraryStatus>(null);
  const [userRating, setUserRating] = useState<number | string>(''); 
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { token } = useAuth(); 


  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

 
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

 
  const handleStatusSelect = (status: LibraryStatus) => {
    setSelectedStatus(status);
    if (status !== 2) {
        setUserRating('');
    }
    setSaveError(null); 
    setSaveSuccess(false);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value === '' || /^[1-5](\.\d?)?$/.test(value)) {
         const numValue = parseFloat(value);
         if (value === '' || (!isNaN(numValue) && numValue >= 1 && numValue <= 5)){
             const decimalPart = value.split('.')[1];
             if (!decimalPart || decimalPart.length <= 1) {
                setUserRating(value);
             }
         }
      }
  };

  const handleSave = async () => {
    if (selectedStatus === null || !token) {
      setSaveError('Cannot save. Status not selected or user not logged in.');
      return;
    }

    let finalRating: number | null = null;
    if (selectedStatus === 2 && userRating !== '') {
      const parsedRating = parseFloat(userRating as string);
      // Strict validation: 1-5, step 0.5
      if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5 && (parsedRating * 2) % 1 === 0) {
        finalRating = parsedRating;
      } 
      else {
        setSaveError('Invalid rating. Please enter a number between 1 and 5, in steps of 0.5 (e.g., 3, 4.5).');
        return;
      }
    }
    
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
        const result = await addOrUpdateLibraryEntry(book, selectedStatus, finalRating, token);
        setSaveSuccess(true);
    } 
    catch (error: any) {
        console.error("Save failed:", error);
        setSaveError(error.message || 'Failed to save book to library.');
    } 
    finally {
        setIsSaving(false);
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
          <h3 className={styles.actionsTitle}>My Library Status</h3>
          
          {/* Status Buttons */} 
          <div className={styles.statusButtonGroup}>
              <button 
                  className={`${styles.statusButton} ${selectedStatus === 0 ? styles.selected : ''}`}
                  onClick={() => handleStatusSelect(0)}
                  disabled={isSaving}
              >
                  Want to Read
              </button>
              <button 
                  className={`${styles.statusButton} ${selectedStatus === 1 ? styles.selected : ''}`}
                  onClick={() => handleStatusSelect(1)}
                  disabled={isSaving}
              >
                  Start Reading
              </button>
              <button 
                  className={`${styles.statusButton} ${selectedStatus === 2 ? styles.selected : ''}`}
                  onClick={() => handleStatusSelect(2)}
                  disabled={isSaving}
              >
                  Mark as Read
              </button>
          </div>

          {/* Conditional Rating Input */} 
          {selectedStatus === 2 && (
              <div className={styles.ratingInputContainer}>
                  <label htmlFor="userRating" className={styles.ratingLabel}>Your Rating (1-5, half-steps allowed):</label>
                  <input 
                      type="number" 
                      id="userRating"
                      name="userRating"
                      min="1"
                      max="5"
                      step="0.5" // Explicit step
                      value={userRating}
                      onChange={handleRatingChange}
                      className={styles.ratingInput}
                      placeholder="e.g., 4.5"
                      disabled={isSaving}
                  />
              </div>
          )}
          
          {/* Conditional Save Button */} 
          {selectedStatus !== null && !saveSuccess && (
            <div className={styles.saveButtonContainer}>
              <button 
                className={styles.saveButton} 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save to Library'}
              </button>
            </div>
          )}

          {/* Feedback Messages */} 
          {saveError && <p className={styles.errorMessage}>{saveError}</p>}
          {saveSuccess && <p className={styles.successMessage}>Successfully added to library!</p>}

        </div>
      </div>
    </div>
  );
};

export default BookDetailModal; 