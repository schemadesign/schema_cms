# PROJECTS
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


# DATASOURCES
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


class DataSourceStatus:
    DRAFT = "draft"
    READY_FOR_PROCESSING = "ready_for_processing"
    PROCESSING = "processing"
    DONE = "done"
    ERROR = "error"


DATA_SOURCE_STATUS_CHOICES = (
    (DataSourceStatus.DRAFT, "draft"),
    (DataSourceStatus.READY_FOR_PROCESSING, "ready for processing"),
    (DataSourceStatus.PROCESSING, "processing"),
    (DataSourceStatus.DONE, "done"),
    (DataSourceStatus.ERROR, "error"),
)
