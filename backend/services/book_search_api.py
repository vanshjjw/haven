import requests
import logging

OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json"
OPEN_LIBRARY_COVER_URL = "https://covers.openlibrary.org/b/"

logger = logging.getLogger(__name__)

def search_books_external(query: str, limit: int = 10):
    if not query:
        return []

    params = {
        "q": query,
        "limit": limit,
        "fields": "key,title,author_name,isbn,cover_i,first_publish_year,publisher,description,ratings_average"
    }
    
    headers = {
        "User-Agent": "StoryRoomApp/1.0 (Contact: your-email@example.com)"
    }

    try:
        response = requests.get(OPEN_LIBRARY_SEARCH_URL, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()

        # Format the results
        formatted_results = []
        for doc in data.get("docs", []):
            # Find the first valid ISBN (prefer 13 digits)
            isbn = None
            isbn_list = doc.get("isbn", [])
            if isbn_list:
                isbn13 = next((i for i in isbn_list if len(i) == 13), None)
                isbn = isbn13 or isbn_list[0]
            
            # Construct cover URL if cover ID exists
            cover_url = None
            cover_id = doc.get("cover_i")
            if cover_id:
                cover_url = f"{OPEN_LIBRARY_COVER_URL}id/{cover_id}-M.jpg" # Medium size cover

            # Extract rating, round if necessary
            raw_rating = doc.get("ratings_average")
            public_rating = round(raw_rating, 1) if isinstance(raw_rating, (int, float)) else None

            # Extract description (can be string or object)
            desc_data = doc.get("description")
            description = None
            if isinstance(desc_data, str):
                description = desc_data
            elif isinstance(desc_data, dict) and desc_data.get("type") == "/type/text":
                description = desc_data.get("value")
                
            # Extract publisher (can be a list)
            publisher = doc.get("publisher")

            formatted_results.append({
                "external_id": doc.get("key"), # Open Library work/edition key
                "title": doc.get("title"),
                "authors": doc.get("author_name"), # List of authors
                "isbn": isbn, # Use the selected ISBN
                "first_publish_year": doc.get("first_publish_year"),
                "publisher": publisher, # Add publisher list
                "description": description, # Add description
                "cover_url": cover_url,
                "public_rating": public_rating
            })
        
        return formatted_results

    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling Open Library API: {e}")
        return None