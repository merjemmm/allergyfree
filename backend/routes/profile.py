"""allergyfree backend accounts view and methods."""
import hashlib
import uuid
import pathlib
import flask
from flask import Blueprint, jsonify

profile_bp = Blueprint("profile", __name__)

@profile_bp.route('/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})


@profile_bp.route('/addsymptom', methods=['POST'])
def add_account_symptom():
    # username, symptom_details
    # Add symptom to db associated with user
    
    # {“symptomCatergory” : GI/Mental/Muscoskeletal/Respitory/dermatological,
    # “symtpomName” : name 
    # “Date” : date } 

    
    if True:
        return jsonify({ "status" : "fail",
                        "error" : "Account setup incomplete",
                        "Status code" : 403})
    

    return jsonify({ "status" : "success",
                    "message" : "Account created successfully",
                    "statusCode" : 200,
                    "data" : [symptoms]})
    


# TODO - split into two apis
# OR combine all into one and check what is different
@auth_bp.route('/edit/notpassword', methods=["POST"])
def handle_edit_account():
    """Display /accounts/edit/ route."""
    if 'username' not in flask.session:
        return jsonify({"status" : "fail",
                        "message" : "No current user",
                        "statusCode" : 403 })

    else:
        data = request.get_json()  # get the JSON body
        username = data.get("username")
        fullname = data.get('fullname')
        email = data.get('email')

        if not (fullname or email):
            return jsonify({"status" : "fail",
                            "message" : "Missing fullname or email",
                            "statusCode" : 400 })

        connection = get_db()
        connection.execute(
            """
            UPDATE users
            SET fullname = ?, email = ?
            WHERE username = ?
            """,
            (fullname, email, username)
        )
        connection.commit()

        return jsonify({"status" : "success",
                        "message" : "User edited successfully",
                        "statusCode" : 200 })


@auth_bp.route('/edit/password', methods=["POST"])
def handle_update_password():
    """Update user password."""
    if 'username' not in flask.session:
        return jsonify({"status" : "fail",
                        "message" : "No current user",
                        "statusCode" : 403 })

    else:
        data = request.get_json()  # get the JSON body
        username = data.get("username")

        new_password1 = data.get('new_password1')
        new_password2 = data.get('new_password2')
        old_password = data.get('password')

        if not new_password1 or not new_password2 or not old_password:
            return jsonify({"status" : "fail",
                            "message" : "Missing new password or old password",
                            "statusCode" : 400 })

        if new_password1 != new_password2:
            return jsonify({"status" : "fail",
                            "message" : "The new passwords don't match",
                            "statusCode" : 400 })

        # compare old password to currently stored password
        connection = get_db()
        user_pass = connection.execute(
            """
            SELECT password
            FROM users
            WHERE username = ?
            """,
            (username, )
        )
        user_pass = user_pass.fetchone()['password']

        # ie. the username dne:
        if not user_pass:
            return jsonify({"status" : "fail",
                            "message" : "User does not exist",
                            "statusCode" : 403 })
    
        # comapre associated hashed password with the input
        if not check_password_hash(user_pass['password'], password):
            return jsonify({"status" : "fail",
                        "message" : "Passwords don't match",
                        "statusCode" : 403 })

        password_hash = generate_password_hash(password)
        connection.execute(
            """
            UPDATE users
            SET password = ?
            WHERE username = ?
            """,
            (password_hash, username)
        )

        connection.commit()

    return jsonify({"status" : "success",
                    "message" : "Password updated successfully",
                    "statusCode" : 200 })


# @profile_bp.route('/edit', methods=['POST']) 
# def edit_profile():
#     # Edit current data saved for a user’s base profile
#     # {"changeType" : password/fullname/username,
#     # "New value" : value }

#     if True:
#         return jsonify({"status" : "fail",
#                         "error" :"Username taken",
#                         "statusCode" : 400 })

#     return jsonify({"status" : "success",
#                     "message" : "Account updated successfully",
#                     "statusCode" : 200 })


@profile_bp.route('/api/account/tracking', methods=['POST'])
def add_account_tracking():
    # username, symptom_details
    # Add symptom to db associated with user

    # Responses:
    # Add
    # Error
    
    return jsonify({"status": "ok"})
