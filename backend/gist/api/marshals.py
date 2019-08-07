from flask_restful import fields


user_marshal = {
    'name': fields.String(),
    'email': fields.String(),
}
