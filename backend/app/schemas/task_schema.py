from app import ma
from ..models.task import Task
# Import UserSchema to nest it
from .user_schema import UserSchema

class TaskSchema(ma.SQLAlchemyAutoSchema):
    # Nest the UserSchema to include the assignee's details
    assignee = ma.Nested(UserSchema, dump_only=True)

    class Meta:
        model = Task
        load_instance = True
        # Include foreign keys in the serialized output
        include_fk = True
