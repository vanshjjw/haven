import { useAuth } from '../context/AuthContext'; // We might need this later for authenticated requests

const API_BASE_URL = 'http://localhost:5000/api'; // Backend API prefix

// Interface matching the expected structure from the backend search route
export interface BookSearchResult {
  external_id: string; // Open Library key
  title: string;
  authors?: string[]; // Open Library returns an array
  isbn?: string | null;
  first_publish_year?: number | null;
  cover_url?: string | null;
}

/**
 * Searches for books by calling the backend API.
 * @param query The search term.
 * @param limit Max number of results.
 * @param signal AbortSignal for request cancellation.
 * @returns Promise<BookSearchResult[]>
 */
export const searchBooks = async (
  query: string, 
  limit: number = 10, 
  signal?: AbortSignal
): Promise<BookSearchResult[]> => {
  if (!query || query.length < 3) {
    return []; // Don't search for very short queries
  }

  const params = new URLSearchParams({
    query: query,
    limit: limit.toString(),
  });

  const url = `${API_BASE_URL}/search/books?${params.toString()}`;

  try {
    const response = await fetch(url, { 
      method: 'GET', // GET request for search
      headers: {
        // Add Authorization header if needed for protected search in the future
        // 'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal, // Pass the AbortSignal to fetch
    });

    if (!response.ok) {
      // Try to parse error message from backend, otherwise use status text
      let errorMessage = `HTTP error! status: ${response.status}`; 
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) { /* Ignore parsing error */ }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data as BookSearchResult[];

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Fetch aborted');
      // Return empty array or re-throw specific error if needed
      return []; 
    }
    console.error("Error searching books:", error);
    // Re-throw the error to be caught by the calling component
    throw error; 
  }
};

// TODO: Add function to add a book to the user library
// export const addBookToLibrary = async (bookData: { isbn?: string, external_id?: string, ... }) => { ... } 