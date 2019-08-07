import flask_restful
import flask_login

from . import marshals


class Me(flask_restful.Resource):
    @flask_login.login_required
    @flask_restful.marshal_with(marshals.user_marshal)
    def get(self):
        return flask_login.current_user
