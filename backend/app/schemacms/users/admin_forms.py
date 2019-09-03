import uuid

from django import forms
from django.contrib import auth


USER_MODEL = auth.get_user_model()


class InviteUserForm(forms.ModelForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = USER_MODEL
        fields = ("email", "role")

    def save(self, commit=True):
        self.instance.username = uuid.uuid4().hex
        self.instance.is_active = False
        return super().save(commit=commit)

    def clean_email(self):
        email = self.cleaned_data["email"]
        if USER_MODEL.objects.filter(email=email).exists():
            raise forms.ValidationError('The user with email "{}" already exists'.format(email))
        return email
