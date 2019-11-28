from django import forms
from .models import Block
from .constants import BlockTypes


class BlockForm(forms.ModelForm):
    class Meta:
        model = Block
        fields = ("page", "name", "type", "content", "image", "is_active")

    def clean(self):
        type_ = self.cleaned_data["type"]
        image = self.cleaned_data["image"]

        if type_ == BlockTypes.IMAGE and not image:
            message = f"Please select image to upload."
            raise forms.ValidationError(message)

        if image and type_ != BlockTypes.IMAGE:
            message = f"For image upload use Image Uploaded block type."
            raise forms.ValidationError(message)
