from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from ..models.task import Task
from ..models.project import Project
from ..models.user import User
from ..schemas.task_schema import TaskSchema
from ..services.activity_service import log_activity

# The url_prefix ('/api') is handled in __init__.py
task_bp = Blueprint('task_bp', __name__)
task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

def verify_project_member(project_id, user_id):
    project = Project.query.get_or_404(project_id)
    if not any(member.id == user_id for member in project.members):
        return None, jsonify({'error': 'Unauthorized'}), 403
    return project, None, None

@task_bp.route('/projects/<int:project_id>/tasks', methods=['POST'])
@jwt_required()
def add_task_to_project(project_id):
    current_user_id = get_jwt_identity()
    project, error, code = verify_project_member(project_id, current_user_id)
    if error: return error, code

    user = User.query.get(current_user_id)
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': 'Task title is required'}), 400

    new_task = Task(title=data['title'], project_id=project_id)
    db.session.add(new_task)
    log_activity(f"{user.username} created task '{new_task.title}'.", project_id, current_user_id)
    db.session.commit()
    return jsonify(task_schema.dump(new_task)), 201

@task_bp.route('/projects/<int:project_id>/tasks', methods=['GET'])
@jwt_required()
def get_project_tasks(project_id):
    project, error, code = verify_project_member(project_id, get_jwt_identity())
    if error: return error, code
    return jsonify(tasks_schema.dump(project.tasks))

@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    task = Task.query.get_or_404(task_id)
    _, error, code = verify_project_member(task.project_id, current_user_id)
    if error: return error, code

    data = request.get_json()
    
    if 'completed' in data and task.completed != data['completed']:
        action = "completed" if data['completed'] else "marked incomplete"
        log_activity(f"{user.username} {action} task '{task.title}'.", task.project_id, current_user_id)
        task.completed = data['completed']

    if 'assignee_id' in data and task.assignee_id != data['assignee_id']:
        if data['assignee_id']:
            new_assignee = User.query.get_or_404(data['assignee_id'])
            log_activity(f"{user.username} assigned task '{task.title}' to {new_assignee.username}.", task.project_id, current_user_id)
        else:
            log_activity(f"{user.username} unassigned task '{task.title}'.", task.project_id, current_user_id)
        task.assignee_id = data['assignee_id']
    
    db.session.commit()
    return jsonify(task_schema.dump(task))

@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    task = Task.query.get_or_404(task_id)
    _, error, code = verify_project_member(task.project_id, current_user_id)
    if error: return error, code

    log_activity(f"{user.username} deleted task '{task.title}'.", task.project_id, current_user_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'}), 200
