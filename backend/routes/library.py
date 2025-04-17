from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# Import the service function
from services.book_api import search_books_external 

# Create a Blueprint for library routes
library_bp = Blueprint('library', __name__)

# --- Book Search --- 
@library_bp.route('/search/books', methods=['GET'])
# @jwt_required() # Optional: Protect this route if desired
def search_books():
    query = request.args.get('query', type=str)
    limit = request.args.get('limit', default=10, type=int)

    if not query or len(query) < 3: # Basic validation
        return jsonify({"message": "Query parameter is required and must be at least 3 characters long."}), 400

    results = search_books_external(query, limit)

    if results is None: # Check if the service indicated an error
        return jsonify({"message": "Error searching for books. Please try again later."}), 503 # Service Unavailable

    return jsonify(results), 200

# --- Library Management Routes (Add Later) --- 

# Example: Add book to library
# @library_bp.route('/library/add', methods=['POST'])
# @jwt_required()
# def add_book_to_library():
#     user_id = get_jwt_identity()
#     # Get book details from request body (e.g., using a Pydantic schema)
#     # Check if book exists in our DB by ISBN/external_id
#     # If not, add book to books table
#     # Add entry to library_entries table for this user_id and book_id
#     # Handle potential errors (duplicates, db errors)
#     pass 

# Example: Get user's library
# @library_bp.route('/library', methods=['GET'])
# @jwt_required()
# def get_user_library():
#     user_id = get_jwt_identity()
#     # Query library_entries for user_id
#     # Return formatted results (perhaps using Pydantic schema)
#     pass 