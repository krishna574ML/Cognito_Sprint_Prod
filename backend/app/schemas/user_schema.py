from app import ma
from ..models.user import User

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        # Exclude password and also the projects assigned to the user
        # to prevent infinite nesting when this schema is used inside ProjectSchema.
        exclude = ("password_hash", "assigned_projects", "led_projects")
