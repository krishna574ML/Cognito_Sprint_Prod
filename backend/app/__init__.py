import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Initialize extensions
db = SQLAlchemy()
ma = Marshmallow()
bcrypt = Bcrypt()
migrate = Migrate()

def create_app(config_class='config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'your-super-secret-key-for-dev')

    # Initialize CORS on the entire app for debugging.
    CORS(app, supports_credentials=True)

    # Initialize extensions with app
    db.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)

    # Import all models here to ensure they are registered with SQLAlchemy
    from .models import user, project, task, activity

    # Import and register blueprints with standardized URL prefixes
    from .api.project_routes import project_bp
    from .api.task_routes import task_bp
    from .api.auth_routes import auth_bp
    from .api.user_routes import user_bp

    # --- THIS IS THE FIX ---
    # Registering each blueprint under the '/api' prefix ensures consistent routing.
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(project_bp, url_prefix='/api/projects')
    app.register_blueprint(task_bp, url_prefix='/api') # For routes like /api/tasks/:id
    app.register_blueprint(user_bp, url_prefix='/api/users')
    # --- END FIX ---

    return app
