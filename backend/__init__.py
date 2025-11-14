"""Allergy Free package initializer."""
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
db = SQLAlchemy()

login_manager = LoginManager()

app = Flask(__name__)
app.config.from_object('backend.config')

if app.debug:
    # disable cors restrictions when on debug mode - dnt remove please
    CORS(app, supports_credentials=True)
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['REMEMBER_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['REMEMBER_COOKIE_SECURE'] = True


# debug -- check filepath for db
print(app.config["SQLALCHEMY_DATABASE_URI"])

# --- init db and login ---
db.init_app(app)
login_manager.init_app(app)

# --- register blueprints ---

from backend.routes import register_routes
register_routes(app)

import backend.models # noqa: E402  pylint: disable=wrong-import-position
import backend.routes
from backend.models import User

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))