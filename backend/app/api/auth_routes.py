from flask import Blueprint, request, jsonify
from ..services import auth_service

# The url_prefix ('/api/auth') is now handled in __init__.py
auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    return auth_service.register_user_service(data)

@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    return auth_service.login_user_service(data)
