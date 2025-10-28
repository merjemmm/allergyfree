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


@index_bp.route('/uploads/<filename>')
def uploads(filename):
    """Return file image."""
    if 'username' not in flask.session:
        return flask.abort(403)

    # logname = flask.session.get('username')
    connection = insta485.model.get_db()

    # If an authenticated user attempts to access a file that does not exist
    user = connection.execute(
        """
        SELECT filename
        FROM users
        WHERE filename = ?
        """,
        (filename, )
    ).fetchone()

    post = connection.execute(
        """
        SELECT filename
        FROM posts
        WHERE filename = ?
        """,
        (filename, )
    ).fetchone()

    if (user is None) and (post is None):
        return flask.abort(404)

    # Serve the image from the "uploads" directory
    return flask.send_from_directory(index_bp.config['UPLOAD_FOLDER'],
                                     filename, as_attachment=True)


@index_bp.route("/likes/", methods=["POST"])
def update_likes():
    """Update likes."""
    LOGGER.debug("operation = %s", flask.request.form["operation"])
    LOGGER.debug("postid = %s", flask.request.form["postid"])

    # 2nd option request.form.get("postid")
    post_id = flask.request.form["postid"]

    logname = flask.session.get('username')
    connection = insta485.model.get_db()

    if flask.request.form["operation"] == "like":
        # check if trying to like an already liked post
        liked = connection.execute(
            """
            SELECT postid
            FROM likes
            WHERE (postid = ? AND owner = ?)
            """,
            (post_id, logname)
        )
        liked = liked.fetchone()

        if liked:
            flask.abort(409)

        connection.execute(
            """
            INSERT INTO likes(owner, postid)
            VALUES (?, ?)
            """,
            (logname, post_id)
        )
        connection.commit()

    elif flask.request.form["operation"] == "unlike":
        # check if trying to unlike a post they have not liked
        never_liked = connection.execute(
            """
            SELECT postid
            FROM likes
            WHERE (postid = ? AND owner = ?)
            """,
            (post_id, logname)
        )
        never_liked = never_liked.fetchone()

        if not never_liked:
            flask.abort(409)

        connection.execute(
            """DELETE FROM likes
            WHERE (owner = ? AND postid = ?) """,
            (logname, post_id)
        )

        connection.commit()

    target = flask.request.args.get('target')
    if not target:
        return flask.redirect('/')

    return flask.redirect(target)


@index_bp.route("/comments/", methods=["POST"])
def update_comments():
    """Update comments."""
    LOGGER.debug("operation = %s", flask.request.form["operation"])
    # LOGGER.debug("postid = %s", flask.request.form["postid"])

    logname = flask.session.get('username')
    connection = insta485.model.get_db()

    if flask.request.form["operation"] == "create":
        # check if trying to  an already liked post
        comment_text = flask.request.form.get("text")
        post_id = flask.request.form["postid"]

        if not comment_text:
            flask.abort(400)

        connection.execute(
            """
            INSERT INTO comments(owner, postid, text)
            VALUES (?, ?, ?)
            """,
            (logname, post_id, comment_text)
        )

        connection.commit()

    elif flask.request.form["operation"] == "delete":
        # If a user tries to delete a comment that they do not own
        comment_id = flask.request.form.get("commentid")

        never_commented = connection.execute(
            """
            SELECT owner
            FROM comments
            WHERE commentid = ?
            """,
            (comment_id, )
        )

        never_commented = never_commented.fetchone()

        if never_commented['owner'] != logname:
            flask.abort(403)

        connection.execute(
            """
            DELETE FROM comments
            WHERE commentid = ?
            """,
            (comment_id, )
        )

        connection.commit()

    target = flask.request.args.get('target')
    if not target:
        return flask.redirect('/')

    return flask.redirect(target)
