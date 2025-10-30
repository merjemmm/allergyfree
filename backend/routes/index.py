"""
Insta485 index (main) view.

URLs include:
/
"""
# import pathlib
# import uuid
import arrow
import flask
from flask import Blueprint, jsonify

index_bp = Blueprint("index", __name__)

# LOGGER = flask.logging.create_logger(index_bp)

# @index_bp.route('/uploads/<filename>')
# def uploads(filename):
#     """Return file image."""
#     if 'username' not in flask.session:
#         return flask.abort(403)

#     # logname = flask.session.get('username')
#     connection = insta485.model.get_db()

#     # If an authenticated user attempts to access a file that does not exist
#     user = connection.execute(
#         """
#         SELECT filename
#         FROM users
#         WHERE filename = ?
#         """,
#         (filename, )
#     ).fetchone()

#     post = connection.execute(
#         """
#         SELECT filename
#         FROM posts
#         WHERE filename = ?
#         """,
#         (filename, )
#     ).fetchone()

#     if (user is None) and (post is None):
#         return flask.abort(404)

#     # Serve the image from the "uploads" directory
#     return flask.send_from_directory(index_bp.config['UPLOAD_FOLDER'],
#                                      filename, as_attachment=True)

