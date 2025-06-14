from app import db

project_members = db.Table('project_members',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True)
)

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    
    # --- IGNITION UPGRADE ---
    # Replaced 'description' with more purposeful fields for both creation flows.
    goal = db.Column(db.Text, nullable=True) # Will store 'goal' from Ignition or 'description' from Quick Form
    rough_ideas_dump = db.Column(db.Text, nullable=True) # From "Rough Ideas Dump"
    emotional_tag = db.Column(db.String(50), nullable=True) # From "Feels Like..."
    # --- END UPGRADE ---
    
    priority = db.Column(db.String(50), nullable=False, default='Medium')
    due_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='To Do')
    lead_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    # Renamed for clarity, this will hold our "Subtask Experiments"
    experiments = db.relationship('Task', back_populates='project', lazy=True, cascade="all, delete-orphan")
    
    lead = db.relationship('User', foreign_keys=[lead_id], back_populates='led_projects')
    members = db.relationship('User', secondary=project_members, back_populates='assigned_projects')
