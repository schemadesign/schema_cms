def remove_from_projects(sender, user, **kwargs):
    user.assigned_projects.clear()
