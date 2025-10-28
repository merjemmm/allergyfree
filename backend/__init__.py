"""Allergy Free package initializer."""
from flask_cors import CORS
from flask import Flask
import os

def create_app():
    app = Flask(__name__)

    CORS(app)

    # --- Register Blueprints ---

    from backend.routes import register_routes
    register_routes(app)

    # --- Initialize Database ---
    # from backend.models.model import init_db_command
    # app.cli.add_command(init_db_command)


    app.config.from_object('backend.config')

    import backend.models # noqa: E402  pylint: disable=wrong-import-position
    import backend.routes

    return app

# Overlay settings read from a Python file whose path is set in the environment
# variable INSTA485_SETTINGS. Setting this environment variable is optional.
# Docs: http://flask.pocoo.org/docs/latest/config/
#
# EXAMPLE:
# $ export INSTA485_SETTINGS=secret_key_config.py
# app.config.from_envvar('INSTA485_SETTINGS', silent=True)

# Tell our app about views and model.  This is dangerously close to a
# circular import, which is naughty, but Flask was designed that way.
# (Reference http://flask.pocoo.org/docs/patterns/packages/)  We're
# going to tell pylint and pycodestyle to ignore this coding style violation.




# import backend.models # noqa: E402  pylint: disable=wrong-import-position
# import backend.routes  # noqa: E402  pylint: disable=wrong-import-position
# import backend.services  # noqa: E402  pylint: disable=wrong-import-position
# import backend.models  # noqa: E402  pylint: disable=wrong-import-position


