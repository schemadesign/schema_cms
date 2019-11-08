from enum import Enum


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

SCRIPT_NAME_MAX_LENGTH = 50


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
    date = DATE_FILTER_TYPES


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
