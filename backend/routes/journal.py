from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from backend.models import Journal
from backend import db
from datetime import datetime

journal_bp = Blueprint("journal", __name__)

@journal_bp.route('/entries', methods=['GET'])
@login_required
def get_journal():

    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)
    day = request.args.get("day", type=int)

    if not month or not year:
        return jsonify({ "status": "fail", 
                        "error": "Missing month or year"}), 400

    # filtering by username, month, year, optionally day rn
    query = Journal.query.filter_by(adder=current_user.username)
    query = query.filter(db.extract('month', Journal.created) == month, db.extract('year', Journal.created) == year)
    if day:
        query = query.filter(db.extract('day', Journal.created) == day)

    entries = query.all()

    def journal_to_dict(entry):
        return {
            "id": entry.id,
            "adder": entry.adder,
            "created": entry.created.isoformat() if entry.created else None,
            "meal": entry.meal,
            "food": entry.food,
            "ingredients": entry.ingredients,
            "notes": entry.notes,
            "symptoms": entry.symptoms
        }

    return jsonify({
        "status": "success",
        "message": "Journal entries retrieved",
        "data": [journal_to_dict(e) for e in entries]
    }), 200

@journal_bp.route('/add', methods=['POST'])
@login_required
def add_journal():
    data = request.get_json()
    meal = data.get("meal")
    food = data.get("food")
    ingredients = data.get("ingredients")
    notes = data.get("notes")
    symptoms = data.get("symptoms")
    created_time = datetime.now()

    if not meal or not food:
        return jsonify({"status": "fail", 
                        "message": "Missing meal or name"}), 400

    journal_entry = Journal(
        adder=current_user.username,
        created=created_time,
        meal=meal,
        food=food,
        ingredients=ingredients,
        notes=notes,
        symptoms=symptoms
    )
    db.session.add(journal_entry)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Journal entry added successfully"
    }), 200