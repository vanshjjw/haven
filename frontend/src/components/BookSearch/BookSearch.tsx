import React, { useState, useEffect, useRef } from 'react';
import * as bookService from '../../services/SearchService';
import { BookSearchResult } from '../../services/SearchService';
import styles from './BookSearch.module.css';
import BookDetailModal from './BookDetailModal';

const DEBOUNCE_DELAY = 300; // Reduced from 500ms
const MIN_QUERY_LENGTH = 3;

const BookSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<bookService.BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to store the AbortController for the current fetch request
  const abortControllerRef = useRef<AbortController | null>(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<bookService.BookSearchResult | null>(null);

  const [isGridSearchActive, setIsGridSearchActive] = useState(false);
  const [gridResults, setGridResults] = useState<bookService.BookSearchResult[]>([]);
  const [isGridLoading, setIsGridLoading] = useState(false);
  const [gridError, setGridError] = useState<string | null>(null);
  const gridAbortControllerRef = useRef<AbortController | null>(null);

  const [gridQuery, setGridQuery] = useState<string>(''); 

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      setResults([]); // Clear previous results immediately

      try {
        const data = await bookService.searchBooks(debouncedQuery, 10, controller.signal);
        // Check if the signal was aborted *after* the request finished 
        // This can happen in rare race conditions
        if (!controller.signal.aborted) {
          setResults(data);
        }
      } catch (err) {
        // Ignore abort errors, otherwise set the error message
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message || 'An unexpected error occurred during search.');
        }
      } finally {
        // Only set loading to false if this specific request is concluding
        if (!controller.signal.aborted) {
            setIsLoading(false);
        }
      }
    };

    fetchBooks();

    // Cleanup function to abort the request if the component unmounts or debouncedQuery changes again
    return () => {
      controller.abort();
    };
  }, [debouncedQuery]); // Re-run effect only when debouncedQuery changes

  // --- START: Define BookResultItem component *inside* BookSearch ---
  interface BookResultItemProps {
    book: BookSearchResult;
    // Add prop for triggering modal
    onViewDetailsClick: (book: BookSearchResult) => void; 
  }

  const BookResultItem: React.FC<BookResultItemProps> = ({ book, onViewDetailsClick }) => {
    // Destructure all needed fields, including new ones
    const { title, authors, cover_url, first_publish_year, isbn, publisher, description } = book;
    const placeholderCover = 'https://via.placeholder.com/64x96.png?text=No+Cover';

    // Helper to format publisher array
    const displayPublisher = publisher && publisher.length > 0 ? publisher[0] : null; // Just show first publisher for brevity

    // Layout change: Use resultItemContainer (as flex row), then img, then details div
    return (
      <div className={styles.resultItemContainer}> 
        {/* Image Container - Needed for positioning placeholder */}
        <div className={styles.resultItemCoverContainer}>
          <img
            src={cover_url || ''} // Don't set src to placeholder initially
            alt={`Cover for ${title}`}
            className={styles.resultItemCover} 
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
          <div className={styles.resultItemCoverPlaceholder}></div>
        </div>

        <div className={styles.resultItemDetails}> {/* Container for all text + button */}
          <div> {/* Inner div to allow button to be pushed down */} 
            <h3 className={styles.resultItemTitle}>{title || 'Unknown Title'}</h3>
            <p className={styles.resultItemAuthors}>{authors?.join(', ') || 'Unknown Author(s)'}</p>
            <p className={styles.resultItemMeta}>
              {first_publish_year && <span>Published: {first_publish_year}</span>}
              {displayPublisher && <span> &middot; {displayPublisher}</span>} {/* Use middle dot */} 
            </p>
            {/* Use a new class for description for potential truncation */}
            {description && 
              <p className={styles.resultItemDescription}>{description}</p>
            }
          </div>
          {/* Button at the bottom of the details section */}
          <button 
            className={styles.viewDetailsButton} 
            onClick={() => onViewDetailsClick(book)}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };
  // --- END: BookResultItem definition ---

  // --- START: Modal Handlers ---
  const handleOpenModal = (book: bookService.BookSearchResult) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null); // Clear selected book on close
  };
  // --- END: Modal Handlers ---

  // --- NEW: Function to fetch results specifically for the Grid display ---
  const fetchGridResults = async (searchQuery: string) => {
    // Abort previous grid request if it's still running
    if (gridAbortControllerRef.current) {
      gridAbortControllerRef.current.abort();
    }
    // Create a new AbortController for the grid request
    const controller = new AbortController();
    gridAbortControllerRef.current = controller;

    setIsGridLoading(true);
    setGridError(null);
    setGridResults([]); // Clear previous grid results
    setGridQuery(searchQuery); // Store the query used for this grid search

    try {
      // Fetch more results for the grid, e.g., limit=20 (adjust as needed)
      const data = await bookService.searchBooks(searchQuery, 20, controller.signal);
      if (!controller.signal.aborted) {
        setGridResults(data);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setGridError(err.message || 'An unexpected error occurred fetching grid results.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsGridLoading(false);
      }
    }
  };

  // Cleanup function for grid fetch (if component unmounts during fetch)
  useEffect(() => {
    return () => {
      gridAbortControllerRef.current?.abort();
    };
  }, []);
  // --- END: Grid Fetch Logic ---

  // --- Modified useEffect for Debounced Dropdown Search ---
  useEffect(() => {
    // Abort previous dropdown request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Only run dropdown search if grid is NOT active and query is long enough
    if (!isGridSearchActive && debouncedQuery.length >= MIN_QUERY_LENGTH) {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const fetchDropdownBooks = async () => {
        setIsLoading(true);
        setError(null);
        setResults([]);

        try {
          // Use original limit for dropdown (e.g., 10)
          const data = await bookService.searchBooks(debouncedQuery, 10, controller.signal);
          if (!controller.signal.aborted) {
            setResults(data);
          }
        } catch (err) {
          if (err instanceof Error && err.name !== 'AbortError') {
            setError(err.message || 'An unexpected error occurred during search.');
          }
        } finally {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        }
      };

      fetchDropdownBooks();

      return () => {
        controller.abort();
      };
    } else {
      // Clear dropdown results if grid is active or query is too short
      setResults([]);
      setError(null);
      setIsLoading(false);
    }
  }, [debouncedQuery, isGridSearchActive]); // Add isGridSearchActive dependency
  // --- END: Modified Dropdown Search Effect ---

  // --- Modified Input Handlers ---
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    // If user starts typing, deactivate grid search mode
    if (isGridSearchActive) {
      setIsGridSearchActive(false);
      setGridResults([]); // Optional: Clear grid results immediately
      setGridError(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      if (query.length >= MIN_QUERY_LENGTH) {
        // Initiate Grid Search
        setDebouncedQuery(''); // Clear debounce to prevent dropdown fetch race condition
        setResults([]); // Clear dropdown results
        setError(null); // Clear dropdown error
        setIsGridSearchActive(true); // Activate grid mode
        fetchGridResults(query); // Fetch results for the grid
      } else {
        // Clear everything if Enter pressed on short query
        setResults([]);
        setError(null);
        setDebouncedQuery('');
        setGridResults([]);
        setGridError(null);
        setIsGridSearchActive(false);
      }
    }
  };
  // --- END: Modified Input Handlers ---

  return (
    <div className={styles.searchContainer}>
      <input
        type="search" // Use type="search" for potential browser optimizations/styling
        placeholder="Search for books by title or author..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={styles.searchInput}
      />

      {/* Conditionally Render Dropdown Results */}
      {!isGridSearchActive && debouncedQuery.length >= MIN_QUERY_LENGTH && (
        <div className={styles.resultsContainer}>
          {isLoading && <p className={styles.loadingMessage}>Loading...</p>}
          {error && <p className={styles.errorMessage}>Error: {error}</p>}
          {!isLoading && !error && results.length === 0 && (
            <p className={styles.noResultsMessage}>No books found for "{debouncedQuery}".</p>
          )}
          {!isLoading && !error && results.length > 0 && (
            <>
              {results.map((book) => (
                <BookResultItem 
                  key={book.external_id || book.isbn || book.title} 
                  book={book} 
                  onViewDetailsClick={handleOpenModal} 
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Conditionally Render Grid Results Container Below Input */}
      {isGridSearchActive && (
        <div className={styles.gridResultsContainer}> {/* New CSS class for grid */}
          {isGridLoading && <p className={styles.loadingMessage}>Loading grid...</p>}
          {gridError && <p className={styles.errorMessage}>Error: {gridError}</p>}
          {!isGridLoading && !gridError && gridResults.length === 0 && (
            <p className={styles.noResultsMessage}>No books found for "{gridQuery}" in grid.</p>
          )}
          {!isGridLoading && !gridError && gridResults.length > 0 && (
            <>
              {gridResults.map((book) => (
                <BookResultItem 
                  key={book.external_id || book.isbn || book.title} 
                  book={book} 
                  onViewDetailsClick={handleOpenModal} 
                />
              ))}
              {/* Placeholder for Load More Button */}
              {/* <button>Load More</button> */}
            </>
          )}
        </div>
      )}

      {/* Modal Rendering (remains the same) */} 
      {isModalOpen && selectedBook && (
        <BookDetailModal 
          book={selectedBook}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BookSearch; 