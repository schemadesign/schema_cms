"""gunicorn WSGI server configuration."""
from multiprocessing import cpu_count


def max_workers():
    return cpu_count()


bind = "0.0.0.0:8000"
max_requests = 1000
accesslog = "-"
errorlog = "-"
workers = max_workers()
timeout = 600
