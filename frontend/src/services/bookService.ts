const API_BASE_URL = 'http://localhost:5000/api';

// Interface matching the expected structure from the backend search route
export interface BookSearchResult {
  external_id: string; // Open Library Key
  title: string;
  authors?: string[]; // Open Library returns an array
  isbn?: string | null;
  first_publish_year?: number | null;
  cover_url?: string | null;
  public_rating?: number | null; 
  publisher?: string[] | null; 
  description?: string | null; 
  source: 'local' | 'external';
  local_book_id?: number | null;
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
        return [];
      }

      const params = new URLSearchParams({
        query: query,
        limit: limit.toString(),
      });

      const url = `${API_BASE_URL}/search/books?${params.toString()}`;

      try {
        const response = await fetch(url, { 
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json'
          },
          signal
        });

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`; 
          try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
          } 
          catch (e) {
              throw new Error(errorMessage);
          }
        }

        const data = await response.json();
        return data as BookSearchResult[];

      } 
      catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            console.log('Fetch aborted');
            return []; 
          }
          console.error("Error searching books:", error);
          throw error; 
      }
};
