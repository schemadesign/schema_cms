import markdown

from django.urls import reverse


MARKDOWN_EXTENSIONS = [
    "sane_lists",
    "pymdownx.extra",
    "pymdownx.tasklist",
    "pymdownx.betterem",
    "pymdownx.tilde",
]


def connection_in_html(element):
    html_value = (
        f"<div id='connection-{element.id}' class='element connection'>"
        f"<a href='{element.connection}' target='_blank'>{element.connection}</a>"
        f"</div>"
    )

    return html_value


def internal_connection_in_html(element):
    html_value = (
        f"<div id='internal-connection-{element.id}' class='element internal-connection'>"
        f"<a href='{element.internal_connection}' target='_element'>{element.internal_connection}</a>"
        f"</div>"
    )

    return html_value


def observable_in_html(element):
    obs_user = element.observable_hq.observable_user
    obs_notebook = element.observable_hq.observable_notebook
    obs_params = element.observable_hq.observable_params
    obs_cell = element.observable_hq.observable_cell
    script_cdn_url = "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js"

    html_value = (
        f"<div id='observable-{element.id}' class='element observable'>"
        f"<script type='module'>"
        "import {Runtime, Inspector}" + f"from '{script_cdn_url}';"
        f"import define from 'https://api.observablehq.com/{obs_user}/{obs_notebook}.js{obs_params}';"
        f"const inspect = Inspector.into('#observable-{element.id}');"
        f"(new Runtime).module(define, name => (name === '{obs_cell}') && inspect());"
        f"</script>"
        f"</div>"
    )

    return html_value


def custom_in_html(element_id, element_data):
    sets_with_elements = []

    for element_set in element_data:
        sets_with_elements.append(f"<div id='set-{element_set['id']}' class='element custom-element-set'>")
        for element in element_set["elements"]:
            sets_with_elements.append(element["html"])
        sets_with_elements.append("</div>")

    html_value = (
        f"<div id='custom-{element_id}' class='element custom-element'>"
        f"{''.join(sets_with_elements)}"
        f"</div>"
    )

    return html_value


def image_in_html(element):
    if not element.image:
        file_name = ""
        image = ""
    else:
        file_name = element.get_original_file_name()[1]
        image = element.image.url

    html_value = (
        f"<div id='image-{element.id}' class='element image'>"
        f"<figure>"
        f"<img src='{image}' alt='{file_name}'>"
        f"</figure>"
        f"</div>"
    )

    return html_value


def file_in_html(element):
    if not element.file:
        file_name = ""
        file = ""
    else:
        file_name = element.get_original_file_name(image=False)[1]
        file = element.file.url

    html_value = (
        f"<div id='file-{element.id}' class='element file'>"
        f"<a href='{file}' download>{file_name}</a>"
        f"</div>"
    )

    return html_value


def plain_text_in_html(element):
    html_value = f"<div id='plain-text-{element.id}' class='element text'><p>{element.plain_text}</p></div>"

    return html_value


def state_in_html(element):
    value = generate_state_element_url(element.state)

    html_value = f"<div id='state-{element.id}' class='element state'><p>{value}</p></div>"

    return html_value


def generate_state_element_url(state):
    datasource = state.datasource

    url = reverse("public_api:pa-datasources-records", args=[datasource.id])
    return f"{url}?{state.build_filters_query_params()}"


def markdown_in_html(element):
    formatted_element = markdown.markdown(element.markdown, extensions=MARKDOWN_EXTENSIONS)
    html_value = f"<div id='markdown-{element.id}' class='element markdown'>{formatted_element}</div>"

    return html_value


def code_in_html(element):
    html_value = f"<div id='code-{element.id}' class='element code'>{element.code}</div>"

    return html_value


def embed_video_in_html(element):
    if not element.embed_video:
        return f"<div id='embed-video-{element.id}' class='element embed_video'>" f"</div>"

    attributes = element.params.get("attributes", "")

    html_value = (
        f"<div id='embed-video-{element.id}' class='element embed_video'>"
        f"<iframe src='{element.embed_video}' {attributes}>"
        f"</iframe>"
        f"</div>"
    )

    return html_value
