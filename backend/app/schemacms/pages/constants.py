TEMPLATE_NAME_MAX_LENGTH = 100
ELEMENT_NAME_MAX_LENGTH = 100


class ElementType:
    RICH_TEXT = "rich_text"
    PLAIN_TEXT = "plain_text"


ELEMENT_TYPE_CHOICES = ((ElementType.RICH_TEXT, "Rich Text"), (ElementType.PLAIN_TEXT, "Plain Text"))
