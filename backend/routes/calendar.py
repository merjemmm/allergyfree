"""allergyfree backend for calendar page"""
import flask
from flask import Blueprint, jsonify

calendar_bp = Blueprint("auth", __name__)


@calendar_bp.route('/api/calendar/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})


@calendar_bp.route('/api/calendar', methods=['GET'])
def get_journal():
    # Return all entries for month, 
    
    calendar_entries = []
    
    
    if True:
        return jsonify({ "status" : "fail",
                        "Message" : "error retrieving calendar entries",
                        "Status code" : 403,
                        "Data" : [] })

    
    return jsonify({ "status" : "success",
                    "Message" : "Calendar entries retrieved",
                    "Status code" : 200,
                    "Data" : calendar_entries})
    

def get_journal_today():
    # Return all entries for today day only
    # datetime.utcnow()
    
    calendar_today = []

    if True:
        return jsonify({ "status" : "fail",
                        "Message" : "error retrieving calendar entries",
                        "Status code" : 403,
                        "Data" : [] })
    
    return jsonify({ "status" : "success",
                    "Message" :  "Calendar entries for today retrieved",
                    "Status code" : 200,
                    "Data" : calendar_today})


