from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from backend.models import Restaurant
from backend import db
from datetime import datetime

restaurants_bp = Blueprint('restaurants', __name__)

@restaurants_bp.route('/all', methods=['GET'])
@login_required
def get_restaurants():
    # return all restaurants added by curr user
    restaurants = Restaurant.query.filter_by(adder=current_user.username).all()

    def restaurant_to_dict(r):
        return {
            "restid": r.restid,
            "name": r.name,
            "location": r.location,
            "goodexp": r.goodexp,
            "created": r.created.isoformat() if r.created else None,
        }

    return jsonify({
        "status": "success",
        "restaurants": [restaurant_to_dict(x) for x in restaurants]
    })

@restaurants_bp.route("/add", methods=["POST"])
@login_required
def add_restaurant():
    data = request.get_json()
    name = data.get("name")
    location = data.get("location")
    food = data.get("food")
    notes = data.get("notes")
    goodexp = data.get("goodExp", False)
    created_time = datetime.now()

    # accepts bool or 'true'/'false' strings for good experience
    if isinstance(goodexp, str):
        goodexp = goodexp.lower() == "true"

    if not name or not location:
        return jsonify({"status": "fail", 
                        "message": "Missing name or location", 
                        "statusCode": 400})

    restaurant = Restaurant(
        name=name,
        location=location,
        adder=current_user.username,
        goodexp=bool(goodexp),
        created=created_time
    )
    db.session.add(restaurant)
    db.session.commit()

    return jsonify({"status": "success", 
                    "message": "Restaurant added successfully", 
                    "statusCode": 200})
    

@restaurants_bp.route("/delete/<int:rest_id>/", methods=["DELETE"])
@login_required
def delete_restaurant(rest_id):
    if not rest_id:
        return jsonify({"status": "fail", 
                        "message": "Missing restaurant id", 
                        "statusCode": 400})

    restaurant = Restaurant.query.get(rest_id)
    if not restaurant:
        return jsonify({"status": "fail", 
                        "message": "Restaurant does not exist", 
                        "statusCode": 400})
        
    db.session.delete(restaurant)
    db.session.commit()

    return jsonify({"status": "success", 
                    "message": "Restaurant entry deleted successfully", 
                    "statusCode": 200})