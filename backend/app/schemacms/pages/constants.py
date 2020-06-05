TEMPLATE_NAME_MAX_LENGTH = 100
ELEMENT_NAME_MAX_LENGTH = 100
SECTION_NAME_MAX_LENGTH = 100
PAGE_DISPLAY_NAME_MAX_LENGTH = 100


class ElementType:
    CODE = "code"
    CONNECTION = "connection"
    CUSTOM_ELEMENT = "custom_element"
    IMAGE = "image"
    INTERNAL_CONNECTION = "internal_connection"
    MARKDOWN = "markdown"
    OBSERVABLE_HQ = "observable_hq"
    PLAIN_TEXT = "plain_text"
    EMBED_VIDEO = "embed_video"


class ObservableFieldType:
    OBSERVABLE_USER = "observable_user"
    OBSERVABLE_NOTEBOOK = "observable_notebook"
    OBSERVABLE_CELL = "observable_cell"
    OBSERVABLE_PARAMS = "observable_params"


ELEMENT_TYPE_CHOICES = (
    (ElementType.CODE, "Code"),
    (ElementType.CONNECTION, "Connection"),
    (ElementType.CUSTOM_ELEMENT, "Custom Element"),
    (ElementType.IMAGE, "Image"),
    (ElementType.INTERNAL_CONNECTION, "Internal Connection"),
    (ElementType.MARKDOWN, "Markdown"),
    (ElementType.OBSERVABLE_HQ, "ObservableHQ"),
    (ElementType.PLAIN_TEXT, "Plain Text"),
    (ElementType.EMBED_VIDEO, "Embed Video"),
)

OBSERVABLE_FIELD_TYPE_CHOICES = (
    (ObservableFieldType.OBSERVABLE_USER, "ObservableHQ User"),
    (ObservableFieldType.OBSERVABLE_NOTEBOOK, "ObservableHQ Notebook"),
    (ObservableFieldType.OBSERVABLE_CELL, "ObservableHQ Cell"),
    (ObservableFieldType.OBSERVABLE_PARAMS, "ObservableHQ Params"),
)
