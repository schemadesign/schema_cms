class ProjectStatus:
    IN_PROGRESS = "in_progress"
    DONE = "done"
    HOLD = "hold"
    PUBLISHED = "published"


PROJECT_STATUS_CHOICES = (
    (ProjectStatus.IN_PROGRESS, "in progress"),
    (ProjectStatus.DONE, "done"),
    (ProjectStatus.HOLD, "hold"),
    (ProjectStatus.PUBLISHED, "published"),
)
