import os
import requests

from . import settings


class SchemaCMSAPI:
    def __init__(self):
        self.backend_url = settings.BACKEND_URL

    def update_job_state(self, job_pk, state, result=None, error=None):
        url = os.path.join(self._job_url(job_pk), "update-state")
        response = requests.post(
            url,
            json={"state": state, "result": result, "error": error},
            headers={'Authorization': f'Token {settings.LAMBDA_AUTH_TOKEN}'}
        )
        response.raise_for_status()
        return response

    def _job_url(self, job_id):
        return os.path.join(self.backend_url, "jobs", str(job_id))


schemacms_api = SchemaCMSAPI()
