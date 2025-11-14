"""allergyfree backend accounts view and methods."""
import pathlib
from backend.models import User, Symptom, SymptomCategory
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from backend import db
from datetime import datetime


profile_bp = Blueprint("profile", __name__)

# add new symptom to symptom table
@profile_bp.route('/addsymptom', methods=['POST'])
@login_required
def add_account_symptom():
    data = request.get_json()
    category = data.get('category')
    adder = data.get('adder')
    type = data.get('type')
    notes = data.get('notes')
    symptom = data.get('symptom')
    date_str = data.get('created')

    if not all([adder, category, symptom, date_str, type]):
        return jsonify({"status": "fail", 
                        "error": "Missing required fields", 
                        "statusCode": 400})

    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except Exception:
        return jsonify({"status": "fail", 
                        "error": "Invalid date format", 
                        "statusCode": 400})

    s = Symptom(adder=current_user.username,
                category=category,
                name=symptom,
                type=type,
                notes=notes,
                date=date)
    db.session.add(s)
    db.session.commit()

    return jsonify({"status": "success",
                    "message": "Symptom added successfully",
                    "statusCode": 200,
                    "data": [ {"symptom_category": s.symptom_category, 
                               "symptom_name": s.symptom_name, 
                               "date": s.date.isoformat()} ]})


# TODO - split into two apis
# OR combine all into one and check what is different
# note from matt: all I did was SQLAlchemy-ify this idk about structure

@profile_bp.route('/edit', methods=["POST"])
@login_required
def handle_edit_account():
    data = request.get_json()
    edit_type = data.get("editType")
    user = User.query.filter_by(username=current_user.username).first()
    if not user:
        return jsonify({"status": "fail", 
                        "message": "User not found", 
                        "statusCode": 404})

    # Separate logic for password/fullname/email change
    if edit_type == "password":
        return update_password(data)
    elif edit_type == "fullname":
        new_fullname = data.get("fullname")
        if not new_fullname:
            return jsonify({"status": "fail", 
                            "message": "Missing fullname", 
                            "statusCode": 400})
        user.fullname = new_fullname
    elif edit_type == "email":
        new_email = data.get("email")
        if not new_email:
            return jsonify({"status": "fail", 
                            "message": "Missing email", 
                            "statusCode": 400})
        user.email = new_email
    else:
        return jsonify({"status": "fail", 
                        "message": "Invalid editType", 
                        "statusCode": 400})

    db.session.commit()
    return jsonify({"status": "success", 
                    "message": "User edited successfully", 
                    "statusCode": 200})

@profile_bp.route('/edit/password', methods=["POST"])
@login_required
def update_password(data=None):
    if data is None:
        data = request.get_json()

    old_password = data.get('password')
    new_password1 = data.get('new_password1')
    new_password2 = data.get('new_password2')

    if not (old_password and new_password1 and new_password2):
        return jsonify({"status": "fail", 
                        "message": "Missing new or old password", 
                        "statusCode": 400})
    if new_password1 != new_password2:
        return jsonify({"status": "fail", 
                        "message": "The new passwords don't match", 
                        "statusCode": 400})

    user = User.query.filter_by(username=current_user.username).first()
    if not user:
        return jsonify({"status": "fail", 
                        "message": "User does not exist", 
                        "statusCode": 403})

    if not check_password_hash(user.password, old_password):
        return jsonify({"status": "fail", 
                        "message": "Old password incorrect", 
                        "statusCode": 403})

    user.password = generate_password_hash(new_password1)
    db.session.commit()
    return jsonify({"status": "success", 
                    "message": "Password updated successfully", 
                    "statusCode": 200})