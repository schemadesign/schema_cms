from urllib import parse


def append_query_string_params(url: str, params: dict) -> str:
    """Safe append new query string params to url

    :param url:
    :param params: dict of query string params
    :return: url with new query string params
    """

    urlsplit = parse.urlsplit(url)

    qs_params = parse.parse_qs(urlsplit.query)
    qs_params.update(params)

    return parse.urlunsplit(
        (
            urlsplit.scheme,
            urlsplit.netloc,
            urlsplit.path,
            parse.urlencode(qs_params, doseq=True),
            urlsplit.fragment,
        )
    )
