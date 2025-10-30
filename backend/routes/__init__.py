# backend/routes/__init__.py
from backend.routes.auth import auth_bp
from backend.routes.calendar import calendar_bp
from backend.routes.journal import journal_bp
from backend.routes.profile import profile_bp
from backend.routes.restaurants import restaurants_bp

def register_routes(app):
    # Register all blueprints here
    app.register_blueprint(auth_bp, url_prefix="/api/accounts/")
    app.register_blueprint(calendar_bp, url_prefix="/api/calendar/")
    app.register_blueprint(journal_bp, url_prefix="/api/calendar/")
    app.register_blueprint(profile_bp, url_prefix="/api/calendar/")
    app.register_blueprint(restaurants_bp, url_prefix="/api/calendar/")

