# backend/routes/restaurants.py
from flask import Blueprint, jsonify

restaurants_bp = Blueprint('restaurants', __name__)

@restaurants_bp.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    """
    Display restaurants currently in the database for this user
    """

    # Connect to database
    logname = "self"
    connection = backend.model.get_db()

    cur = connection.execute(
        """
        SELECT *
        FROM restaurants
        WHERE username = ?
        """,
        (logname, )
    )

    restaurants = cur.fetchall()

    return jsonify({"status": "success", "restaurant": restaurants})


@restaurants_bp.route("/api/restaurants", methods=["POST"])
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

    return jsonify({"status": "success", "message": "Restaurant added!"})
