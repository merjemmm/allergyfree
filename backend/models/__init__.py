# backend/models/__init__.py
import sqlite3
import backend
from backend.config import *

def init_db():
    db = backend.model.get_db()
    with open("backend/sql/schema.sql", "r") as f:
        db.executescript(f.read())

    # optional: load seed data
    try:
        with open("backend/sql/data.sql", "r") as f:
            db.executescript(f.read())
    except FileNotFoundError:
        pass

    db.commit()
