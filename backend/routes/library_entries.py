
from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity



library_entries_bp = Blueprint('library_entries', __name__)

 
@library_entries_bp.route('/entry', methods=['POST'])
def add_or_update_library_entry_simple():
    
    current_app.logger.info("Accessed /library/entry endpoint")

    return jsonify({"message": "Endpoint reached successfully"}), 200 