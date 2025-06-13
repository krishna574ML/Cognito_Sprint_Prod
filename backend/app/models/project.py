from app import db

# This association table enables the many-to-many relationship.
project_members = db.Table('project_members',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True)
)

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.String(50), nullable=False, default='Medium')
    due_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='To Do')
    lead_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    tasks = db.relationship('Task', back_populates='project', lazy='dynamic', cascade="all, delete-orphan")
    
    # Use back_populates to explicitly link to the 'led_projects' relationship on the User model.
    lead = db.relationship('User', foreign_keys=[lead_id], back_populates='led_projects')

    # Use back_populates to explicitly link to the 'assigned_projects' relationship on the User model.
    members = db.relationship('User', secondary='project_members', back_populates='assigned_projects')

