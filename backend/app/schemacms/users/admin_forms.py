from django import forms
from django.contrib import auth


USER_MODEL = auth.get_user_model()


class InviteUserForm(forms.ModelForm):
    class Meta:
        model = USER_MODEL
        fields = ("email", "first_name", "last_name", "role")
        required = ("email", "first_name", "last_name")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for required in self.Meta.required:
            self.fields[required].required = True

    def save(self, commit=True):
        self.instance.username = USER_MODEL.generate_random_username()
        self.instance.is_active = False
        return super().save(commit=commit)

    def clean_email(self):
        email = self.cleaned_data["email"]
        if USER_MODEL.objects.filter(email=email).exists():
            raise forms.ValidationError('The user with email "{}" already exists'.format(email))
        return email
