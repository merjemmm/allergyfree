from dotenv import load_dotenv
import os
import pathlib

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "devsecret")  # used later for sessions/JWTs
DATABASE_FILENAME = os.getenv("DB_PATH", "backend/curr_db/app.db")

APPLICATION_ROOT = '/'

# Secret key for encrypting cookies
# ALT
# SECRET_KEY = (
#         b"\x80\xbc:'x\xa0\xb00\xb8\xf7>Y\xd6%\xb7\x0e\t%\x80$\xf8\xcf\x08\xeb"
#             )
SESSION_COOKIE_NAME = 'login'

# File Upload to var/uploads/
ALL_ROOT = pathlib.Path(__file__).resolve().parent.parent
UPLOAD_FOLDER = ALL_ROOT/'uploads'
# FOR DEPLOYING TO AWS USE BELOW:
# UPLOAD_FOLDER = pathlib.Path('/var/www/uploads')
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
MAX_CONTENT_LENGTH = 16 * 1024 * 1024