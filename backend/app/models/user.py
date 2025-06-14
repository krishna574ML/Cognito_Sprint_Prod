from app import db, bcrypt

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='regular')

    led_projects = db.relationship('Project', foreign_keys='Project.lead_id', back_populates='lead', lazy=True)
    tasks = db.relationship('Task', back_populates='assignee', lazy=True)
    assigned_projects = db.relationship('Project', secondary='project_members', back_populates='members', lazy=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
