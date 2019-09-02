import io
import os
from urllib import parse

import django.utils.encoding
from django.conf import settings
from django.core.files import storage


class FileBuffer(io.BytesIO):
    def close(self, force=False):
        if force:
            super().close()


class InMemoryStorage(storage.Storage):
    """Storage only for tests

    Save all files in memory for each test
    """

    file_class = FileBuffer

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.files = {}  # key=filename, value=file object

    def _open(self, name, *args, **kwargs):
        try:
            f = self.get_file(name)
            f.seek(0)
            return f
        except ValueError:
            buf = self.file_class()
            self.files[name] = buf
            return buf

    def _save(self, name, content):
        file_ = self._open(name)
        for line in content:
            file_.write(django.utils.encoding.smart_bytes(line))
        file_.seek(0)
        return name

    def delete(self, name):
        try:
            del self.files[name]
        except KeyError:
            raise ValueError(f"File not found: {name}")

    def exists(self, name):
        try:
            return bool(self.get_file(name))
        except ValueError:
            return False

    def path(self, name):
        return name

    @property
    def location(self):
        return settings.MEDIA_ROOT

    def url(self, name):
        media_url = settings.MEDIA_URL
        return parse.urljoin(f"http://localhost:8000/{media_url}", name)

    def size(self, name):
        file_ = self.get_file(name)
        pos = file_.tell()
        size = file_.seek(0, 1)
        file_.seek(pos, 0)
        return size

    def get_file(self, name):
        try:
            f = self.files[name]
            f.name = name
            return f
        except KeyError:
            raise ValueError("File does not exist")

    def close_all(self):
        for name, file_ in self.files.items():
            file_.close(force=True)
        self.files = {}
