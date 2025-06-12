from app import ma
from ..models.project import Project
from .task_schema import TaskSchema

class ProjectSchema(ma.SQLAlchemyAutoSchema):
    tasks = ma.Nested(TaskSchema, many=True)
    class Meta:
        model = Project
        load_instance = True
