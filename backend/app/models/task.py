from app import db

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    
    # Existing fields
    title = db.Column(db.String(255), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    assignee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    # --- IGNITION UPGRADE ---
    # New fields to store data for "Subtask Experiments"
    hypothesis = db.Column(db.Text, nullable=True)
    method = db.Column(db.Text, nullable=True)
    expected_output = db.Column(db.Text, nullable=True)
    risk_level = db.Column(db.String(50), nullable=True) # e.g., 'High Risk / High Reward'
    # --- END UPGRADE ---

    project = db.relationship('Project', back_populates='experiments')
    assignee = db.relationship('User', back_populates='tasks')
