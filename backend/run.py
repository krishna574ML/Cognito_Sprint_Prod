# Only import the factory function at the top level
from app import create_app

app = create_app()

# The shell context processor is a function that registers extra variables for the 'flask shell' command.
# By importing the models here, we avoid the circular dependency during startup.
@app.shell_context_processor
def make_shell_context():
    from app import db
    from app.models.user import User
    from app.models.project import Project
    from app.models.task import Task
    return {'db': db, 'User': User, 'Project': Project, 'Task': Task}