# Around Me Allergy Free

This is a website designed for people with multiple allergies, chronic illnesses causing food-related flareups, or others managing and tracking chronic symptoms.

This was a capstone project for the University of Michigan's EECS 497: Human-Centered Software Development. 

## Setup notes

After cloning the repository, set up a Python virtual environment.

First install requirements. pip:
```
pip install -r requirements.txt
```

To start the backend, open a new terminal and run
```
python -m flask --app backend --debug run --cert=adhoc
```
This initializes the database and the Flask app. Check that `backend/curr_db` is empty first. Otherwise, you may get an error from the database already existing.

**Before building the frontend**, first navigate to the API route, which is http**s**://127.0.0.1:5000 (the s is important!). Bypass the scary-looking warning about it being unsafe (go to Advanced > Proceed to 127.0.0.1 (unsafe)). This is required, and lets the React app use our (technically) invalid certificate locally (and allow it to communicate with the API).

Once you've done the above, to view the website in your browser, first cd into `frontend/`.

Run ``` npm install ```, if you haven't already.

Whenever you want to build site, run `npm start` while in `frontend/`. The React app is at htt**p**://127.0.0.1:3000 (not https).

