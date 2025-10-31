# backend/routes/restaurants.py
from flask import Blueprint, jsonify

restaurants_bp = Blueprint('restaurants', __name__)

# TODO - probably should also have optional query params
@restaurants_bp.route('/api/restaurant/all', methods=['GET'])
def get_restaurants():
    """
    Display restaurants currently in the database for this user
    """

    # Connect to database
    username = session["username"]
    connection = backend.model.get_db()

    cur = connection.execute(
        """
        SELECT *
        FROM restaurants
        WHERE username = ?
        """,
        (username, )
    )

    restaurants = cur.fetchall()

    return jsonify({"status": "success", "restaurant": restaurants})


@restaurants_bp.route("/api/restaurant/add", methods=["POST"])
def add_restaurant():
    # Add a restaurants to the db for a user, 

    # Responses:
    # No restaurants
    # Return restaurants
    # Error


    # data = request.get_json()
    # name = data.get("name")
    # diet_type = data.get("dietType")

    # db = get_db()
    # db.execute(
    #     "INSERT INTO restaurants (name, diet_type) VALUES (?, ?)",
    #     (name, diet_type),
    # )
    # db.commit()
    
    
    if False:
        return jsonify({ "status" : "fail",
                        "error" : "Restaurant already exists",
                        "statusCode" : 400 })
    
    if True:
        return jsonify({ "status" : "fail",
                        "error" : "error in adding",
                        "statusCode" : 403 })
    

    return jsonify({"status" : "success",
                "message" : "Restaurant added successfully",
                "statusCode" : 200 })
