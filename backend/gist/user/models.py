# -*- coding: utf-8 -*-
"""User models."""
import datetime as dt

from flask_login import UserMixin

from gist.database import (
    Column,
    Model,
    SurrogatePK,
    db,
    reference_col,
    relationship,
)
from gist.extensions import bcrypt


class Role(SurrogatePK, Model):
    """A role for a user."""

    __tablename__ = "roles"
    name = Column(db.String(80), unique=True, nullable=False)
    user_id = reference_col("users", nullable=True)
    user = relationship("User", backref="roles")

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return "<Role({name})>".format(name=self.name)


class User(UserMixin, SurrogatePK, Model):
    """A user of the app."""

    __tablename__ = "users"
    auth0_id = Column(db.String(80), unique=True, nullable=True, default=None)
    email = Column(db.String(80), nullable=False, default='')
    password = Column(db.LargeBinary(128), nullable=True)  #: The hashed password
    name = Column(db.String(100), nullable=True)
    is_admin = Column(db.Boolean(), default=False)
    created_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)

    def __init__(self, password=None, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)
        if password:
            self.set_password(password)
        else:
            self.password = None

    def set_password(self, password):
        """Set password."""
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, value):
        """Check password."""
        return bcrypt.check_password_hash(self.password, value)

    def __repr__(self):
        """Represent instance as a unique string."""
        return f"<User({self.email!r})>"
