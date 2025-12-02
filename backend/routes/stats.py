from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from backend.models import SymptomLog
from backend import db
import pandas as pd
from sqlalchemy import extract
from datetime import datetime

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/check', methods=['GET'])
def get_check():
    print("yolo")
    return {"status": "ok"}, 200

@stats_bp.route('/plot', methods=['GET'])
# @login_required
def get_plot_data():
    
    engine = db.engine
    
    query1 = SymptomLog.query.filter(
        extract('year', SymptomLog.date) == datetime.now().year,
        extract('month', SymptomLog.date) == datetime.now().month,
        SymptomLog.adder==current_user.username)
    
    df = pd.read_sql(query1.statement, engine)
    dateList = df["date"]
    df["day"] = df["date"].day
    countList = df.groupby("day").count()
    
    print(df)
    
    query2 = SymptomLog.query.filter(
        extract('year', SymptomLog.date) == datetime.now().year,
        extract('month', SymptomLog.date) == datetime.now().month,
        SymptomLog.adder==current_user.username)
    
    
    
    # [row.value for row in Table1.query.all()]
    # data2 = [row.value for row in Table2.query.all()]
    
    # include monthly 
    
    return jsonify({"status": "ok", 
                    "message": "Restaurant added successfully",
                     "dateList" : dateList, "symptomCountList" : countList, }), 200
    