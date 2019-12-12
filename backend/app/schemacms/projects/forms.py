from django import forms
from .models import Block
from .constants import BlockTypes


class BlockForm(forms.ModelForm):
    class Meta:
        model = Block
        fields = ("page", "name", "type", "content", "is_active")

    def clean(self):
        type_ = self.cleaned_data["type"]
        images = self.cleaned_data["images"]

        if type_ == BlockTypes.IMAGE and not images:
            message = f"Please select image to upload."
            raise forms.ValidationError(message)

        if images and type_ != BlockTypes.IMAGE:
            message = f"For image upload use Image Uploaded block type."
            raise forms.ValidationError(message)
