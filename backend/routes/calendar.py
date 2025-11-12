"""allergyfree backend for calendar page"""
import flask
from backend.model import get_db
from flask import Blueprint, jsonify, request
from datetime import datetime

calendar_bp = Blueprint("calendar", __name__)


@calendar_bp.route('/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})

# curl -X GET http://127.0.0.1:5000/api/calendar/entries?month=10&year=2025 
# , methods=['GET']

@calendar_bp.route('/entries')
def get_entries():
    # Return all entries for month, 
    # username = session["username"]
    
    username = 'baseuser'
    
    day = request.args.get("day", default=None, type=int)
    month = request.args.get("month", default=None, type=int)
    year = request.args.get("year", default=None, type=int)
    
    if not month:
        return jsonify({ "status" : "error",
                        "error" : "month query is empty",
                        "statusCode" : 403})
        
    calendar_entries = []
    conn = get_db()
        
    if not year:
        # we will default the year to the current year
        year = datetime.now().year
    
    # TODO = might be able to change storing of date to make it more efficient
    # if we use datetime and extract day, month, year
    if not day: 
        calendar_entries = conn.execute(
            """
            SELECT *
            FROM symptoms
            WHERE adder = ? AND year = ? AND month = ?
            """,
            (username, year, month, )
        ).fetchall()
        
    else:
        # specific day   
        calendar_entries = conn.execute(
            """
            SELECT *
            FROM symptoms
            WHERE adder = ? AND year = ? AND month = ? AND day = ?
            """,
            (username, year, month, day, )
        ).fetchall()
        
        
    # TODO - format the outries
    
    return jsonify({ "status" : "success",
                    "message" : "Calendar entries retrieved",
                    "statusCode" : 200,
                    "data" : calendar_entries})
    

# def get_journal_today():
#     # Return all entries for today day only
#     # datetime.utcnow()
    
#     calendar_today = []

#     if True:
#         return jsonify({ "status" : "fail",
#                         "Message" : "error retrieving calendar entries",
#                         "Status code" : 403,
#                         "Data" : [] })
    
#     return jsonify({ "status" : "success",
#                     "Message" :  "Calendar entries for today retrieved",
#                     "Status code" : 200,
#                     "Data" : calendar_today})


