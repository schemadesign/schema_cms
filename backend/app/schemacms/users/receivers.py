from schemacms.users.backend_management import user_mgtm_backend


def remove_from_projects(sender, user, **kwargs):
    user.assigned_projects.clear()


def remove_from_auth_backend(sender, instance, **kwargs):
    user_mgtm_backend.delete_user(user=instance)
