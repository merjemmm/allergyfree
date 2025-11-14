"""allergyfree backend for calendar page"""
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from backend.models import Symptom
from datetime import datetime

calendar_bp = Blueprint("calendar", __name__)


@calendar_bp.route('/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})

@calendar_bp.route('/entries')
@login_required
def get_entries():

    # Get month, year, day from query params
    day = request.args.get("day", default=None, type=int)
    month = request.args.get("month", default=None, type=int)
    year = request.args.get("year", default=None, type=int)
    
    if not month:
        return jsonify({ "status": "error", 
                        "error": "month query is empty", 
                        "statusCode": 403})
        
    if not year:
        year = datetime.now().year

    # Use current_user if user is logged in
    if hasattr(current_user, 'username'):
        username = current_user.username
    
    # query
    query = Symptom.query.filter_by(adder=username, year=year, month=month)
    if day:
        query = query.filter_by(day=day)
    calendar_entries = query.all()

    # convert to dicts for JSON response
    def symptom_to_dict(sym):
        return {
            "id": sym.id,
            "user": sym.user,
            "symptom": sym.symptom,
            "type": sym.type
        }
    entries_json = [symptom_to_dict(s) for s in calendar_entries]
    

    # TODO - format the outries

    return jsonify({
        "status": "success",
        "message": "Calendar entries retrieved",
        "statusCode": 200,
        "data": entries_json
    })