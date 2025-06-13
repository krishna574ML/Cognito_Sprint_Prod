from app import db
from ..models.activity import Activity

def log_activity(text, project_id, user_id):
    """Helper function to create and save an activity log."""
    activity = Activity(
        text=text,
        project_id=project_id,
        user_id=user_id
    )
    db.session.add(activity)
    # The session is committed by the calling route function to ensure all
    # operations in a request succeed or fail together.
