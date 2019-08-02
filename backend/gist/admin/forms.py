# -*- coding: utf-8 -*-
"""Public forms."""
from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField
from wtforms.validators import DataRequired, Email

from gist.user import models as user_models


class AdminLoginForm(FlaskForm):
    """Login form."""

    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        """Create instance."""
        super().__init__(*args, **kwargs)
        self.user = None

    def validate(self):
        """Validate the form."""
        initial_validation = super().validate()
        if not initial_validation:
            return False

        self.user = user_models.User.query.filter_by(email=self.email.data).first()
        if not self.user.is_admin:
            self.email.errors.append("Not authorized user")
            return False

        if not self.user:
            self.email.errors.append("Unknown email")
            return False

        if not self.user.check_password(self.password.data):
            self.password.errors.append("Invalid password")
            return False
        return True
