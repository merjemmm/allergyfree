"""allergyfree backend accounts view and methods."""
import hashlib
import uuid
import pathlib
from backend.model import get_db
import sqlite3
from flask import Blueprint, jsonify, session, request
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})

# @auth_bp.route('/api/accounts/auth/', methods=['GET'])
# def auth():
#     """Check authentication."""
#     if 'username' in flask.session:
#         return jsonify({"status": "ok"})

#     return jsonify({"status": "error", "response" : 403})

# @auth_bp.route('/api/accounts/', methods=["POST"])
# def accounts():
#     """Accounts Post Routes."""
#     if flask.request.form.get('operation') == 'login':
#         return handle_login()

#     if flask.request.form.get('operation') == 'create':
#         return handle_create()

#     if flask.request.form.get('operation') == 'delete':
#         return handle_delete()

#     if flask.request.form.get('operation') == 'edit_account':
#         return handle_edit_account()

#     return handle_update_password()

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

    # If username and password authentication fails, abort(403)
    # hash this password, compare to user_pass
    connection = get_db()
    user_pass = connection.execute(
        """
        SELECT password
        FROM users
        WHERE username = ?
        """,
        (username, )
    ).fetchone()
    
    if user_pass is None:
        return jsonify({"status" : "fail",
                        "message" : "Username does not exist",
                        "statusCode" : 403 })
    
    # comapre associated hashed password with the input
    if not check_password_hash(user_pass['password'], password):
        return jsonify({"status" : "fail",
                        "message" : "Incorrect password",
                        "statusCode" : 403 })

    # set session username
    session["username"] = username

    return jsonify({ "status" : "success",
                    "message" : "Logged in successfully",
                    "statusCode" : 200 })


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
    email = data.get("email")
    
    if (
        not username
        or not password
        or not fullname
        or not email
    ):
        return jsonify({"status" : "fail",
                        "message" : "Missing username or password",
                        "statusCode" : 400 })

    conn = get_db()
    exis_user = conn.execute(
        """
        SELECT 1
        FROM users
        WHERE username = ?
        """,
        (username, )
    ).fetchone()

    if exis_user:
        return jsonify({"status" : "fail",
                        "message" : "User already exists",
                        "statusCode" : 409 })

    # created the hash automatically instead of before with manual calc
    password_hash = generate_password_hash(password)
    try:
        conn.execute(
            "INSERT INTO users (username, fullname, email, password) VALUES (?, ?, ?, ?)",
            (username, fullname, email, password_hash),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        # same as above, so keep one
        return jsonify({"status" : "fail",
                        "message" : "User already exists",
                        "statusCode" : 409 })

    conn.close()
    return jsonify({"status" : "success",
                    "message" : "User created successfully",
                    "statusCode" : 200 })


@auth_bp.route('/delete', methods=["POST"])
def handle_delete():
    """Display /accounts/delete/ route."""
    if 'username' not in flask.session:
        # this means the user isn't logged in so we should abort
        return jsonify({"status" : "fail",
                        "message" : "No current user",
                        "statusCode" : 403 })

    else:
        data = request.get_json()  # get the JSON body
        username = data.get("username")

        connection = get_db()

        connection.execute(
            """
            DELETE FROM users
            WHERE username = ?
            """,
            (username, )
        )
        connection.commit()

        flask.session.clear()
        # flask.session.pop('username', None)
        connection.close()
       
    return jsonify({"status" : "success",
                    "message" : "User deleted successfully",
                    "statusCode" : 200 })
    
    