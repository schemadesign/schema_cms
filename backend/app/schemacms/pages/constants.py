TEMPLATE_NAME_MAX_LENGTH = 100
ELEMENT_NAME_MAX_LENGTH = 100


class ElementType:
    RICH_TEXT = "rich_text"
    PLAIN_TEXT = "plain_text"
    IMAGE = "image"
    CODE = "code"
    CONNECTION = "connection"
    STACK = "stack"


ELEMENT_TYPE_CHOICES = (
    (ElementType.RICH_TEXT, "Rich Text"),
    (ElementType.PLAIN_TEXT, "Plain Text"),
    (ElementType.IMAGE, "Image"),
    (ElementType.CODE, "Code"),
    (ElementType.CONNECTION, "Connection"),
    (ElementType.STACK, "Stack"),
)