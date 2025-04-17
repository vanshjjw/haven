import requests
import logging

OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json"
OPEN_LIBRARY_COVER_URL = "https://covers.openlibrary.org/b/" # ID type (isbn, oclc, etc.) / ID / Size (S, M, L).jpg

logger = logging.getLogger(__name__)

def search_books_external(query: str, limit: int = 10):
    """Searches for books using the Open Library Search API."""
    if not query:
        return []

    params = {
        "q": query,
        "limit": limit,
        "fields": "key,title,author_name,isbn,cover_i,first_publish_year" # Request specific fields
    }
    
    headers = {
        "User-Agent": "StoryRoomApp/1.0 (Contact: your-email@example.com)" # Be polite to APIs
    }

    try:
        response = requests.get(OPEN_LIBRARY_SEARCH_URL, params=params, headers=headers, timeout=10) # Add timeout
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        data = response.json()

        # Format the results
        formatted_results = []
        for doc in data.get("docs", []):
            # Find the first valid ISBN (prefer 13 digits)
            isbn = None
            isbn_list = doc.get("isbn", [])
            if isbn_list:
                isbn13 = next((i for i in isbn_list if len(i) == 13), None)
                isbn = isbn13 or isbn_list[0] # Fallback to first ISBN if no 13-digit found
            
            # Construct cover URL if cover ID exists
            cover_url = None
            cover_id = doc.get("cover_i")
            if cover_id:
                cover_url = f"{OPEN_LIBRARY_COVER_URL}id/{cover_id}-M.jpg" # Medium size cover

            formatted_results.append({
                "external_id": doc.get("key"), # Open Library work/edition key
                "title": doc.get("title"),
                "authors": doc.get("author_name"), # List of authors
                "isbn": isbn, # Use the selected ISBN
                "first_publish_year": doc.get("first_publish_year"),
                "cover_url": cover_url
            })
        
        return formatted_results

    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling Open Library API: {e}")
        # Depending on requirements, you might want to raise an exception 
        # or return an empty list/error indicator
        return None # Indicate an error occurred 