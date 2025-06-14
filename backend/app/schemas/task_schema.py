from app import ma
from ..models.task import Task

class TaskSchema(ma.SQLAlchemyAutoSchema):
    assignee = ma.Nested('UserSchema', dump_only=True)
    class Meta:
        model = Task
        load_instance = True
        include_fk = True
