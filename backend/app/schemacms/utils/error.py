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


def transform_error_data(data):
    if isinstance(data, exceptions.ErrorDetail):
        return Error.fromErrorDetail(data).data
    elif isinstance(data, (tuple, list)):
        data = [transform_error_data(v) for v in data]
    elif isinstance(data, dict):
        for k, v in data.items():
            data[k] = transform_error_data(v)
    return data


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        response.data = transform_error_data(response.data)
    return response
