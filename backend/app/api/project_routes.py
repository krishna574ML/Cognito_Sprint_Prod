from flask import Blueprint, jsonify, request
from app import db
from ..models.project import Project
from ..schemas.project_schema import ProjectSchema

project_bp = Blueprint('project_bp', __name__)
project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

@project_bp.route('/projects', methods=['GET'])
def get_projects():
    all_projects = Project.query.all()
    return jsonify(projects_schema.dump(all_projects))

@project_bp.route('/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    new_project = Project(
        title=data.get('title'),
        description=data.get('description'),
        status='To Do'
    )
    db.session.add(new_project)
    db.session.commit()
    return jsonify(project_schema.dump(new_project)), 201

@project_bp.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    data = request.get_json()
    if 'status' in data:
        project.status = data['status']
    db.session.commit()
    return jsonify(project_schema.dump(project))
