class ProjectStatus:
    INITIAL = 'initial'
    PROCESSING = 'processing'


PROJECT_STATUS_CHOICES = (
    (ProjectStatus.INITIAL, 'initial'),
    (ProjectStatus.PROCESSING, 'processing'),
)


class DataSourceType:
    FILE = 'file'
    DATABASE = 'database'
    API = 'api'


DATA_SOURCE_TYPE_CHOICES = (
    (DataSourceType.FILE, 'file'),
    (DataSourceType.DATABASE, 'database'),
    (DataSourceType.API, 'api'),
)


class DataSourceStatus:
    DRAFT = 'draft'
    PROCESSING = 'processing'
    DONE = 'done'


DATA_SOURCE_STATUS_CHOICES = (
    (DataSourceStatus.DRAFT, 'draft'),
    (DataSourceStatus.PROCESSING, 'processing'),
    (DataSourceStatus.DONE, 'done'),
)
