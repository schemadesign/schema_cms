from django.core.files.base import ContentFile
import pytest

from schemacms.projects import constants, forms


pytestmark = [pytest.mark.django_db]


class TestBlockAdminForm:
    @pytest.mark.parametrize(
        'name, type_, content, files',
        [
            ('markdown_text', constants.BlockTypes.TEXT, "example", {}),
            ('code_snippet', constants.BlockTypes.CODE, "example", {}),
            ('valid_image', constants.BlockTypes.IMAGE, "", {ContentFile("test_file")}),
        ],
    )
    def test_valid_forms(self, page, name, type_, content, files):
        form = forms.BlockForm(
            {
                "page": page.id,
                "name": name,
                "type": type_,
                "content": content,
                "is_active": True,
                "deleted": False,
            }
        )

        form.files = files

        assert form.is_valid() is True

    @pytest.mark.parametrize(
        'name, type_, content, files',
        [
            ('invalid_block_1', constants.BlockTypes.CODE, "", {ContentFile("test_file")}),
            ('invalid_block_2', constants.BlockTypes.IMAGE, "", {}),
        ],
    )
    def test_error_on_sending_type_image_without_file(self, page, name, type_, content, files):
        form = forms.BlockForm(
            {
                "page": page.id,
                "name": name,
                "type": type_,
                "content": content,
                "is_active": True,
                "deleted": False,
            }
        )

        form.files = files
        assert form.is_valid() is False
