"""allergyfree backend accounts view and methods."""
from flask import Blueprint, jsonify, request
from backend.models import User
from backend import db
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)

# if logged in, return the user's username
# in theory this should include MUCH more info for verification but
# I'm more focused on just getting it working
@auth_bp.route('/check', methods=["GET"])
@login_required
def check():
    return jsonify({"username": current_user.username}), 200


# curl -X POST http://127.0.0.1:5000/api/accounts/login \
#       -H 'Content-Type: application/json' \
#         -d '{"username" : "merm", "password" : "abcd"}'

@auth_bp.route('/login', methods=["POST"])
def handle_login():
    """Handle logging in."""
    data = request.get_json()  # get the JSON body
    username = data.get("username")
    password = data.get("password")

    # If the username or password fields are empty, abort(400)
    if not username or not password:
        return jsonify({"status" : "fail",
                        "message" : "Missing username or password",
                        "statusCode" : 403 })

    user = User.query.filter_by(username=username).first()
    if user is None or not check_password_hash(user.password, password):
        return jsonify({"status": "fail", 
                        "message": "Invalid username or password", 
                        "statusCode": 403})

    return jsonify({"status": "success", 
                    "message": "Logged in successfully", 
                    "statusCode": 200})


# curl -X POST http://127.0.0.1:5000/api/accounts/create \
#       -H 'Content-Type: application/json' \
#       -d '{ "fullname" : "Mer Jem", "username" : "merm", "password" : "abcd", "email" : "merm@gmail.com" }'

@auth_bp.route('/create', methods=["POST"])
def handle_create():
    """Handle creating account."""
    data = request.get_json()  # get the JSON body
    username = data.get("username")
    password = data.get("password")
    fullname = data.get("fullname")

    if not username or not password or not fullname:
        return jsonify({"status": "fail", 
                        "message": "Missing required fields", 
                        "statusCode": 400})

    if User.query.filter_by(username=username).first():
        return jsonify({"status": "fail", 
                        "message": "User already exists", 
                        "statusCode": 409})
    

    hashed_password = generate_password_hash(password)
    user = User(username=username, fullname=fullname, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"status": "success", 
                    "message": "User created successfully", 
                    "statusCode": 200})


# note: still need to implement this in profile
@auth_bp.route('/logout', methods=["POST"])
@login_required
def handle_logout():
    logout_user()
    return jsonify({"status": "success", 
                    "message": "Logged out successfully", 
                    "statusCode": 200})



@auth_bp.route('/delete', methods=["DELETE"])
def handle_delete():
    """Display /accounts/delete/ route."""
    user = current_user
    db.session.delete(user)
    db.session.commit()
    logout_user()
    return jsonify({"status": "success", 
                    "message": "User deleted successfully", 
                    "statusCode": 200})


# will we need this?
@auth_bp.route('/<string:username>/', methods=["GET"])
def get_user(username):
    """Display /accounts/delete/ route."""
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"status": "fail", 
                        "message": "User not found", 
                        "statusCode": 404})
    data = {
        "username": user.username,
        "fullname": user.fullname,
    }
    return jsonify({"status": "success", 
                    "message": "User retrieved successfully", 
                    "statusCode": 200, "data": data})