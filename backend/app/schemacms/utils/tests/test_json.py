import datetime
import decimal
import uuid

import pytest

from schemacms.utils import json as json_


class TestCustomJSONEncoder:
    @pytest.mark.parametrize(
        "obj, encode_fn",
        [
            (decimal.Decimal("0.01"), float),
            (uuid.uuid4(), lambda o: o.hex),
            (datetime.datetime.now(), datetime.datetime.isoformat),
        ],
    )
    def test_encode(self, obj, encode_fn):
        ret = json_.CustomJSONEncoder().default(obj)

        assert ret == encode_fn(obj)
