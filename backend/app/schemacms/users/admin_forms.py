import typing
from django import forms
from django.contrib import auth
from django.contrib.auth import forms as auth_forms


USER_MODEL = auth.get_user_model()


class UserFormMixin:
    required_fields: typing.Iterator = ("first_name", "last_name", "email")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for required_field in self.required_fields:
            self.fields[required_field].required = True


class UserChangeForm(UserFormMixin, auth_forms.UserChangeForm):
    pass


class InviteUserForm(UserFormMixin, forms.ModelForm):
    class Meta:
        model = USER_MODEL
        fields = ("email", "first_name", "last_name", "role")

    def save(self, commit=True):
        self.instance.username = USER_MODEL.generate_random_username()
        self.instance.is_active = False
        return super().save(commit=commit)

    def clean_email(self):
        email = self.cleaned_data["email"]
        if USER_MODEL.objects.filter(email=email).exists():
            raise forms.ValidationError('The user with email "{}" already exists'.format(email))
        return email
