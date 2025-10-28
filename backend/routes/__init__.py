# backend/routes/__init__.py
from backend.routes.auth import auth_bp
# from backend.routes.items import items_bp

def register_routes(app):
    # Register all blueprints here
    app.register_blueprint(auth_bp, url_prefix="/accounts")

