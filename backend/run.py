from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import settings
import logging
from logging.config import dictConfig

from models import db

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

jwt = JWTManager()

# Get the logger instance directly
log = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)

    app.logger.info("Logger configured, creating app...")

    CORS(app)

    # Configure the application using settings from config.py
    app.config['SQLALCHEMY_DATABASE_URI'] = settings.DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = settings.SECRET_KEY
    
    app.config["JWT_SECRET_KEY"] = settings.SECRET_KEY 
    
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_CSRF_PROTECTION"] = False

    # Log the JWT Secret Key being used by the app
    app.logger.info(f"JWT Secret Key configured: {app.config['JWT_SECRET_KEY']}")

    jwt.init_app(app)
    db.init_app(app)
    migrate = Migrate(app, db) 

    from routes.auth import auth_bp 
    from routes.search import search_bp 
    from routes.library_entries import library_entries_bp 

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(search_bp, url_prefix='/api/search')
    app.register_blueprint(library_entries_bp, url_prefix='/api/library')

    @app.route('/')
    def hello():
        app.logger.info("Accessed root route /")
        return "Hello, StoryRoom Backend!"

    app.logger.info("Flask App Created and Configured")
    return app







app = create_app()

if __name__ == '__main__':
    app.run(debug=True) 