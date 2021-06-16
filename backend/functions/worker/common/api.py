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
    def update_datasource_meta(self, datasource_pk, **kwargs):
        url = os.path.join(self._datasource_url(datasource_pk), "update-meta")
        json_ = {**kwargs}
        response = requests.post(url, json=json_, headers=self.get_headers(), timeout=self.timeout,)

        return response

    @check_response
    def update_job_meta(self, job_pk, items, fields, preview, fields_names, fields_with_urls):
        url = os.path.join(self._job_url(job_pk), "update-meta")
        response = requests.post(
            url,
            json={
                "items": items,
                "fields": fields,
                "fields_names": fields_names,
                "preview": preview,
                "fields_with_urls": fields_with_urls,
            },
            headers=self.get_headers(),
            timeout=self.timeout,
        )
        return response

    @check_response
    def update_job_state(
        self,
        job_pk,
        state,
        source_file_path="",
        source_file_version="",
        result="",
        result_parquet="",
        error="",
    ):
        url = os.path.join(self._job_url(job_pk), "update-state")
        response = requests.post(
            url,
            json={
                "source_file_path": source_file_path,
                "source_file_version": source_file_version,
                "job_state": state,
                "result": result,
                "result_parquet": result_parquet,
                "error": error,
            },
            headers=self.get_headers(),
            timeout=self.timeout,
        )
        return response

    def refresh_ds_data(self):
        url = os.path.join(self._datasources_url(), "refresh-data")

        response = requests.post(url, json={}, headers=self.get_headers(), timeout=self.timeout,)
        return response

    def get_headers(self):
        return {"Authorization": f"Token {settings.LAMBDA_AUTH_TOKEN}"}

    def _datasource_url(self, datasource_pk) -> str:
        return os.path.join(self.backend_url, "datasources", str(datasource_pk))

    def _job_url(self, job_pk) -> str:
        return os.path.join(self.backend_url, "jobs", str(job_pk))

    def _datasources_url(self):
        return os.path.join(self.backend_url, "datasources")


schemacms_api = SchemaCMSAPI()
