TEMPLATE_NAME_MAX_LENGTH = 100
ELEMENT_NAME_MAX_LENGTH = 100
SECTION_NAME_MAX_LENGTH = 100
PAGE_DISPLAY_NAME_MAX_LENGTH = 100


class ElementType:
    CODE = "code"
    CONNECTION = "connection"
    CUSTOM_ELEMENT = "custom_element"
    EMBED_VIDEO = "embed_video"
    FILE = "file"
    IMAGE = "image"
    INTERNAL_CONNECTION = "internal_connection"
    MARKDOWN = "markdown"
    OBSERVABLE_HQ = "observable_hq"
    PLAIN_TEXT = "plain_text"
    STATE = "state"


ELEMENT_TYPE_CHOICES = (
    (ElementType.CODE, "Code"),
    (ElementType.CONNECTION, "Connection"),
    (ElementType.CUSTOM_ELEMENT, "Custom Element"),
    (ElementType.EMBED_VIDEO, "Embed Video"),
    (ElementType.FILE, "File"),
    (ElementType.IMAGE, "Image"),
    (ElementType.INTERNAL_CONNECTION, "Internal Connection"),
    (ElementType.MARKDOWN, "Markdown"),
    (ElementType.OBSERVABLE_HQ, "ObservableHQ"),
    (ElementType.PLAIN_TEXT, "Plain Text"),
    (ElementType.STATE, "State"),
)


class ObservableFieldType:
    OBSERVABLE_USER = "observable_user"
    OBSERVABLE_NOTEBOOK = "observable_notebook"
    OBSERVABLE_CELL = "observable_cell"
    OBSERVABLE_PARAMS = "observable_params"


OBSERVABLE_FIELD_TYPE_CHOICES = (
    (ObservableFieldType.OBSERVABLE_USER, "ObservableHQ User"),
    (ObservableFieldType.OBSERVABLE_NOTEBOOK, "ObservableHQ Notebook"),
    (ObservableFieldType.OBSERVABLE_CELL, "ObservableHQ Cell"),
    (ObservableFieldType.OBSERVABLE_PARAMS, "ObservableHQ Params"),
)


class PageState:
    DRAFT = "draft"
    PUBLISHED = "published"
    WAITING_TO_REPUBLISH = "waiting_to_republish"


PAGE_STATE_CHOICES = (
    (PageState.DRAFT, "draft"),
    (PageState.PUBLISHED, "published"),
    (PageState.WAITING_TO_REPUBLISH, "waiting to republish"),
)
