import datetime
import decimal
import json
import uuid


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        if isinstance(o, uuid.UUID):
            return o.hex
        if isinstance(o, datetime.datetime):
            return o.isoformat()
        return super().default(o)
