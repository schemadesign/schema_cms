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
    STACK = "stack"


ELEMENT_TYPE_CHOICES = (
    (ElementType.MARKDOWN, "Markdown"),
    (ElementType.PLAIN_TEXT, "Plain Text"),
    (ElementType.IMAGE, "Image"),
    (ElementType.CODE, "Code"),
    (ElementType.CONNECTION, "Connection"),
    (ElementType.STACK, "Stack"),
)
