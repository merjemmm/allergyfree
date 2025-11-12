# backend/init_db.py
import sqlite3
from pathlib import Path

def init_db(db_path="backend/curr_db/app.db"):
    schema_path = Path("backend/sql_data/schema.sql")
    data_path = Path("backend/sql_data/data.sql")

    # Ensure parent directory exists
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Run schema.sql
    with open(schema_path, "r") as f:
        cursor.executescript(f.read())

    # Run data.sql
    with open(data_path, "r") as f:
        cursor.executescript(f.read())

    conn.commit()
    conn.close()
    print(f"✅ Database initialized at {db_path}")

if __name__ == "__main__":
    init_db()
