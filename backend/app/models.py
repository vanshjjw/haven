import enum
from datetime import datetime
from .extensions import db, bcrypt # Import bcrypt here

# Enum for library entry status
class LibraryStatus(enum.Enum):
    WANT_TO_READ = 'want_to_read'
    READING = 'reading' # Optional status
    READ = 'read'

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    library_entries = db.relationship('UserLibraryEntry', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    # Use String for external ID as it might not be an integer
    external_api_id = db.Column(db.String, unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255))
    cover_image_url = db.Column(db.String(500))
    # Add other relevant fields as needed (e.g., publication year, description)

    library_entries = db.relationship('UserLibraryEntry', backref='book', lazy=True)

    def __repr__(self):
        return f'<Book {self.title}>'

class UserLibraryEntry(db.Model):
    __tablename__ = 'user_library_entries'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    status = db.Column(db.Enum(LibraryStatus), nullable=False, default=LibraryStatus.WANT_TO_READ)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    # Could add rating, review, date_read, etc.

    # Ensure a user can only have one entry per book
    __table_args__ = (db.UniqueConstraint('user_id', 'book_id', name='uq_user_book'),)

    def __repr__(self):
        return f'<UserLibraryEntry user={self.user_id} book={self.book_id} status={self.status.name}>' 