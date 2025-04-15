from flask_sqlalchemy import SQLAlchemy
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
    title = db.Column(db.String(200), nullable=False, index=True)
    author = db.Column(db.String(150), index=True)
    isbn = db.Column(db.String(20), index=True, unique=True, nullable=True) 
    image_url = db.Column(db.String(300), nullable=True)
    public_rating = db.Column(db.Float, nullable=True)

    library_entries = db.relationship('LibraryEntry', back_populates='book')

    def __repr__(self):
        return f'<Book {self.title}>'


class LibraryEntry(db.Model):
    __tablename__ = 'library_entries'

    id = db.Column(db.Integer, primary_key=True)

    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False, index=True)

    # Status: 0 = Want to Read, 1 = Reading, 2 = Read
    status = db.Column(db.Integer, default=0, nullable=False, index=True)

    user_rating = db.Column(db.Integer, nullable=True)
    user_notes = db.Column(db.Text, nullable=True) 

    # Prevent a user from adding the same book info twice
    __table_args__ = (db.UniqueConstraint('user_id', 'book_id', name='_user_book_uc'),)

    # Define relationships explicitly here for clarity
    user = db.relationship('User', back_populates='library_entries')
    book = db.relationship('Book', back_populates='library_entries')

    def __repr__(self):
        return f'<LibraryEntry for User {self.user_id} - Book {self.book_id}>' 