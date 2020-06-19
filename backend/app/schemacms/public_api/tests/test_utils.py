import pytest

from schemacms.pages.constants import ElementType
from schemacms.public_api import utils

pytestmark = [pytest.mark.django_db]


class TestElementsHtmlFormat:
    def test_plain_text_element_html_format(self, faker, page_block_element_factory):
        value = faker.pystr()
        element = page_block_element_factory(type=ElementType.PLAIN_TEXT, plain_text=value)

        assert utils.plain_text_in_html(element) == (
            f"<div id='plain-text-{element.id}' class='element text'><p>{value}</p></div>"
        )

    def test_code_element_html_format(self, faker, page_block_element_factory):
        value = faker.pystr()
        element = page_block_element_factory(type=ElementType.CODE, code=value)

        assert utils.code_in_html(element) == (
            f"<div id='code-{element.id}' class='element code'>{value}</div>"
        )

    def test_connection_element_html_format(self, faker, page_block_element_factory):
        value = faker.pystr()
        element = page_block_element_factory(type=ElementType.CONNECTION, connection=value)

        assert utils.connection_in_html(element) == (
            f"<div id='connection-{element.id}' class='element connection'>"
            f"<a href='{value}' target='_blank'>{value}</a>"
            f"</div>"
        )

    def test_internal_connection_element_html_format(self, faker, page_block_element_factory):
        value = faker.pystr()
        element = page_block_element_factory(type=ElementType.INTERNAL_CONNECTION, internal_connection=value)

        assert utils.internal_connection_in_html(element) == (
            f"<div id='internal-connection-{element.id}' class='element internal-connection'>"
            f"<a href='{value}' target='_element'>{value}</a>"
            f"</div>"
        )

    def test_embed_video_element_html_format(self, faker, page_block_element_factory):
        width = faker.pyint()
        height = faker.pyint()
        value = faker.pystr()
        element = page_block_element_factory(
            type=ElementType.EMBED_VIDEO,
            embed_video=value,
            params={"attributes": f"width={width} height={height}"},
        )
        attributes = element.params.get("attributes", "")

        assert utils.embed_video_in_html(element) == (
            f"<div id='embed-video-{element.id}' class='element embed-video'>"
            f"<iframe src='{value}' {attributes}>"
            f"</iframe>"
            f"</div>"
        )

    def test_observable_element_html_format(self, faker, page_block_element_factory, observable_element):
        value = observable_element
        element = page_block_element_factory(type=ElementType.OBSERVABLE_HQ, observable_hq=value)

        obs_user = value.observable_user
        obs_notebook = value.observable_notebook
        obs_params = value.observable_params
        obs_cell = value.observable_cell
        script_cdn_url = "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js"

        assert utils.observable_in_html(element) == (
            f"<div id='observable-{element.id}' class='element observable'>"
            f"<script type='module'>"
            "import {Runtime, Inspector}" + f"from '{script_cdn_url}';"
            f"import define from 'https://api.observablehq.com/{obs_user}/{obs_notebook}.js{obs_params}';"
            f"const inspect = Inspector.into('#observable-{element.id}');"
            f"(new Runtime).module(define, name => (name === '{obs_cell}') && inspect());"
            f"</script>"
            f"</div>"
        )

    def test_markdown_element_html_format(self, faker, page_block_element_factory):
        value = "# Test H1 *Bold*"

        formatted_value = "<h1>Test H1 <em>Bold</em></h1>"

        element = page_block_element_factory(type=ElementType.MARKDOWN, markdown=value)

        assert utils.markdown_in_html(element) == (
            f"<div id='markdown-{element.id}' class='element markdown'>{formatted_value}</div>"
        )
