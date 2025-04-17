import { BookSearchResult } from './bookService';

const API_BASE_URL = 'http://localhost:5000/api'; // Backend API prefix

// Interface for the data sent to the backend
interface LibraryEntryPayload {
  source: 'local' | 'external'; // Added source
  local_book_id?: number | null; // Added local ID (if source is local)
  book_data?: { // Optional: only needed if source is external
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
    // Only include book_data if source is external
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

  // Log the payload before sending
  console.log('Sending library entry payload:', JSON.stringify(payload, null, 2));
  // Log the Authorization header value
  console.log('Using Authorization Header:', `Bearer ${token}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Add JWT token
    },
    body: JSON.stringify(payload),
  });

  // --- Revised Error Handling --- 
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    let errorDetails = null;
    try {
      // Try to parse JSON, but don't fail if it's not JSON
      const errorData = await response.json(); 
      errorMessage = errorData?.message || errorData?.errors || errorMessage;
      if(errorData?.details) {
         errorDetails = errorData.details;
         // Log the specific Pydantic details if available
         console.error("Pydantic Validation Details:", errorDetails);
         // Format details for the error message
         try {
             const formattedDetails = JSON.stringify(errorDetails);
             errorMessage = `${errorData?.message || 'Validation Error'}: ${formattedDetails}`;
         } catch (e) { /* ignore stringify error */ }
      }
    } catch (e) {
       // If response wasn't JSON, try to read as text
       try {
           const textError = await response.text();
           errorMessage = textError || errorMessage; 
       } catch (textE) {
           // Ignore if reading as text also fails
       }
    }
    console.error("Final error message:", errorMessage);
    throw new Error(errorMessage); 
  }
  // --- End Revised Error Handling ---

  // If response IS ok, parse JSON
  try {
      const data = await response.json();
      return data;
  } catch (e) {
      // Handle cases where success response isn't valid JSON (unlikely but possible)
      console.error("Error parsing successful response as JSON", e);
      throw new Error("Received successful but invalid response from server.");
  }
}; 