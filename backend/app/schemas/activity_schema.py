from app import ma
from ..models.activity import Activity
from .user_schema import UserSchema

class ActivitySchema(ma.SQLAlchemyAutoSchema):
    # Nest the user schema to include details of the user who performed the action
    user = ma.Nested(UserSchema, dump_only=True)

    class Meta:
        model = Activity
        load_instance = True
        include_fk = True
