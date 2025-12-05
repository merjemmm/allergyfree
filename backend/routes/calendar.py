"""allergyfree backend for calendar page"""
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from backend.models import Symptom, SymptomLog
from datetime import datetime
from sqlalchemy import extract
from backend import db

calendar_bp = Blueprint("calendar", __name__)

@calendar_bp.route('/logsymptom', methods=['POST'])
@login_required
def log_symptom():
    data = request.get_json() or {}
    category = data.get('category')
    symptom = data.get('symptom')
    date_str = data.get('date')
    notes = data.get('notes')

    if not (category and symptom and date_str):
        return jsonify({
            "status": "fail",
            "error": "Missing required fields"
        }), 400

    # Expect a local naive datetime string like "2025-11-28T20:15:00"
    try:
        log_date = datetime.fromisoformat(date_str)
    except Exception:
        return jsonify({
            "status": "fail",
            "error": "Invalid date format"
        }), 400

    s = SymptomLog(
        adder=current_user.username,
        category=category,
        symptom=symptom,
        notes=notes,
        date=log_date,
    )
    db.session.add(s)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Symptom logged successfully",
        "data": [{
            "id": s.id,
            "symptom": s.symptom,
            "type": s.category,
            "date": s.date.strftime("%Y-%m-%d"),
            "time": s.date.strftime("%H:%M"),
            "notes": s.notes or ""
        }]
    }), 200

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

    #base query: this users logs + only entries in given month+year
    query = SymptomLog.query.filter(
        extract('year', SymptomLog.date) == year,
        extract('month', SymptomLog.date) == month,
        SymptomLog.adder==current_user.username)

    
    if day:
        query = query.filter(
            extract('day', SymptomLog.date) == day
        )

    
    #execute query + get all matching rows    
    calendar_entries = query.all()

    # convert to dicts for JSON response
    def symptom_to_dict(sym):
        date_str = sym.date.strftime("%Y-%m-%d") if sym.date else ""
        time_str = sym.date.strftime("%H:%M") if sym.date else ""

        return {
            "id": sym.id,
            "user": sym.adder,
            "symptom": sym.symptom,
            "type": sym.category,
            "date": date_str,
            "time": time_str,
            "notes": sym.notes or ""
        }

    return jsonify({
        "status": "success",
        "message": "Calendar entries retrieved",
        "data": [symptom_to_dict(s) for s in calendar_entries]
    }), 200
