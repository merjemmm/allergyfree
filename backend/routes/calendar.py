"""allergyfree backend for calendar page"""
import flask
from flask import Blueprint, jsonify

calendar_bp = Blueprint("auth", __name__)


@calendar_bp.route('/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})


@calendar_bp.route('/', methods=['GET'])
def get_journal():
    # Return all entries by day, idk how much of this backend vs frontend honestly

    # Responses:
    # Success
    # Fail
    
    return jsonify({"status": "success"})

