"""allergyfree backend for journal page"""
import flask
from flask import Blueprint, jsonify

journal_bp = Blueprint("auth", __name__)


@journal_bp.route('/api/journal/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})


# thi includes a query parameter ?month=xyz&year=xyz
@journal_bp.route('/api/journal', methods=['GET'])
def get_journal():
    # Return all journal entries for a person
    month = request.args.get("month")
    year = request.args.get("year")
    
    # optional parameter for in depth views
    day = request.args.get("day")

    if not month or not year:
        return jsonify({ "status" : "fail",
                    "error": "Missing month or year",
                    "statusCode" : 400})

    #TODO - fix sql quer, need try and except with error
    db = get_db()
    journal_entries = db.execute(
        "SELECT * FROM logs WHERE strftime('%m', timestamp) = ? AND strftime('%Y', timestamp) = ?",
        (month.zfill(2), year)
    ).fetchall()
    
    
    return jsonify({"status" : "success",
                    "message" : "Journal entries retrieved",
                    "statusCode" : 200,
                    "data" : journal_entries})


# @journal_bp.route('/api/journaltoday', methods=['GET'])
# def get_journal_today():
#     # Return only entries for today for teh user, 

#     # Responses:
#     # Success
#     # Fail
#     journal_entries = []
    
#     if True:
#         return jsonify({ "status" : "fail",
#                     "message" : "Error adding entry",
#                     "statusCode" : 400,
#                     "data" : []})
    
#     return jsonify({"status" : "success",
#                     "message" : "Journal entries retrieved",
#                     "statusCode" : 200,
#                     "data" : journal_entries})


@journal_bp.route('/api/journal/addentry', methods=['POST'])
def add_journal():
    # Add new journal entry for a person, another db call

    # Responses:
    # Success
    # Fail
    
    if True:
        return jsonify({ "status" : "success",
                        "message" : "Journal entry added successfully",
                        "statusCode" : 200})
    
    
    return jsonify({ "status" : "fail",
                    "message" : "error adding entry",
                    "statusCode" : 403 })


