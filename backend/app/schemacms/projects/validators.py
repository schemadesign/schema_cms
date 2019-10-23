from rest_framework import validators
from rest_framework.exceptions import ValidationError


class CustomUniqueTogetherValidator(validators.UniqueTogetherValidator):
    def __init__(self, queryset, fields, key_field_name, message=None):
        super().__init__(queryset, fields, message)
        self.key_field_name = key_field_name

    def __call__(self, attrs):
        self.enforce_required_fields(attrs)
        queryset = self.queryset
        queryset = self.filter_queryset(attrs, queryset)
        queryset = self.exclude_current_instance(attrs, queryset)

        # Ignore validation if any field is None
        checked_values = [
            value for field, value in attrs.items() if field in self.fields
        ]
        if None not in checked_values and validators.qs_exists(queryset):
            raise ValidationError({self.key_field_name: self.message}, code='unique')
