class ProjectStatus:
    INITIAL = 'initial'
    PROCESSING = 'processing'


PROJECT_STATUS_CHOICES = (
    (ProjectStatus.INITIAL, 'initial'),
    (ProjectStatus.PROCESSING, 'processing'),
)
