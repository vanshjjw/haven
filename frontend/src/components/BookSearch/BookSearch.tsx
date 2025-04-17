import React, { useState, useEffect, useRef } from 'react';
import * as bookService from '../../services/bookService';
import BookResultItem from './BookResultItem';
import styles from './BookSearch.module.css';

const DEBOUNCE_DELAY = 500; // Milliseconds to wait after user stops typing
const MIN_QUERY_LENGTH = 3;

const BookSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<bookService.BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to store the AbortController for the current fetch request
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce effect
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  // API call effect based on debounced query
  useEffect(() => {
    // Abort previous request if it's still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return; // Exit if query is too short
    }

    // Create a new AbortController for the new request
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

  return (
    <div className={styles.searchContainer}>
      <input
        type="search" // Use type="search" for potential browser optimizations/styling
        placeholder="Search for books by title or author..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.resultsContainer}>
        {isLoading && <p className={styles.loadingMessage}>Loading results...</p>}
        {error && <p className={styles.errorMessage}>Error: {error}</p>}
        {!isLoading && !error && debouncedQuery.length >= MIN_QUERY_LENGTH && results.length === 0 && (
          <p className={styles.noResultsMessage}>No books found for "{debouncedQuery}".</p>
        )}
        {!isLoading && !error && results.length > 0 && (
          <div> 
            {results.map((book) => (
              <BookResultItem 
                key={book.external_id || book.isbn || book.title} 
                book={book}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch; 