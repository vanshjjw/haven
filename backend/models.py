from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
import re
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    library_entries = db.relationship('LibraryEntry', back_populates='user', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    external_id = db.Column(db.String, unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    authors = db.Column(db.String(255))
    thumbnail_url = db.Column(db.String(500))

    library_entries = db.relationship('LibraryEntry', back_populates='book')

    def __repr__(self):
        return f'<Book {self.title}>'

class LibraryEntry(db.Model):
    __tablename__ = 'library_entries'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)

    status = db.Column(db.String(50))
    rating = db.Column(db.Integer)
    notes = db.Column(db.Text)
    date_added = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_finished = db.Column(db.DateTime)

    user = db.relationship('User', back_populates='library_entries')
    book = db.relationship('Book', back_populates='library_entries')

    __table_args__ = (db.UniqueConstraint('user_id', 'book_id', name='_user_book_uc'),)

    def __repr__(self):
        return f'<LibraryEntry User: {self.user_id} Book: {self.book_id}>' 