import os # Keep os for potential future use
from flask import Flask
from flask_migrate import Migrate
# Removed dotenv import, handled by pydantic-settings

# Import settings from config.py
from config import settings

# Import db instance from models.py
from models import db
# Removed Marshmallow import

def create_app():
    app = Flask(__name__)

    # Configure the application using settings from config.py
    app.config['SQLALCHEMY_DATABASE_URI'] = settings.DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = settings.SECRET_KEY

    # Initialize extensions with the app context
    db.init_app(app)
    # Removed ma.init_app(app)
    migrate = Migrate(app, db) # Initialize Flask-Migrate

    # --- Register Blueprints --- 
    # We will add these later when creating routes
    # from routes.auth import auth_bp
    # from routes.library import library_bp
    # app.register_blueprint(auth_bp, url_prefix='/auth')
    # app.register_blueprint(library_bp, url_prefix='/api')

    # A simple route for testing
    @app.route('/')
    def hello():
        return "Hello, StoryRoom Backend!"

    return app

# Create the app instance using the factory
app = create_app()

if __name__ == '__main__':
    # Use Flask's built-in server for development
    # In production, use a WSGI server like Gunicorn or uWSGI
    app.run(debug=True) # debug=True enables auto-reloading and debugging 