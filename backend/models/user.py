# backend/models/user.py
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import backend

def create_user(username, email, password):
    conn = backend.model.get_db()
    # created the hash automatically instead of before with manual calc
    password_hash = generate_password_hash(password)
    try:
        c.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            (username, email, password_hash),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return False  # email or username already exists
    conn.close()
    return True

def get_user_by_email(email):
    conn = backend.model.get_db()
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    conn.close()
    return user

def verify_user(email, password):
    # comapre associated hashed password with the input
    user = get_user_by_email(email)
    if user and check_password_hash(user["password_hash"], password):
        return True, user
    return False, None
