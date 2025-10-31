"""allergyfree backend accounts view and methods."""
import hashlib
import uuid
import pathlib
import flask
from flask import Blueprint, jsonify

profile_bp = Blueprint("auth", __name__)

@profile_bp.route('/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})


@profile_bp.route('/api/account/addsymptom', methods=['POST'])
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
    
    
@profile_bp.route('/api/profile/edit', methods=['POST']) 
def edit_profile():
    # Edit current data saved for a user’s base profile
    # {"changeType" : password/fullname/username,
    # "New value" : value }

    if True:
        return jsonify({"status" : "fail",
                        "error" :"Username taken",
                        "statusCode" : 400 })

    return jsonify({"status" : "success",
                    "message" : "Account updated successfully",
                    "statusCode" : 200 })


@profile_bp.route('/api/account/tracking', methods=['POST'])
def add_account_tracking():
    # username, symptom_details
    # Add symptom to db associated with user

    # Responses:
    # Add
    # Error
    
    return jsonify({"status": "ok"})
