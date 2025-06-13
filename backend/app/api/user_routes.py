from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..models.user import User
from ..schemas.user_schema import UserSchema

# The url_prefix ('/api/users') is now handled in __init__.py
user_bp = Blueprint('user_bp', __name__)
users_schema = UserSchema(many=True)

# This route is now at '/', which becomes '/api/users/' after registration
@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_users():
    """Provides a list of all users in the system."""
    all_users = User.query.all()
    return jsonify(users_schema.dump(all_users))
