import csv
import faker.providers
import io

from django.core.files import base


def make_csv(cols_num=3, rows_num=1):
    csv_file = io.StringIO()
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow([f"col_{i}" for i in range(cols_num)])
    for i in range(rows_num):
        csv_writer.writerow([i for i in range(cols_num)])

    return io.BytesIO(csv_file.getvalue().encode())


def make_script(code=b"test = 123"):
    script = io.BytesIO()
    script.write(code)
    return script


class CSVProvider(faker.providers.BaseProvider):
    def csv_data(self, cols_num=3, rows_num=1):
        return make_csv(cols_num=cols_num, rows_num=rows_num).getvalue()

    def csv_upload_file(self, filename="test.csv", cols_num=3, rows_num=1):
        return base.ContentFile(
            content=make_csv(cols_num=cols_num, rows_num=rows_num).getvalue(), name=filename
        )

    def make_csv(self, *args, **kwargs):
        return make_csv(*args, **kwargs)


class PythonScriptProvider(faker.providers.BaseProvider):
    def make_script(self, code, *args, **kwargs):
        return make_script(code, *args, **kwargs)

    def python_upload_file(self, code, filename="test.py"):
        return base.ContentFile(content=make_script(code).getvalue(), name=filename)
