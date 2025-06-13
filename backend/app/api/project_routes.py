from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from ..models.project import Project
from ..models.user import User
from ..models.activity import Activity
from ..schemas.project_schema import ProjectSchema
from ..schemas.activity_schema import ActivitySchema
from ..services.activity_service import log_activity
import datetime

# Using a unique blueprint name to avoid conflicts
project_bp = Blueprint('project_routes_bp', __name__, url_prefix='/api')

project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)
activities_schema = ActivitySchema(many=True)


@project_bp.route('/projects/<int:project_id>/activities', methods=['GET'])
@jwt_required()
def get_project_activities(project_id):
    """Fetches all activities for a specific project, ordered by most recent."""
    activities = Activity.query.filter_by(project_id=project_id).order_by(Activity.timestamp.desc()).all()
    return jsonify(activities_schema.dump(activities))


@project_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    """Fetches all projects that the current user leads or is a member of."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    all_user_projects = list(set(user.led_projects + user.assigned_projects))
    return jsonify(projects_schema.dump(all_user_projects))


@project_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    """Creates a new project and logs the creation activity."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()
    
    due_date_str = data.get('due_date')
    due_date = datetime.datetime.strptime(due_date_str, '%Y-%m-%d').date() if due_date_str else None

    new_project = Project(
        title=data.get('title'),
        description=data.get('description'),
        status='To Do',
        lead_id=current_user_id,
        priority=data.get('priority', 'Medium'),
        due_date=due_date
    )
    new_project.members.append(user)
    db.session.add(new_project)
    
    # Commit here to generate the new project's ID for logging
    db.session.commit()

    log_activity(f"{user.username} created the project '{new_project.title}'.", new_project.id, current_user_id)
    db.session.commit()
    
    return jsonify(project_schema.dump(new_project)), 201


@project_bp.route('/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project_status(project_id):
    """Updates the status of a project and logs the activity."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    project = Project.query.get_or_404(project_id)

    if not any(member.id == current_user_id for member in project.members):
        return jsonify({'error': 'Unauthorized: You are not a member of this project'}), 403

    data = request.get_json()
    if 'status' in data and project.status != data['status']:
        log_activity(f"{user.username} moved the project from '{project.status}' to '{data['status']}'.", project.id, current_user_id)
        project.status = data['status']
    
    db.session.commit()
    return jsonify(project_schema.dump(project))


@project_bp.route('/projects/<int:project_id>/members', methods=['POST'])
@jwt_required()
def add_project_member(project_id):
    """Adds a member to a project and logs the activity."""
    current_user_id = get_jwt_identity()
    project = Project.query.get_or_404(project_id)
    user = User.query.get(current_user_id)

    if project.lead_id != current_user_id:
        return jsonify({"error": "Only the project lead can add members"}), 403

    user_to_add_id = request.get_json().get('user_id')
    user_to_add = User.query.get_or_404(user_to_add_id)

    if user_to_add in project.members:
        return jsonify({"error": "User is already a member"}), 409

    project.members.append(user_to_add)
    log_activity(f"{user.username} added {user_to_add.username} to the project.", project.id, current_user_id)
    db.session.commit()
    return jsonify(project_schema.dump(project)), 200


@project_bp.route('/projects/<int:project_id>/members/<int:user_id>', methods=['DELETE'])
@jwt_required()
def remove_project_member(project_id, user_id):
    """Removes a member from a project and logs the activity."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    project = Project.query.get_or_404(project_id)

    if project.lead_id != current_user_id:
        return jsonify({"error": "Only the project lead can remove members"}), 403
    
    if user_id == project.lead_id:
        return jsonify({"error": "Cannot remove the project lead"}), 400

    user_to_remove = User.query.get_or_404(user_id)
    
    if user_to_remove not in project.members:
        return jsonify({"error": "User is not a member of this project"}), 404

    project.members.remove(user_to_remove)
    log_activity(f"{user.username} removed {user_to_remove.username} from the project.", project.id, current_user_id)
    db.session.commit()
    return jsonify(project_schema.dump(project)), 200
