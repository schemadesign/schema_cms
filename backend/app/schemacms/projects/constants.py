from enum import Enum

SCRIPT_NAME_MAX_LENGTH = 50
DATASOURCE_NAME_MAX_LENGTH = 50
DIRECTORY_NAME_MAX_LENGTH = 50
BLOCK_NAME_MAX_LENGTH = 50


class WorkerProcessType:
    DATASOURCE_META_PROCESSING = "datasource-meta-processing"
    SCRIPTS_PROCESSING = "scripts-processing"


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


class DataSourceType:
    FILE = "file"
    DATABASE = "database"
    API = "api"


DATA_SOURCE_TYPE_CHOICES = (
    (DataSourceType.FILE, "file"),
    (DataSourceType.DATABASE, "database"),
    (DataSourceType.API, "api"),
)


class ProcessingState:
    PENDING = "pending"
    PROCESSING = "processing"
    FAILED = "failed"
    SUCCESS = "success"


PROCESSING_STATE_CHOICES = (
    (ProcessingState.PENDING, "Pending"),
    (ProcessingState.PROCESSING, "Processing"),
    (ProcessingState.FAILED, "Failed"),
    (ProcessingState.SUCCESS, "Success"),
)


class FilterType(Enum):
    RANGE = "range"
    VALUE = "value"
    BOOL = "bool"
    SELECT = "select"
    CHECKBOX = "checkbox"

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


STRING_FILTER_TYPES = [FilterType.SELECT.value, FilterType.CHECKBOX.value]

DATE_FILTER_TYPES = [FilterType.RANGE.value, FilterType.VALUE.value]

BOOL_FILTER_TYPES = [FilterType.BOOL.value]

NUMBER_FILTER_TYPES = [FilterType.RANGE.value, FilterType.VALUE.value]


class FilterTypesGroups:
    string = STRING_FILTER_TYPES
    number = NUMBER_FILTER_TYPES
    boolean = BOOL_FILTER_TYPES
    datetime = DATE_FILTER_TYPES


class FieldType:
    STRING = "string"
    DATE = "datetime"
    BOOLEAN = "boolean"
    NUMBER = "number"


FIELD_TYPE_CHOICES = (
    (FieldType.STRING, "String"),
    (FieldType.DATE, "Date/Time"),
    (FieldType.BOOLEAN, "Boolean"),
    (FieldType.NUMBER, "Number"),
)


class BlockTypes:
    EMBED = "embed"
    CODE = "code"
    MARKDOWN = "markdown"
    TEXT = "text"
    IMAGE = "image"
    OBSERVABLE_HQ = "observable_hq"


BLOCK_TYPE_CHOICES = (
    (BlockTypes.EMBED, "Embed"),
    (BlockTypes.CODE, "Code"),
    (BlockTypes.MARKDOWN, "Markdown"),
    (BlockTypes.TEXT, "Text"),
    (BlockTypes.IMAGE, "Image Upload"),
    (BlockTypes.OBSERVABLE_HQ, "ObservableHQ"),
)
