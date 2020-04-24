TEMPLATE_NAME_MAX_LENGTH = 25
ELEMENT_NAME_MAX_LENGTH = 25
SECTION_NAME_MAX_LENGTH = 25
PAGE_DISPLAY_NAME_MAX_LENGTH = 25


class ElementType:
    MARKDOWN = "markdown"
    PLAIN_TEXT = "plain_text"
    IMAGE = "image"
    CODE = "code"
    CONNECTION = "connection"
    INTERNAL_CONNECTION = "internal_connection"
    CUSTOM_ELEMENT = "custom_element"

class ObservableFieldType:
    OBSERVABLE_USER = "observable_user"
    OBSERVABLE_NOTEBOOK = "observable_notebook"
    OBSERVABLE_CELL = "observable_cell"


ELEMENT_TYPE_CHOICES = (
    (ElementType.MARKDOWN, "Markdown"),
    (ElementType.PLAIN_TEXT, "Plain Text"),
    (ElementType.IMAGE, "Image"),
    (ElementType.CODE, "Code"),
    (ElementType.CONNECTION, "Connection"),
    (ElementType.INTERNAL_CONNECTION, "Internal Connection"),
    (ElementType.CUSTOM_ELEMENT, "Custom Element"),
)

OBSERVABLE_FIELD_TYPE_CHOICES = (
    (ObservableFieldType.OBSERVABLE_USER, "ObservableHQ User")
    (ObservableFieldType.OBSERVABLE_NOTEBOOK, "ObservableHQ Notebook")
    (ObservableFieldType.OBSERVABLE_CELL, "ObservableHQ Cell")
)
