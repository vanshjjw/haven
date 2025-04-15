import os
from flask import Flask
from config import config_by_name
from .extensions import db, migrate, jwt, bcrypt, cors
# Import models here to ensure they are known to Flask-Migrate
from . import models 

def create_app(config_name=None):
    """Application factory function."""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db) # Pass db object here
    jwt.init_app(app)
    bcrypt.init_app(app)
    # Allow CORS for all domains on all routes
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}) # Be more specific with CORS path

    # Register blueprints here
    from .auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # Import other blueprints (e.g., books, library) here and register them
    # from .books import bp as books_bp
    # app.register_blueprint(books_bp, url_prefix='/api/books')
    # from .library import bp as library_bp
    # app.register_blueprint(library_bp, url_prefix='/api/library')


    # Shell context for Flask CLI
    @app.shell_context_processor
    def ctx():
        # Make models available in the shell context
        return {"app": app, "db": db, "User": models.User, "Book": models.Book, "UserLibraryEntry": models.UserLibraryEntry}

    # Add a simple health check route
    @app.route('/health')
    def health_check():
        return "OK", 200

    return app 