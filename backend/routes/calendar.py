"""allergyfree backend for calendar page"""
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from backend.models import SymptomLog
from datetime import datetime
from sqlalchemy import extract

calendar_bp = Blueprint("calendar", __name__)


@calendar_bp.route('/entries')
@login_required
def get_entries():

    # Get month, year, day from query params
    # we allow day and year to not be given but month MUST be given
    day = request.args.get("day", default=None, type=int)
    month = request.args.get("month", default=None, type=int)
    year = request.args.get("year", default=None, type=int)
    
    if not month:
        return jsonify({ "status": "error", 
                        "error": "month query is empty"}), 403
        
    if not year:
        year = datetime.now().year

    query = SymptomLog.query.filter(
        extract('year', SymptomLog.date) == year,
        extract('month', SymptomLog.date) == month,
        SymptomLog.adder==current_user.username)

    
    if day:
        query = SymptomLog.query.filter(
            extract('year', SymptomLog.date) == year,
            extract('month', SymptomLog.date) == month,
            extract('day', SymptomLog.date) == day,
            SymptomLog.adder==current_user.username)
        
    calendar_entries = query.all()

    # convert to dicts for JSON response
    def symptom_to_dict(sym):
        return {
            "id": sym.id,
            "user": sym.user,
            "symptom": sym.symptom,
            "type": sym.type
        }

    return jsonify({
        "status": "success",
        "message": "Calendar entries retrieved",
        "data": [symptom_to_dict(s) for s in calendar_entries]
    }), 200