from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import settings

# Import db instance from models.py
from models import db
# Removed Marshmallow import

# Initialize JWTManager instance
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Configure the application using settings from config.py
    app.config['SQLALCHEMY_DATABASE_URI'] = settings.DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = settings.SECRET_KEY
    # Configure JWT Secret Key (using the same SECRET_KEY for simplicity)
    app.config["JWT_SECRET_KEY"] = settings.SECRET_KEY 

    db.init_app(app)
    migrate = Migrate(app, db) 
    jwt.init_app(app) # Initialize JWTManager with the app

    # --- Register Blueprints --- 
    # Import and register the auth blueprint
    from routes.auth import auth_bp 
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    # Placeholder for library blueprint registration
    # from routes.library import library_bp
    # app.register_blueprint(library_bp, url_prefix='/api')

    # A simple route for testing
    @app.route('/')
    def hello():
        return "Hello, StoryRoom Backend!"

    return app







app = create_app()

if __name__ == '__main__':
    app.run(debug=True) 