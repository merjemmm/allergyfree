"""allergyfree backend accounts view and methods."""
import hashlib
import uuid
import pathlib
import flask
from flask import Blueprint, jsonify, session

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/check', methods=['GET'])
def check():
    return jsonify({"status": "ok"})

# @auth_bp.route('/api/accounts/auth/', methods=['GET'])
# def auth():
#     """Check authentication."""
#     if 'username' in flask.session:
#         return jsonify({"status": "ok"})

#     return jsonify({"status": "error", "response" : 403})

# @auth_bp.route('/api/accounts/', methods=["POST"])
# def accounts():
#     """Accounts Post Routes."""
#     if flask.request.form.get('operation') == 'login':
#         return handle_login()

#     if flask.request.form.get('operation') == 'create':
#         return handle_create()

#     if flask.request.form.get('operation') == 'delete':
#         return handle_delete()

#     if flask.request.form.get('operation') == 'edit_account':
#         return handle_edit_account()

#     return handle_update_password()

@auth_bp.route('/login', methods=["POST"])
def handle_login():
    """Handle logging in."""
    data = request.get_json()  # get the JSON body
    username = data.get("username")
    password = data.get("password")

    # If the username or password fields are empty, abort(400)
    if not username or not password:
        return jsonify({"status": "error", "response" : 403})

    # If username and password authentication fails, abort(403)
    # hash this password, compare to user_pass
    connection = backend.model.get_db()
    user_pass = connection.execute(
        """
        SELECT password
        FROM users
        WHERE username = ?
        """,
        (username, )
    ).fetchone()
    
    if user_pass is None:
        return jsonify({"status": "error", "response" : 403})
    
    # comapre associated hashed password with the input
    if not check_password_hash(user_pass['password'], password):
        return jsonify({"status": "error", "response" : 403})
    
    # set session username
    session["username"] = username

    return jsonify({"status": "ok"})

@auth_bp.route('/api/accounts/create', methods=["POST"])
def handle_create():
    """Handle creating account."""
    data = request.get_json()  # get the JSON body
    username = data.get("username")
    password = data.get("password")
    fullname = data.get('fullname')
    email = data.get('email')
    # fileobj = flask.request.files.get('file')
    
    if (
        not username
        or not password
        or not fullname
        or not email
        or not fileobj
    ):
        return jsonify({"status": "error", "response" : 400})

    if fileobj.filename == '':
        return jsonify({"status": "error", "response" : 400})

    connection = backend.model.get_db()
    exis_user = connection.execute(
        """
        SELECT 1
        FROM users
        WHERE username = ?
        """,
        (username, )
    ).fetchone()

    if exis_user:
        return jsonify({"status": "error", "response" : 409})

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
        return jsonify({"status": "User Exists"})
    
    
    conn.close()
    return jsonify({"status": "ok"})


@auth_bp.route('/api/accounts/delete', methods=["POST"])
def handle_delete():
    """Display /accounts/delete/ route."""
    if 'username' not in flask.session:
        # this means the user isn't logged in so we should abort
        return jsonify({"status": "error", "response" : 403})

    else:
        data = request.get_json()  # get the JSON body
        username = data.get("username")



        connection = backend.model.get_db()
        # first get old filename so can delete from sql db
        old_file = connection.execute(
            """
            SELECT filename
            FROM users
            WHERE username = ?
            """,
            (username, )
        )

        old_file = old_file.fetchone()
        path = pathlib.Path(
            auth_bp.config["UPLOAD_FOLDER"])/old_file['filename']
        path.unlink()

        connection.execute(
            """
            DELETE FROM users
            WHERE username = ?
            """,
            (username, )
        )
        connection.commit()

        flask.session.clear()
        # flask.session.pop('username', None)

        target = flask.request.args.get('target')
        if not target:
            return flask.redirect(flask.url_for('show_index'))

        return flask.redirect(target)


@auth_bp.route('/api/accounts/edit', methods=["POST"])
def handle_edit_account():
    """Display /accounts/edit/ route."""
    if 'username' not in flask.session:
        return jsonify({"status": "error", "response" : 403})

    else:
        data = request.get_json()  # get the JSON body
        username = data.get("username")

        fullname = data.get('fullname')
        email = data.get('email')
        fileobj = data.get('file')

        if not (fullname or email):
            return jsonify({"status": "error", "response" : 403})

        if fileobj:
            # pfp given
            connection = backend.model.get_db()
            # first get old filename so can delete from sql db
            old_file = connection.execute(
                """
                SELECT filename
                FROM users
                WHERE username = ?
                """,
                (username, )
            )

            old_file = old_file.fetchone()
            # file_name = old_file[0]
            path = pathlib.Path(
                auth_bp.config["UPLOAD_FOLDER"])/old_file['filename']
            path.unlink()

            # now we need to update the account including the new photo
            filename = fileobj.filename

            stem = uuid.uuid4().hex
            suffix = pathlib.Path(filename).suffix.lower()
            uuid_basename = f"{stem}{suffix}"

            # Save to disk
            path = pathlib.Path(
                auth_bp.config["UPLOAD_FOLDER"])/uuid_basename
            fileobj.save(path)

            connection.execute(
                """
                UPDATE users
                SET fullname = ?, email = ?, filename = ?
                WHERE username = ?
                """,
                (fullname, email, uuid_basename, username)
            )

            connection.commit()

        else:
            # no new photo given

            connection = backend.model.get_db()
            connection.execute(
                """
                UPDATE users
                SET fullname = ?, email = ?
                WHERE username = ?
                """,
                (fullname, email, username)
            )
            connection.commit()

        target = flask.request.args.get('target')
        if not target:
            # return flask.redirect(flask.url_for('show_index'))
            return jsonify({"status": "error", "response" : 403})

        return jsonify({"status": "ok", "response" : 200})


def handle_update_password():
    """Update user password."""
    if 'username' not in flask.session:
        return jsonify({"status": "error", "response" : 403})

    else:
        data = request.get_json()  # get the JSON body
        username = data.get("username")

        new_password1 = data.get('new_password1')
        new_password2 = data.get('new_password2')
        old_password = data.get('password')

        if not new_password1 or not new_password2 or not old_password:
            return jsonify({"status": "error", "response" : 400})

        if new_password1 != new_password2:
            return jsonify({"status": "error", "response" : 401})

        # compare old password to currently stored password
        connection = backend.model.get_db()
        user_pass = connection.execute(
            """
            SELECT password
            FROM users
            WHERE username = ?
            """,
            (username, )
        )
        user_pass = user_pass.fetchone()['password']

        # ie. the username dne:
        if not user_pass:
            return jsonify({"status": "error", "response" : 403})
    
        # comapre associated hashed password with the input
        if not check_password_hash(user_pass['password'], password):
            return jsonify({"status": "error", "response" : 403})

        password_hash = generate_password_hash(password)
        connection.execute(
            """
            UPDATE users
            SET password = ?
            WHERE username = ?
            """,
            (password_hash, username)
        )

        connection.commit()

    if not target:
        return jsonify({"status": "error", "response" : 403})

    return jsonify({"status": "ok", "response" : 200})
