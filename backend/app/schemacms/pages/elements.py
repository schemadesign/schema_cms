import base64

from django.core.files.base import ContentFile

from . import constants
from ..states.models import State
from ..pages.models import CustomElementSet, Page


class BaseElement:
    def __init__(self, element_type):
        self.element_type = element_type

    def get_attribute(self, instance):
        return getattr(instance, self.element_type)

    @staticmethod
    def to_representation(value):
        return value

    @staticmethod
    def to_internal_value(data):
        return data


class PlainTextElement(BaseElement):
    pass


class MarkdownElement(BaseElement):
    pass


class CodeElement(BaseElement):
    pass


class ConnectionElement(BaseElement):
    pass


class InternalElement(BaseElement):
    def __init__(self, element_type):
        self.element_type = element_type

    @staticmethod
    def to_representation(value: Page):
        return value.id

    def get_attribute(self, instance):
        return getattr(instance, self.element_type)

    @staticmethod
    def to_internal_value(data):
        if not data:
            return None

        return Page.objects.get(pk=data)


class EmbedVideoElement(BaseElement):
    pass


class StateElement(BaseElement):
    @staticmethod
    def to_representation(value):
        return value.id

    def get_attribute(self, instance):
        return getattr(instance, self.element_type)

    @staticmethod
    def to_internal_value(data):
        if not data:
            return None

        return State.objects.get(pk=data)


class ObservableElement(BaseElement):
    def get_attribute(self, instance):
        observable_element = getattr(instance, self.element_type)

        return {
            "observable_user": observable_element.observable_user,
            "observable_notebook": observable_element.observable_notebook,
            "observable_cell": observable_element.observable_cell,
            "observable_params": observable_element.observable_params,
        }


class CustomElement(BaseElement):
    def get_attribute(self, instance):
        from .serializers import PageBlockElementSerializer

        elements_sets_ids = instance.sets_elements.values_list("custom_element_set", flat=True).distinct()
        res = [
            {
                "id": elements_set.id,
                "order": elements_set.order,
                "elements": PageBlockElementSerializer(
                    elements_set.elements.order_by("order"), many=True
                ).data,
            }
            for elements_set in CustomElementSet.objects.filter(id__in=elements_sets_ids).order_by("order")
        ]

        return res


class ImageElement(BaseElement):
    def to_representation(self, value):
        if not value:
            return {}

        return {"file": value.url, "file_name": self.get_file_name(value.name)}

    def to_internal_value(self, data):
        if not data:
            return None

        file = data["file"]
        file_name = data["file_name"]

        if "data:" in file and ";base64," in file:
            header, file = file.split(";base64,")
        else:
            return False

        decoded_file = base64.b64decode(file)

        return ContentFile(decoded_file, name=f"{file_name}")

    @staticmethod
    def get_file_name(file):
        return file.split("/")[-1]


class FileElement(ImageElement):
    pass


ELEMENTS_TYPES = {
    constants.ElementType.CODE: CodeElement,
    constants.ElementType.CONNECTION: CodeElement,
    constants.ElementType.CUSTOM_ELEMENT: CustomElement,
    constants.ElementType.EMBED_VIDEO: EmbedVideoElement,
    constants.ElementType.FILE: FileElement,
    constants.ElementType.IMAGE: ImageElement,
    constants.ElementType.INTERNAL_CONNECTION: InternalElement,
    constants.ElementType.MARKDOWN: MarkdownElement,
    constants.ElementType.OBSERVABLE_HQ: ObservableElement,
    constants.ElementType.PLAIN_TEXT: PlainTextElement,
    constants.ElementType.STATE: StateElement,
}
