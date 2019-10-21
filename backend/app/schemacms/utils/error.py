import dataclasses

from rest_framework import exceptions
from rest_framework.views import exception_handler


@dataclasses.dataclass
class Error:
    message: str
    code: str

    @classmethod
    def fromErrorDetail(cls, ed):
        return cls(message=str(ed), code=ed.code)

    @property
    def data(self):
        return {"message": self.message, "code": self.code}


def transform_error_detail_list(l):
    return [
        Error.fromErrorDetail(e).data if isinstance(e, exceptions.ErrorDetail) else e
        for e in l
    ]


def transform_error_detail_dict(d):
    return {
        k: transform_error_detail_list(v) if isinstance(v, list) else Error.fromErrorDetail(v).data
        for k, v in d.items()
    }


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        if isinstance(response.data, list):
            response.data = transform_error_detail_list(response.data)
        elif isinstance(response.data, dict):
            response.data = transform_error_detail_dict(response.data)
        elif isinstance(response.data, exceptions.ErrorDetail):
            response.data = Error.fromErrorDetail(response.data).data
    return response
