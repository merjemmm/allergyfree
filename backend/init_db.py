# backend/init_db.py
from backend import create_app, db
import os

def init_db(db_path="backend/curr_db/app.db"):
    app = create_app()
    db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace("sqlite:///", "")

    # make sure dir exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    with app.app_context():
        db.create_all()
        print(f"Database initialized at {db_path}")

if __name__ == "__main__":
    init_db()
