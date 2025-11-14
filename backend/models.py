from backend import db
from flask_login import UserMixin
from backend import login_manager

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    fullname = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    created = db.Column(db.DateTime)

    def get_id(self):
        return str(self.id)

class Restaurant(db.Model):
    __tablename__ = 'restaurants'
    restid = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(64))
    name = db.Column(db.String(64))
    adder = db.Column(db.String(64), db.ForeignKey('users.username'))
    user = db.relationship('User')
    goodexp = db.Column(db.Boolean)
    created = db.Column(db.DateTime)

class Symptom(db.Model):
    __tablename__ = 'symptoms'
    id = db.Column(db.Integer, primary_key=True)
    adder = db.Column(db.String(64), db.ForeignKey('users.username'))
    user = db.relationship('User')
    date = db.Column(db.DateTime)
    year = db.Column(db.Integer)
    month = db.Column(db.Integer)
    day = db.Column(db.Integer)
    type = db.Column(db.String(64))
    notes = db.Column(db.String(200))
    symptom = db.Column(db.String(20))

class SymptomCategory(db.Model):
    __tablename__ = 'symptomCategories'
    id = db.Column(db.Integer, primary_key=True)
    adder = db.Column(db.String(64), db.ForeignKey('users.username'))
    user = db.relationship('User')
    symptom = db.Column(db.String(20))
    type = db.Column(db.String(64))

class Journal(db.Model):
    __tablename__ = 'journal'
    id = db.Column(db.Integer, primary_key=True)
    adder = db.Column(db.String(64), db.ForeignKey('users.username'))
    user = db.relationship('User')
    created = db.Column(db.DateTime)
    meal = db.Column(db.String(64))
    name = db.Column(db.String(20))
