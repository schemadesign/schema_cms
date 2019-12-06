import logging
import json
import functools
import os
import requests

from . import settings


def check_response(fn):
    @functools.wraps(fn)
    def _check_response(*args, **kwargs):
        response = fn(*args, **kwargs)
        response.raise_for_status()
        return response

    return _check_response


class SchemaCMSAPI:
    def __init__(self):
        self.backend_url = settings.BACKEND_URL
        self.timeout = 20

    @check_response
    def update_datasource_meta(self, datasource_pk, items, fields, preview_data):
        url = os.path.join(self._datasource_url(datasource_pk), "update-meta")
        response = requests.post(
            url,
            json={
                "items": items,
                "fields": fields,
                "preview_data": json.loads(preview_data),
            },
            headers=self.get_headers(),
            timeout=self.timeout,
        )
        return response

    @check_response
    def update_job_meta(self, job_pk, items, fields, preview_data):
        url = os.path.join(self._job_url(job_pk), "update-meta")
        response = requests.post(
            url,
            json={
                "items": items,
                "fields": fields,
                "preview_data": json.loads(preview_data),
            },
            headers=self.get_headers(),
            timeout=self.timeout,
        )
        return response

    @check_response
    def update_job_state(self, job_pk, state, result=None, error=None):
        url = os.path.join(self._job_url(job_pk), "update-state")
        response = requests.post(
            url,
            json={"job_state": state, "result": result, "error": error},
            headers=self.get_headers(),
            timeout=self.timeout,
        )
        return response

    def get_headers(self):
        return {"Authorization": f"Token {settings.LAMBDA_AUTH_TOKEN}"}

    def _datasource_url(self, datasource_pk) -> str:
        return os.path.join(self.backend_url, "datasources", str(datasource_pk))

    def _job_url(self, job_pk) -> str:
        return os.path.join(self.backend_url, "jobs", str(job_pk))


schemacms_api = SchemaCMSAPI()
