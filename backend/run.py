from flask import Flask
from flask_migrate import Migrate
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

    db.init_app(app)
    migrate = Migrate(app, db) 

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







app = create_app()

if __name__ == '__main__':
    app.run(debug=True) 