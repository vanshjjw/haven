# backend/routes/search.py
from flask import Blueprint, request, jsonify
from sqlalchemy import or_ # For OR queries

# Import external search service and models
from services.book_api import search_books_external
from models import db, Book

search_bp = Blueprint('search', __name__)

MAX_LOCAL_RESULTS = 20
MAX_EXTERNAL_RESULTS = 20

@search_bp.route('/books', methods=['GET'])
def search_all_books():
    query = request.args.get('query', type=str)
    # Consider adding page/limit parameters later for pagination

    if not query or len(query) < 3:
        return jsonify({"message": "Query parameter is required and must be at least 3 characters long."}), 400

    local_results_formatted = []
    external_results_formatted = []
    local_isbns = set()

    try:
        search_term = f"%{query}%"
        local_books = Book.query.filter(
            or_(
                Book.title.ilike(search_term),
                Book.author.ilike(search_term)
            )
        ).limit(MAX_LOCAL_RESULTS).all()

        for book in local_books:
            # Format local results similar to external ones for consistency
            local_results_formatted.append({
                "local_book_id": book.id,
                "external_id": None,
                "title": book.title,
                "authors": book.author.split(', ') if book.author else [],
                "isbn": book.isbn,
                "first_publish_year": None,
                "publisher": None,
                "description": None,
                "cover_url": book.image_url,
                "public_rating": book.public_rating,
                "source": "local"
            })
            if book.isbn:
                local_isbns.add(book.isbn)

    except Exception as e:
        print(f"Error searching local database: {e}")


    try:
        external_results_raw = search_books_external(query, MAX_EXTERNAL_RESULTS)
        if external_results_raw:
             for book_data in external_results_raw:
                 # Filter out external results if a matching ISBN exists locally
                 if book_data.get("isbn") and book_data["isbn"] in local_isbns:
                     continue

                 # Format external results
                 external_results_formatted.append({
                    "local_book_id": None,
                    "external_id": book_data.get("external_id"),
                    "title": book_data.get("title"),
                    "authors": book_data.get("authors"),
                    "isbn": book_data.get("isbn"),
                    "first_publish_year": book_data.get("first_publish_year"),
                    "publisher": book_data.get("publisher"),
                    "description": book_data.get("description"),
                    "cover_url": book_data.get("cover_url"),
                    "public_rating": book_data.get("public_rating"),
                    "source": "external" # Mark source
                 })

    except Exception as e:
        print(f"Error searching external API: {e}") 

    # Add sorting logic here
    combined_results = local_results_formatted + external_results_formatted
    
    return jsonify(combined_results), 200 