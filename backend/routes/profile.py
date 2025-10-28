"""allergyfree backend accounts view and methods."""
import hashlib
import uuid
import pathlib
import flask
from flask import Blueprint, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})

