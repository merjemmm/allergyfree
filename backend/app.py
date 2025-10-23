# backend/app.py
from flask import Flask
from flask_cors import CORS
from backend.database import init_db
from backend.routes import register_routes

def create_app():
    app = Flask(__name__)
    CORS(app)
    register_routes(app)

    # Create database tables on startup
    init_db()

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)

