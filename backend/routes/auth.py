from flask import Blueprint, request, jsonify, current_app
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token

from models import db, User

from schemas.user import UserCreate, UserPublic 

from pydantic import BaseModel, EmailStr
from config import settings

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Create a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register_user():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    try:
        user_data = UserCreate(**json_data)
    except ValidationError as e:
        return jsonify({"message": "Validation Error", "errors": e.errors()}), 400

    # Check if user already exists
    existing_user = User.query.filter(
        (User.username == user_data.username) | (User.email == user_data.email)
    ).first()
    if existing_user:
        return jsonify({"message": "Username or Email already exists"}), 409 # 409 Conflict

    # Create new user instance
    new_user = User(
        username=user_data.username,
        email=user_data.email
    )
    new_user.set_password(user_data.password) # Hash password

    try:
        db.session.add(new_user)
        db.session.commit()
    except IntegrityError: 
        db.session.rollback()
        return jsonify({"message": "Username or Email already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Could not create user"}), 500

    user_public_data = UserPublic.model_validate(new_user)
    
    return jsonify(user_public_data.model_dump()), 201



@auth_bp.route('/login', methods=['POST'])
def login_user():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400
    
    try:
        login_data = UserLogin(**json_data)
    except ValidationError as e:
        return jsonify({"message": "Validation Error", "errors": e.errors()}), 400

    # Find user by email
    user = User.query.filter_by(email=login_data.email).first()

    if user and user.check_password(login_data.password):
        # Log the secret key used for encoding
        encoding_key = current_app.config.get("JWT_SECRET_KEY")
        current_app.logger.info(f"Using JWT Secret Key for encoding: {encoding_key}")
        # Optional: Compare directly with settings if imported
        # current_app.logger.info(f"Settings.SECRET_KEY value: {settings.SECRET_KEY}") 

        # Create JWT access token
        access_token = create_access_token(identity=user.id) 
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401 # 401 Unauthorized