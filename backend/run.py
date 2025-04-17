from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import settings
import logging

# Import db instance from models.py
from models import db
# Removed Marshmallow import

# Initialize JWTManager instance
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # --- START: Explicit Logger Config ---
    if app.debug:
        logging.basicConfig(level=logging.INFO)
    # --- END: Explicit Logger Config ---

    # Initialize CORS **before** registering routes/blueprints
    # Allow requests from your frontend origin (adjust port if necessary)
    # CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    # --- START: Temporarily Allow All Origins for Debugging ---
    CORS(app) # Allows all origins by default
    # --- END: Temporarily Allow All Origins for Debugging ---

    # Configure the application using settings from config.py
    app.config['SQLALCHEMY_DATABASE_URI'] = settings.DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = settings.SECRET_KEY
    # Configure JWT Secret Key (using the same SECRET_KEY for simplicity)
    app.config["JWT_SECRET_KEY"] = settings.SECRET_KEY 
    # --- START: Explicitly Disable JWT CSRF for Debugging ---
    app.config["JWT_CSRF_PROTECTION"] = False
    # --- END: Explicitly Disable JWT CSRF for Debugging ---
    # --- START: Explicitly Set Token Location --- 
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    # --- END: Explicitly Set Token Location ---

    # Log the JWT Secret Key being used by the app
    app.logger.info(f"JWT Secret Key configured: {app.config['JWT_SECRET_KEY']}")

    db.init_app(app)
    migrate = Migrate(app, db) 
    jwt.init_app(app) # Initialize JWTManager with the app

    # --- Register Blueprints --- 
    # Import and register the auth blueprint
    from routes.auth import auth_bp 
    # from routes.library import library_bp # Removed old library blueprint
    from routes.search import search_bp # Import new search blueprint
    from routes.library_entries import library_entries_bp # Import new library entries blueprint

    app.register_blueprint(auth_bp, url_prefix='/auth')
    # app.register_blueprint(library_bp, url_prefix='/api') # Removed old registration
    app.register_blueprint(search_bp, url_prefix='/api/search') # Register search blueprint
    app.register_blueprint(library_entries_bp, url_prefix='/api/library') # Register library entries blueprint

    # A simple route for testing
    @app.route('/')
    def hello():
        app.logger.info("Accessed root route /")
        return "Hello, StoryRoom Backend!"

    app.logger.info("Flask App Created and Configured")
    return app







app = create_app()

if __name__ == '__main__':
    app.run(debug=True) 