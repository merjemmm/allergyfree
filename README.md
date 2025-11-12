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
python -m backend.init_db
```
This initializes the database–check that `backend/curr_db` is empty first. Otherwise, you'll get an error from the database already existing.

Next run 
```
python -m backend.app
```

To view the website in your browser, first cd into `frontend/` then run
```
npm install
```
Now whenever you want to view the website in your browser, run `npm start` while in `frontend/`.

