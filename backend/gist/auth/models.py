from . import constants
from gist import database
from sqlalchemy.dialects import postgresql


class UserAuth(database.SurrogatePK, database.Model):
    __tablename__ = "userauth"
    __table_args__ = (
        database.db.UniqueConstraint("provider", "uid", name='provider_uid_uniq'),
    )
    user_id = database.reference_col("users")
    user = database.relationship("User", uselist=False, back_populates="auth")
    provider = database.Column(database.db.String(32))
    uid = database.Column(database.db.String(constants.UID_LENGTH))
    extra_data = database.Column(postgresql.JSON)

    def __init__(self, **kwargs):
        """Create instance."""
        database.db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return f"<UserSocialAuth({self.user}, {self.provider})>"
