from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from pydantic import BaseModel, Field, ValidationError, root_validator
from typing import List, Optional

from models import db, Book, LibraryEntry

library_bp = Blueprint('library', __name__)


class BookDataPayload(BaseModel):
    external_id: Optional[str] = None
    isbn: Optional[str] = None
    title: str
    authors: Optional[List[str]] = []
    cover_url: Optional[str] = None
    first_publish_year: Optional[int] = None

class LibraryEntryPayload(BaseModel):
    source: str
    local_book_id: Optional[int] = None
    book_data: Optional[BookDataPayload] = None
    status: int = Field(..., ge=0, le=2)
    rating: Optional[float] = Field(None, ge=1, le=5)



@library_bp.route('/add', methods=['POST'])
@jwt_required()
def add_or_update_library_entry():
    user_id = get_jwt_identity() 
    json_data = request.get_json(silent=True)

    if not json_data:
        current_app.logger.warning(f"Received empty JSON payload for user {user_id}")
        return jsonify({"message": "No input data provided"}), 400
    

    try:
        payload = LibraryEntryPayload(**json_data)
    except ValidationError as e:
        current_app.logger.error(f"Pydantic Validation Error for user {user_id}: {e.errors()}") 
        return jsonify({"message": "Validation Error", "details": e.errors()}), 422

    # --- Rating validation --- 
    if payload.status != 2 and payload.rating is not None:
         return jsonify({"message": "Validation Error: Rating can only be provided if status is 'Read'"}), 400
    if payload.rating is not None and round(payload.rating * 2) / 2 != payload.rating:
         return jsonify({"message": "Validation Error: Rating must be a whole or half number (e.g., 3, 4.5)"}), 400

    book_id = None

    # --- Handle based on source --- 
    if payload.source == 'local':
        if payload.local_book_id:
             book_exists = Book.query.get(payload.local_book_id)
             if not book_exists:
                 return jsonify({"message": f"Book with local ID {payload.local_book_id} not found"}), 404
             book_id = payload.local_book_id

    elif payload.source == 'external':
        if payload.book_data:
            book = None
            if payload.book_data.isbn:
                book = Book.query.filter_by(isbn=payload.book_data.isbn).first()

            if not book:
                author_str = ', '.join(payload.book_data.authors) if payload.book_data.authors else None
                existing_book_check = Book.query.filter_by(title=payload.book_data.title, author=author_str).first()
                if existing_book_check:
                    book = existing_book_check
                    if not book.isbn and payload.book_data.isbn: book.isbn = payload.book_data.isbn
                    if not book.image_url and payload.book_data.cover_url: book.image_url = payload.book_data.cover_url
                else:
                    new_book = Book(
                        title=payload.book_data.title,
                        author=author_str,
                        isbn=payload.book_data.isbn,
                        image_url=payload.book_data.cover_url
                    )
                    db.session.add(new_book)
                    try:
                        db.session.flush()
                        book = new_book
                    except Exception as e:
                         db.session.rollback()
                         # Keep DB error log
                         current_app.logger.error(f"Error flushing new book: {e}")
                         return jsonify({"message": "Database error creating book"}), 500

            if not book or not book.id:
                 current_app.logger.error("Failed to find or create book object with ID for external source")
                 return jsonify({"message": "Could not find or create book record from external data"}), 500
            book_id = book.id


    # --- Find or Create/Update Library Entry --- 
    if not book_id:
         current_app.logger.error(f"Internal error: Book ID not determined for user {user_id}")
         return jsonify({"message": "Internal error: Book ID not determined"}), 500

    library_entry = LibraryEntry.query.filter_by(user_id=user_id, book_id=book_id).first()

    if library_entry:
        library_entry.status = payload.status
        library_entry.user_rating = payload.rating
    else:
        library_entry = LibraryEntry(
            user_id=user_id,
            book_id=book_id,
            status=payload.status,
            user_rating=payload.rating
        )
        db.session.add(library_entry)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error committing library entry for user {user_id}: {e}")
        return jsonify({"message": "Database error saving library entry"}), 500

    return jsonify({"message": "Library entry saved successfully"}), 200