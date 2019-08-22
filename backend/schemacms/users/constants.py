class UserRole:
    UNDEFINED = 'undefined'
    ADMIN = 'admin'
    EDITOR = 'editor'


USER_ROLE_CHOICES = (

    (UserRole.UNDEFINED, 'undefined'),
    (UserRole.ADMIN, 'admin'),
    (UserRole.EDITOR, 'editor'),
)
