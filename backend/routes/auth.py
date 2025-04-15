from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token

from models import db, User
# Adjust import path based on your structure
from schemas.user import UserCreate, UserPublic 
# Simple Pydantic model for login input
from pydantic import BaseModel, EmailStr

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
        # Validate input data using the Pydantic schema
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
    except IntegrityError: # Catch potential race condition
        db.session.rollback()
        return jsonify({"message": "Username or Email already exists"}), 409
    except Exception as e:
        db.session.rollback()
        # Log the exception e
        return jsonify({"message": "Could not create user"}), 500

    # Return created user details (excluding password hash)
    # Create a UserPublic schema instance from the new_user model instance
    user_public_data = UserPublic.model_validate(new_user)
    
    return jsonify(user_public_data.model_dump()), 201 # 201 Created

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

    # Check if user exists and password is correct
    if user and user.check_password(login_data.password):
        # Create JWT access token
        access_token = create_access_token(identity=user.id) # Use user ID as identity
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401 # 401 Unauthorized 