from app import db

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
    lead = db.relationship('User', back_populates='led_projects')
