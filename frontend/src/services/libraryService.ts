import { BookSearchResult } from './bookService';

const API_BASE_URL = 'http://localhost:5000/api';

// Interface for the data sent to the backend
interface LibraryEntryPayload {
  source: 'local' | 'external'; 
  local_book_id?: number | null; 
  book_data?: { 
    external_id?: string | null;
    isbn?: string | null;
    title: string;
    authors?: string[] | null;
    cover_url?: string | null;
    first_publish_year?: number | null;
  } | null;
  status: number; // 0, 1, or 2
  rating?: number | null;
}

/**
 * Adds or updates a book entry in the user's library.
 * @param book The book details from search results.
 * @param status The selected library status (0, 1, or 2).
 * @param rating The user's rating (optional, 1-5, null if not applicable).
 * @param token The JWT authentication token.
 * @returns Promise<any> The response data from the backend.
 */


export const addOrUpdateLibraryEntry = async (
  book: BookSearchResult,
  status: number,
  rating: number | null,
  token: string
): Promise<any> => {

    // Construct payload based on source
    const payload: LibraryEntryPayload = {
      source: book.source,
      status: status,
      rating: rating,
    };

    if (book.source === 'local') {
      payload.local_book_id = book.local_book_id;
    } else {
      payload.book_data = {
        external_id: book.external_id,
        isbn: book.isbn,
        title: book.title,
        authors: book.authors,
        cover_url: book.cover_url,
        first_publish_year: book.first_publish_year,
      };
    }

    const url = `${API_BASE_URL}/library/entry`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorDetails = null;
      try {
        const errorData = await response.json(); 
        errorMessage = errorData?.message || errorData?.errors || errorMessage;
        if(errorData?.details) {
            errorDetails = errorData.details;
        }
      } 
      catch (e) {
        try {
            const textError = await response.text();
            errorMessage = textError || errorMessage; 
        } 
        catch (textE) {
        }
      }
      throw new Error(errorMessage); 
    }

    return await response.json();
}; 