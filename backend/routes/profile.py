"""allergyfree backend accounts view and methods."""
import pathlib
from backend.models import User, Symptom, SymptomCategory, SymptomLog
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
    adder = data.get('adder')
    category = data.get('category')
    symptom = data.get('symptom')

    if not all([adder, category, symptom]):
        return jsonify({"status": "fail", 
                        "error": "Missing required fields"}), 400

    s = Symptom(adder=current_user.username,
                category=category,
                name=symptom)
    db.session.add(s)
    db.session.commit()

    return jsonify({"status": "success",
                    "message": "Symptom added successfully",
                    "data": [ {"symptom_category": s.symptom_category, 
                               "symptom_name": s.symptom_name, 
                               "date": s.date.isoformat()} ]}), 200

# track occurrence of symptom in symptom logging table
@profile_bp.route('/logsymptom', methods=['POST'])
@login_required
def update_symptom_log():
    data = request.get_json()
    adder = data.get('adder')
    category = data.get('category')
    symptom = data.get('symptom')
    date = data.get('date')
    notes = data.get('notes')

    if not all([adder, category, symptom, date]):
        return jsonify({"status": "fail", 
                        "error": "Missing required fields"}), 400

    # TODO -- probably check format of date here

    s = SymptomLog(adder=current_user.username,
                category=category,
                name=symptom,
                notes=notes,
                date=date)
    db.session.add(s)
    db.session.commit()

    return jsonify({"status": "success",
                    "message": "Symptom logged successfully"}), 200

# add new symptom category to symptomCategory table
@profile_bp.route('/addcategory', methods=['POST'])
@login_required
def add_account_category():
    data = request.get_json()
    category = data.get('category')
    adder = data.get('username')

    if not all([adder, category]):
        return jsonify({"status": "fail", 
                        "error": "Missing required fields"}), 400

    c = SymptomCategory(adder=current_user.username,
                category=category
                )
    db.session.add(c)
    db.session.commit()

    return jsonify({"status": "success",
                    "message": "Category added successfully",
                    "data": [ {"category": c.category} ]}), 200


@profile_bp.route('/edit/password', methods=["POST"])
@login_required
def update_password():
    data = request.get_json()
    
    old_password = data.get('password')
    new_password1 = data.get('newPassword1')
    new_password2 = data.get('newPassword2')

    if not (old_password and new_password1 and new_password2):
        return jsonify({"status": "fail", 
                        "message": "Missing new or old password"}), 400
        
    if new_password1 != new_password2:
        return jsonify({"status": "fail", 
                        "message": "The new passwords don't match"}), 400

    user = User.query.filter_by(username=current_user.username).first()

    if not user:
        return jsonify({"status": "fail", 
                        "message": "User does not exist"}), 403

    if not check_password_hash(user.password, old_password):
        return jsonify({"status": "fail", 
                        "message": "Old password incorrect"}), 403

    user.password = generate_password_hash(new_password1)
    db.session.commit()
    return jsonify({"status": "success", 
                    "message": "Password updated successfully"}), 200
    
    
@profile_bp.route('/edit/username', methods=["POST"])
@login_required
def update_username():
    
    data = request.get_json()
    
    new_username = data.get('newUsername')

    if not (new_username):
        return jsonify({"status": "fail", 
                        "message": "Missing new username"}), 403

    user = User.query.filter_by(username=current_user.username).first()
    if not user:
        return jsonify({"status": "fail", 
                        "message": "User does not exist"}), 403
        
    poss_user = User.query.filter_by(username=new_username).first()
    if poss_user:
        return jsonify({"status": "fail", 
                        "message": "Username already taken"}), 409

    user.username = new_username
    db.session.commit()
    return jsonify({"status": "success", 
                    "message": "Username updated successfully"}), 200
    
    
@profile_bp.route('/edit/fullname', methods=["POST"])
@login_required
def update_fullname():
    data = request.get_json()

    new_fullname = data.get("newName")

    if not new_fullname:
        return jsonify({"status": "fail", 
                        "message": "Missing new fullname"}), 403

    user = User.query.filter_by(username=current_user.username).first()
    if not user:
        return jsonify({"status": "fail", 
                        "message": "User does not exist"}), 403

    user.fullname = new_fullname
    db.session.commit()
    
    return jsonify({"status": "success", 
                    "message": "Fullname updated successfully"}), 200

@profile_bp.route('/symptomcategories', methods=['GET'])
@login_required
def get_categories():
    rows = (db.session.query(SymptomCategory.category)
                    .filter_by(adder=current_user.username)
                    .distinct()
                    .all())
    print('rows:', rows)
    categories = [r.category for r in rows]
    print('categories:', rows)
    return jsonify(categories), 200

