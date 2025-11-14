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


@profile_bp.route('/edit/password', methods=["POST"])
@login_required
def update_password():

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
    
    
@profile_bp.route('/edit/username', methods=["POST"])
@login_required
def update_username():
    
    data = request.get_json()
    
    new_username = data.get('new_username')

    if not (new_username):
        return jsonify({"status": "fail", 
                        "message": "Missing new username", 
                        "statusCode": 400})

    user = User.query.filter_by(username=current_user.username).first()
    if not user:
        return jsonify({"status": "fail", 
                        "message": "User does not exist", 
                        "statusCode": 403})
        
    poss_user = User.query.filter_by(username=new_username).first()
    if poss_user:
        return jsonify({"status": "fail", 
                        "message": "Username already taken", 
                        "statusCode": 403})

    user.username = new_username
    db.session.commit()
    return jsonify({"status": "success", 
                    "message": "Username updated successfully", 
                    "statusCode": 200})
    
    
@profile_bp.route('/edit/fullname', methods=["POST"])
@login_required
def update_fullname():
    
    data = request.get_json()

    new_fullname = data.get("new_fullname")

    if not new_fullname:
        return jsonify({"status": "fail", 
                        "message": "Missing new fullname", 
                        "statusCode": 400})

    user = User.query.filter_by(username=current_user.username).first()
    if not user:
        return jsonify({"status": "fail", 
                        "message": "User does not exist", 
                        "statusCode": 403})

    user.fullname = new_fullname
    db.session.commit()
    
    return jsonify({"status": "success", 
                    "message": "Fullname updated successfully", 
                    "statusCode": 200})