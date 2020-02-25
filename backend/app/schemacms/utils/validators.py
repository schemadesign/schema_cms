import itertools

from rest_framework import validators
from rest_framework.exceptions import ValidationError


def generate_code(fields):
    all_fields = (x.title() for x in itertools.chain(fields, ["unique"]))
    first = next(all_fields)
    return "".join(itertools.chain([first[0].lower(), first[1:]], all_fields))


class CustomUniqueValidator(validators.UniqueValidator):
    def __init__(self, *args, **kwargs):
        self.prefix = kwargs.pop("prefix", "")
        super().__init__(*args, **kwargs)

    def __call__(self, value):
        queryset = self.queryset
        queryset = self.filter_queryset(value, queryset)
        queryset = self.exclude_current_instance(queryset)
        if validators.qs_exists(queryset):
            raise ValidationError(self.message, code=generate_code(fields=[self.prefix, self.field_name]))


class CustomUniqueTogetherValidator(validators.UniqueTogetherValidator):
    def __init__(self, *args, **kwargs):
        self.code = kwargs.pop("code", None)
        self.key_field_name = kwargs.pop("key_field_name")
        super().__init__(*args, **kwargs)

    def __call__(self, attrs):
        self.enforce_required_fields(attrs)
        queryset = self.queryset
        queryset = self.filter_queryset(attrs, queryset)
        queryset = self.exclude_current_instance(attrs, queryset)

        # Ignore validation if any field is None
        checked_values = [value for field, value in attrs.items() if field in self.fields]
        if None not in checked_values and validators.qs_exists(queryset):
            raise ValidationError(
                {self.key_field_name: self.message}, code=self.code or generate_code(fields=self.fields)
            )
