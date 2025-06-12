from app import db
from sqlalchemy.sql import func

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.String(50), nullable=False, default='Medium')
    due_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='To Do')

    # --- This section has been added/corrected ---
    # Foreign Key to link to the User table
    lead_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    # Relationships
    lead = db.relationship('User', back_populates='led_projects')
    tasks = db.relationship('Task', back_populates='project', lazy='dynamic', cascade="all, delete-orphan")
