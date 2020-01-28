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
    PENDING = 'pending'
    PROCESSING = 'processing'
    FAILED = 'failed'
    SUCCESS = 'success'


PROCESSING_STATE_CHOICES = (
    (ProcessingState.PENDING, 'Pending'),
    (ProcessingState.PROCESSING, 'Processing'),
    (ProcessingState.FAILED, 'Failed'),
    (ProcessingState.SUCCESS, 'Success'),
)


class FilterType(Enum):
    # Date
    CALENDAR = "Calendar"
    TIME_INPUT = "Time Input"
    TIME_SCRUBBER = "Time Scrubber"
    # Bool
    SWITCH = "Switch"
    # Geographic
    CARTOGRAM = "Cartogram"
    ZIPCODE_INPUT = "Zipcode Input"
    # String
    RADIO_BUTTON = "Radio Button"
    CHECKBOX = "Checkbox"
    SEARCH_INPUT = "Search Input"
    TAGS = "Tags"
    # Number
    INTERVAL_SLIDER = "Interval Slider"
    SINGLE_POINT_SLIDER = "Single Point Slider"

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


STRING_FILTER_TYPES = [
    FilterType.TAGS.value,
    FilterType.SEARCH_INPUT.value,
    FilterType.RADIO_BUTTON.value,
    FilterType.CHECKBOX.value,
]

DATE_FILTER_TYPES = [FilterType.TIME_SCRUBBER.value, FilterType.TIME_INPUT.value, FilterType.CALENDAR.value]

BOOL_FILTER_TYPES = [FilterType.SWITCH.value]

NUMBER_FILTER_TYPES = [FilterType.INTERVAL_SLIDER.value, FilterType.SINGLE_POINT_SLIDER.value]

GEO_FILTER_TYPES = [FilterType.CARTOGRAM.value, FilterType.ZIPCODE_INPUT.value]


class FilterTypesGroups:
    string = STRING_FILTER_TYPES
    number = NUMBER_FILTER_TYPES
    boolean = BOOL_FILTER_TYPES
    datetime = DATE_FILTER_TYPES


class FieldType:
    STRING = "string"
    DATE = "date"
    BOOLEAN = "boolean"
    NUMBER = "number"


FIELD_TYPE_CHOICES = (
    (FieldType.STRING, 'String'),
    (FieldType.DATE, 'Date'),
    (FieldType.BOOLEAN, 'Boolean'),
    (FieldType.NUMBER, 'Number'),
)


class BlockTypes:
    VIDEO = "video"
    CODE = "code"
    MARKDOWN = "markdown"
    TEXT = "text"
    IMAGE = "image"


BLOCK_TYPE_CHOICES = (
    (BlockTypes.VIDEO, 'Video'),
    (BlockTypes.CODE, 'Code'),
    (BlockTypes.MARKDOWN, 'Markdown'),
    (BlockTypes.TEXT, 'Text'),
    (BlockTypes.IMAGE, 'Image'),
)
