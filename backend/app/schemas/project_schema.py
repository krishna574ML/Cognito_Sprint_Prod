from app import ma
from ..models.project import Project
from .task_schema import TaskSchema
# Import UserSchema at the top
from .user_schema import UserSchema

class ProjectSchema(ma.SQLAlchemyAutoSchema):
    tasks = ma.Nested(TaskSchema, many=True, dump_only=True)
    progress = ma.Method(serialize="get_progress")
    # Add fields for the project lead and members
    lead = ma.Nested(UserSchema, dump_only=True)
    members = ma.Nested(UserSchema, many=True, dump_only=True)

    class Meta:
        model = Project
        load_instance = True
        include_fk = True

    def get_progress(self, obj):
        tasks_collection = obj.tasks
        if not tasks_collection:
            return 0
        
        all_tasks = tasks_collection.all()
        if not all_tasks:
            return 0
            
        completed_tasks = [task for task in all_tasks if task.completed]
        if not completed_tasks:
            return 0
            
        return round((len(completed_tasks) / len(all_tasks)) * 100)
