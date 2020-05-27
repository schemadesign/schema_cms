import markdown


MARKDOWN_EXTENSIONS = ["sane_lists", "pymdownx.tasklist", "pymdownx.betterem", "pymdownx.tilde"]


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


def plain_text_in_html(element):
    html_value = f"<div id='plain-text-{element.id}' class='element text'><p>{element.plain_text}</p></div>"

    return html_value


def markdown_in_html(element):
    formatted_element = markdown.markdown(element.markdown, extensions=MARKDOWN_EXTENSIONS)
    html_value = f"<div id='markdown-{element.id}' class='element markdown'>{formatted_element}</div>"

    return html_value


def code_in_html(element):
    html_value = f"<div id='code-{element.id}' class='element code'>{element.code}</div>"

    return html_value


def video_in_html(element):
    html_value = (
        f"<div id='code-{element.id}' class='element video'>"
        f"<iframe width='640' height='480' src='{element.video}'"
        f"frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'"
        f"allowfullscreen>"
        f"</iframe>"
        f"</div>"
    )

    return html_value
