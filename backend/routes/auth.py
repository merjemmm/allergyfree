"""allergyfree backend accounts view and methods."""
from flask import Blueprint, jsonify, request, make_response, session
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
    resp = jsonify(username=current_user.username)
    # --- never cache this endpoint ---
    resp.headers["Cache-Control"] = "no-store, must-revalidate"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    return resp, 200


# curl -X POST http://127.0.0.1:5000/api/accounts/login \
#       -H 'Content-Type: application/json' \
#         -d '{"username" : "merm", "password" : "abcd"}'

@auth_bp.route('/login', methods=["POST"])
def handle_login():
    """Handle logging in."""
    data = request.get_json()  # get the JSON body
    username = data.get("username")
    password = data.get("password")

    # If the username or password fields are empty, return an error
    if not username or not password:
        return jsonify({"status" : "fail",
                        "message" : "Missing username or password"}), 403

    user = User.query.filter_by(username=username).first()
    if user is None or not check_password_hash(user.password, password):
        return jsonify({"status": "fail", 
                        "message": "Invalid username or password"}), 403

    login_user(user, remember=True)

    return jsonify({"status": "success", 
                    "message": "Logged in successfully"}), 200


# curl -X POST http://127.0.0.1:5000/api/accounts/create \
#       -H 'Content-Type: application/json' \
#       -d '{ "fullname" : "Mer Jem", "username" : "merm", "password" : "abcd", "email" : "merm@gmail.com" }'

@auth_bp.route('/create', methods=["POST"])
def handle_create():
    """Handle creating account."""
    data = request.get_json()  # get the JSON body
    username = data.get("username")
    password = data.get("password")
    fullname = data.get("name")
    
    print("USERNAME : ", username, " PASSWORD: ", password, "NAME : ", fullname)

    if not username or not password or not fullname:
        return jsonify({"status": "fail", 
                        "message": "Missing required fields"}), 400

    print("ALSO CURR : ", User.query.filter_by(username=username).first())
    if User.query.filter_by(username=username).first():
        return jsonify({"status": "fail", 
                        "message": "User already exists"}), 409
    

    hashed_password = generate_password_hash(password)
    user = User(username=username, fullname=fullname, password=hashed_password)

    login_user(user, remember=True)
    
    db.session.add(user)
    db.session.commit()

    return jsonify({"status": "success", 
                    "message": "User created successfully"}), 200


@auth_bp.route('/logout', methods=["POST"])
@login_required
def handle_logout():
    logout_user()
    # the below should all be part of ensuring username isn't cached
    session.pop('_user_id', None)   # just to be sure
    session.modified = True
    session.clear()
    resp = make_response(jsonify(
        {"status": "success"}), 200)
    # 3. kill the "remember me" cookie immediately
    resp.set_cookie('remember_token', '', 
                    expires=0, 
                    httponly=True, 
                    path='/',
                    domain=None,              # match whatever we set in config
                    secure=True,              # True because we use HTTPS for BE
                    samesite='None')
    # tell flask-login to forget immediately
    session['_remember'] = 'clear'
    session.modified = True
    print(resp)
    return resp


@auth_bp.route('/delete', methods=["DELETE"])
def handle_delete():
    """Display /accounts/delete/ route."""
    user = current_user
    db.session.delete(user)
    db.session.commit()
    logout_user()
    return jsonify({"status": "success", 
                    "message": "User deleted successfully"}), 200


# will we need this?
@auth_bp.route('/<string:username>/', methods=["GET"])
def get_user(username):
    """Display /accounts/delete/ route."""
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"status": "fail", 
                        "message": "User not found"}), 404
    data = {
        "username": user.username,
        "fullname": user.fullname,
    }
    return jsonify({"status": "success", 
                    "message": "User retrieved successfully",
                    "data": data}), 200