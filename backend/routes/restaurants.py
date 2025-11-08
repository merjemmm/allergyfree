# backend/routes/restaurants.py
from flask import Blueprint, jsonify, request
from backend.model import get_db

restaurants_bp = Blueprint('restaurants', __name__)

# TODO - probably should also have optional query params
@restaurants_bp.route('/all', methods=['GET'])
def get_restaurants():
    """
    Display restaurants currently in the database for this user
    """

    # Connect to database
    # username = session["username"]
    username = "baseuser"
    connection = get_db()

    cur = connection.execute(
        """
        SELECT *
        FROM restaurants
        WHERE adder = ?
        """,
        (username, )
    )

    restaurants = cur.fetchall()

    return jsonify({"status": "success", "restaurant": restaurants})


# curl -X POST http://127.0.0.1:5000/api/restaurant/add \
#       -H 'Content-Type: application/json' \
#         -d '{"name" : "Burger 1", "location" : "Plymouth Rd", "goodexp" : true}'

@restaurants_bp.route("/add", methods=["POST"])
def add_restaurant():
    # Add a restaurants to the db for a user, 
    username = "baseuser"

    data = request.get_json()  # get the JSON body
    name = data.get("name")
    location = data.get("location")
    goodexp = "TRUE" if data.get("goodExp") == "true" else "FALSE"
    
    if (
        not name
        or not location
        or not goodexp
    ):
        return jsonify({"status" : "fail",
                        "message" : "Missing name, location, or good experience",
                        "statusCode" : 400 })

    conn = get_db()
    exis_rest = conn.execute(
        """
        SELECT 1
        FROM restaurants
        WHERE name = ? AND location = ?
        """,
        (name, location)
    ).fetchone()

    if exis_rest:
        return jsonify({"status" : "fail",
                        "message" : "Restaurant already exists for this user",
                        "statusCode" : 409 })

    # created the hash automatically instead of before with manual calc

    try:
        conn.execute(
            "INSERT INTO restaurants (location, name, adder, goodexp) VALUES (?, ?, ?, ?)",
            (location, name, username, goodexp),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        # same as above, so keep one
        return jsonify({"status" : "fail",
                        "message" : "Restaurant already exists",
                        "statusCode" : 409 })

    conn.close()
    return jsonify({"status" : "success",
                    "message" : "Restaurant added successfully",
                    "statusCode" : 200 })
    
    # if True:
    #     return jsonify({ "status" : "fail",
    #                     "error" : "error in adding",
    #                     "statusCode" : 403 })

