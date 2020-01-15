from django import forms

from softdelete.admin import SoftDeleteObjectAdminForm

from .models import Block
from .constants import BlockTypes


class BlockForm(SoftDeleteObjectAdminForm):
    class Meta:
        model = Block
        fields = ("page", "name", "type", "content", "is_active")

    def clean_type(self, *args, **kwargs):
        type_ = self.cleaned_data["type"]

        if self.has_changed() and "type" not in self.changed_data:
            return type_

        if type_ == BlockTypes.IMAGE and not self.files:
            message = f"Please select at least one image to upload."
            raise forms.ValidationError(message)

        if self.files and type_ != BlockTypes.IMAGE:
            message = f"For image upload use Image Uploaded block type."
            raise forms.ValidationError(message)

        return type_
