"""allergyfree backend for journal page"""
import flask
from flask import Blueprint, jsonify

journal_bp = Blueprint("auth", __name__)


@journal_bp.route('/api/journal/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})


@journal_bp.route('/api/journal', methods=['GET'])
def get_journal():
    # Return all journal entries for a person

    # Responses:
    # Success, none
    # Success, some
    # Fail
    
    return jsonify({"status": "success"})


@journal_bp.route('/api/journal/today', methods=['POST'])
def get_journal():
    # Return only entries for today for teh user, 

    # Responses:
    # Success
    # Fail
    
    return jsonify({"status": "success"})


@journal_bp.route('/api/journal/addentry', methods=['POST'])
def get_journal():
    # Add new journal entry for a person, another db call

    # Responses:
    # Success
    # Fail
    
    return jsonify({"status": "success"})

