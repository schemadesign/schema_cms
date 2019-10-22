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


DATASOURCE_NAME_MAX_LENGTH = 25
DATASOURCE_DRAFT_NAME = "My New Data Source"


class DataSourceType:
    FILE = "file"
    DATABASE = "database"
    API = "api"


DATA_SOURCE_TYPE_CHOICES = (
    (DataSourceType.FILE, "file"),
    (DataSourceType.DATABASE, "database"),
    (DataSourceType.API, "api"),
)


class DataSourceJobState:
    PENDING = 'pending'
    PROCESSING = 'processing'
    FAILED = 'failed'
    SUCCESS = 'success'


DATA_SOURCE_JOB_STATE_CHOICES = (
    (DataSourceJobState.PENDING, 'Pending'),
    (DataSourceJobState.PROCESSING, 'Processing'),
    (DataSourceJobState.FAILED, 'Failed'),
    (DataSourceJobState.SUCCESS, 'Success'),
)

SCRIPT_NAME_MAX_LENGTH = 30
