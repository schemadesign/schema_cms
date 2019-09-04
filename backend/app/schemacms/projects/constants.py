# PROJECTS
class ProjectStatus:
    INITIAL = "initial"
    PROCESSING = "processing"


PROJECT_STATUS_CHOICES = ((ProjectStatus.INITIAL, "initial"), (ProjectStatus.PROCESSING, "processing"))


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
    PROCESSING = "processing"
    DONE = "done"
    ERROR = "error"


DATA_SOURCE_STATUS_CHOICES = (
    (DataSourceStatus.DRAFT, "draft"),
    (DataSourceStatus.PROCESSING, "processing"),
    (DataSourceStatus.DONE, "done"),
    (DataSourceStatus.ERROR, "error")
)
