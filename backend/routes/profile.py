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

    # Responses:
    # Add
    # Error
    return jsonify({"status": "ok"})


@profile_bp.route('/api/account/tracking', methods=['POST'])
def add_account_tracking():
    # username, symptom_details
    # Add symptom to db associated with user

    # Responses:
    # Add
    # Error
    
    return jsonify({"status": "ok"})
