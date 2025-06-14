from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from ..models.project import Project
from ..models.user import User
from ..models.task import Task
from ..schemas.project_schema import ProjectSchema
from sqlalchemy import or_
import datetime

project_bp = Blueprint('project_bp', __name__)
project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

@project_bp.route('', methods=['GET'])
@jwt_required()
def get_projects():
    """Fetches all projects that the current user leads or is a member of."""
    current_user_id = int(get_jwt_identity())
    all_user_projects = Project.query.filter(
        or_(Project.lead_id == current_user_id, Project.members.any(User.id == current_user_id))
    ).distinct().all()
    return jsonify(projects_schema.dump(all_user_projects))

@project_bp.route('', methods=['POST'])
@jwt_required()
def create_project():
    """
    Smart endpoint that handles data from both the 'Ignition' and 'Quick Create' flows.
    """
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    data = request.get_json()

    if not data or not data.get('title'):
        return jsonify({"error": "Title is required"}), 400

    new_project = Project(
        title=data.get('title'),
        # Intelligently uses 'goal' from Ignition or 'description' from Quick Form
        goal=data.get('goal', data.get('description')), 
        emotional_tag=data.get('emotional_tag'),
        rough_ideas_dump=data.get('rough_ideas_dump'),
        priority=data.get('priority', 'Medium'),
        status='To Do',
        lead_id=current_user_id
    )
    
    if user:
        new_project.members.append(user)
        
    db.session.add(new_project)
    
    # Save experiments if they exist
    if 'experiments' in data and data['experiments']:
        for exp_data in data['experiments']:
            db.session.add(Task(
                title=exp_data.get('hypothesis'),
                project=new_project
            ))
            
    db.session.commit()
    return jsonify(project_schema.dump(new_project)), 201

@project_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    """Deletes a project. Only the project lead can perform this action."""
    current_user_id = int(get_jwt_identity())
    project = Project.query.get_or_404(project_id)

    # Security check: Only the project lead can delete the project
    if project.lead_id != current_user_id:
        return jsonify({"error": "Only the project lead can delete this project."}), 403

    db.session.delete(project)
    db.session.commit()
    
    return jsonify({"msg": "Project deleted successfully"}), 200
