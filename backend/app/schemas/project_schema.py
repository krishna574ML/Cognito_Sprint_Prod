from app import ma
from ..models.project import Project

class ProjectSchema(ma.SQLAlchemyAutoSchema):
    tasks = ma.Nested('TaskSchema', many=True, dump_only=True)
    lead = ma.Nested('UserSchema', dump_only=True)
    members = ma.Nested('UserSchema', many=True, dump_only=True)
    progress = ma.Method(serialize="get_progress")

    class Meta:
        model = Project
        load_instance = True
        include_fk = True

    def get_progress(self, obj):
        try:
            all_tasks = obj.tasks
            if not all_tasks: return 0
            total_tasks = len(all_tasks)
            if total_tasks == 0: return 0
            completed_tasks = len([task for task in all_tasks if task.completed])
            return round((completed_tasks / total_tasks) * 100)
        except Exception:
            return 0
