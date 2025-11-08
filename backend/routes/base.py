# routes/base.py
# this mean to mass return database data for testing purposes 
from backend.model import get_db
import sqlite3
from flask import Blueprint, jsonify, session, request
from werkzeug.security import generate_password_hash, check_password_hash

base_bp = Blueprint("base", __name__)

@base_bp.route('/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})


# curl -X GET http://127.0.0.1:5000/api/base/users
@base_bp.route('/users', methods=["GET"])
def get_users():
    """Display /accounts/delete/ route."""
    conn = get_db()
    exis_user = conn.execute(
        """
        SELECT *
        FROM users
        
        """,
    ).fetchall()
    
    conn.close()

    return jsonify({"status" : "success",
                    "message" : "All users retrieved successfully",
                    "statusCode" : 200,
                    "data" : exis_user})
    

@base_bp.route('/restaurants', methods=["GET"])
def get_restaurants():
    """Display /accounts/delete/ route."""
    conn = get_db()
    exis_user = conn.execute(
        """
        SELECT *
        FROM restaurants
        
        """,
    ).fetchall()
    
    conn.close()

    return jsonify({"status" : "success",
                    "message" : "All restaurants retrieved successfully",
                    "statusCode" : 200,
                    "data" : exis_user})