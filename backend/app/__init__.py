import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
ma = Marshmallow()
bcrypt = Bcrypt()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()

def create_app(config_class='config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, supports_credentials=True)
    jwt.init_app(app)

    with app.app_context():
        from .models import user, project, task, activity
        
        from .api.auth_routes import auth_bp
        from .api.project_routes import project_bp
        from .api.task_routes import task_bp
        from .api.user_routes import user_bp

        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(project_bp, url_prefix='/api/projects')
        app.register_blueprint(task_bp, url_prefix='/api/tasks')
        app.register_blueprint(user_bp, url_prefix='/api/users')

        return app
