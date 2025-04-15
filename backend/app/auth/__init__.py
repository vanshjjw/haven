from flask import Blueprint

bp = Blueprint('auth', __name__)

# Import routes after blueprint definition to avoid circular imports
from . import routes 