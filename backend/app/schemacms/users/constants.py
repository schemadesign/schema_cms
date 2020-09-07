class UserSource:
    UNDEFINED = "undefined"
    AUTH0 = "auth0"
    OKTA = "okta"


class UserRole:
    UNDEFINED = "undefined"
    ADMIN = "admin"
    EDITOR = "editor"


USER_SOURCE_CHOICES = (
    (UserSource.UNDEFINED, "undefined"),
    (UserSource.AUTH0, "auth0"),
    (UserSource.OKTA, "okta"),
)


USER_ROLE_CHOICES = (
    (UserRole.UNDEFINED, "undefined"),
    (UserRole.ADMIN, "admin"),
    (UserRole.EDITOR, "editor"),
)


class ErrorCode:
    AUTH0_USER_ALREADY_EXIST = "auth0UserAlreadyExist"
    OKTA_USER_NOT_EXIST = "oktaUserNotExist"
