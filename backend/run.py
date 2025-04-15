import os
from app import create_app, db # Import db if needed for shell context or migrations
# from app.models import User, Book # Example: Import models if needed for shell context

app = create_app(os.getenv('FLASK_ENV') or 'default')

# You can add commands here using @app.cli.command()

if __name__ == '__main__':
    app.run() 