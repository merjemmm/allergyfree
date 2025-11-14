from dotenv import load_dotenv
import os
import pathlib

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "devsecret")
DATABASE_FILENAME = os.getenv("DB_PATH", "/curr_db/app.db")

APPLICATION_ROOT = '/'

SESSION_COOKIE_NAME = 'login'

PATH = os.path.dirname(os.path.realpath(__file__))

FULL_PATH = PATH + DATABASE_FILENAME

SQLALCHEMY_DATABASE_URI = f"sqlite:///{FULL_PATH}"
SQLALCHEMY_TRACK_MODIFICATIONS = False