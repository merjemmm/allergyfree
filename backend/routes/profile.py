"""allergyfree backend accounts view and methods."""
import pathlib
from backend.models import User, Symptom, SymptomCategory, SymptomLog
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from backend import db
from datetime import datetime

# these are the default symptoms initially included for each user
# they can later add/remove these
# Default categories + symptoms that every new user starts with
DEFAULT_SYMPTOMS = {
    "Dermatological": ["Swelling", "Hives", "Itchiness", "Rash", "Numbness"],
    "Respiratory": ["Sneezing Fit", "Throat Tightness", "Congestion", "Coughing"],
    "Musculoskeletal": ["Joint Pain", "Muscle Ache", "Cramping", "Limb Weakness"],
    "Mental / Cognitive": ["Brain Fog", "Irritability", "Dizziness", "Headache", "Anxiety", "Fatigue"],
    "GI / Intestinal": ["Acid Reflux", "Bloating", "Vomiting", "Nausea"],
}

profile_bp = Blueprint("profile", __name__)

# add new symptom to symptom table
@profile_bp.route('/addsymptom', methods=['POST'])
@login_required
def add_account_symptom():
    data = request.get_json()
    category = data.get('category')
    symptom = data.get('symptom')

    if not all([category, symptom]):
        return jsonify({"status": "fail", 
                        "error": "Missing required fields"}), 400

    s = Symptom(
        adder=current_user.username,
        category=category,
        symptom=symptom
    )
    db.session.add(s)
    db.session.commit()

    
    return jsonify({
        "status": "success",
        "message": "Symptom added successfully",
        "data": [{
            "symptom_category": s.category,
            "symptom_name": s.symptom,
        }]
    }), 200

# remove symptoms once the user decides to toggle any off
@profile_bp.route('/removesymptom', methods=['POST'])
@login_required
def remove_account_symptom():
    """
    Removes a symptom from the current user's tracked list.
    Used when the user toggles a pill OFF in the profile UI.
    """
    data = request.get_json()
    category = data.get('category')
    symptom = data.get('symptom')

    if not all([category, symptom]):
        return jsonify({"status": "fail",
                        "error": "Missing required fields"}), 400

    #  Delete all matching rows for this user, just in case duplicates exist
    Symptom.query.filter_by(
        adder=current_user.username,
        category=category,
        symptom=symptom
    ).delete()

    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Symptom removed successfully"
    }), 200

# add new symptom category to symptomCategory table
@profile_bp.route('/addcategory', methods=['POST'])
@login_required
def add_account_category():
    data = request.get_json()
    category = data.get('category')

    if not category:
        return jsonify({
            "status": "fail",
            "error": "Missing category"
        }), 400

    c = SymptomCategory(
        adder=current_user.username,
        category=category
    )
    db.session.add(c)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Category added successfully",
        "data": [{"category": c.category}]
    }), 200


@profile_bp.route('/edit/password', methods=["POST"])
@login_required
def update_password():
    data = request.get_json()
    
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    if not (old_password and new_password):
        return jsonify({"status": "fail", 
                        "message": "Missing new or old password"}), 400

    user = User.query.filter_by(username=current_user.username).first()

    if not user:
        print("user does not exist")
        return jsonify({"status": "fail", 
                        "message": "User does not exist"}), 403

    if not check_password_hash(user.password, old_password):
        print("passwords don't match")
        return jsonify({"status": "fail", 
                        "message": "Old password incorrect"}), 403

    user.password = generate_password_hash(new_password)
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

# GET the categories of symptoms
@profile_bp.route('/symptomcategories', methods=['GET'])
@login_required
def get_categories():
    rows = (
        db.session.query(SymptomCategory.category)
        .filter_by(adder=current_user.username)
        .distinct()
        .all()
    )

    categories = [r.category for r in rows]

    return jsonify(categories), 200


# GET that seeds defaults once per user 
# retrieve symptoms
@profile_bp.route('/symptoms', methods=['GET'])
@login_required
def get_symptoms():
    """
    Returns all symptoms for current user.
    If the user has none yet, seed them with DEFAULT_SYMPTOMS.
    """
    existing = Symptom.query.filter_by(adder=current_user.username).all()

    if not existing:
        # seed default categories + symptoms
        for category, names in DEFAULT_SYMPTOMS.items():
            # ensure category row
            cat_row = SymptomCategory(
                adder=current_user.username,
                category=category
            )
            db.session.add(cat_row)

            for name in names:
                s = Symptom(
                    adder=current_user.username,
                    category=category,
                    symptom=name
                )
                db.session.add(s)

        db.session.commit()
        existing = Symptom.query.filter_by(adder=current_user.username).all()

    def symptom_to_dict(s):
        return {
            "id": s.id,
            "symptom_category": s.category,
            "symptom_name": s.symptom,
        }

    return jsonify({
        "status": "success",
        "data": [symptom_to_dict(s) for s in existing]
    }), 200

# returns user's Full Name to be displayed on profile
@profile_bp.route('/fullname', methods=['GET'])
@login_required
def get_fullname():
    user = User.query.filter_by(username=current_user.username).first()
    return jsonify({"fullname": user.fullname}), 200