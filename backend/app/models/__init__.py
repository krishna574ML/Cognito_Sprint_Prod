from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from config import Config

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()
ma = Marshmallow()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    ma.init_app(app)
    CORS(app)

    with app.app_context():
        # This line is now corrected to import the original models
        from .models import user, project, task

        from .api.auth_routes import auth_bp
        from .api.project_routes import project_bp
        from .api.task_routes import task_bp

        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(project_bp, url_prefix='/api')
        app.register_blueprint(task_bp, url_prefix='/api')

    return app
