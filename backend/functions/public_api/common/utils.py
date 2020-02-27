import decimal
import json

import numpy as np


class FieldType:
    STRING = "string"
    DATE_TIME = "datetime"
    BOOLEAN = "boolean"
    NUMBER = "number"


class ProcessState:
    PENDING = "pending"
    PROCESSING = "processing"
    FAILED = "failed"
    SUCCESS = "success"


class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """

    def default(self, obj):
        if isinstance(
            obj,
            (
                np.int_,
                np.intc,
                np.intp,
                np.int8,
                np.int16,
                np.int32,
                np.int64,
                np.uint8,
                np.uint16,
                np.uint32,
                np.uint64,
            ),
        ):
            return int(obj)
        elif isinstance(obj, (np.float_, np.float16, np.float32, np.float64)):
            return float(obj)
        elif isinstance(obj, (np.ndarray,)):
            return obj.tolist()
        elif isinstance(obj, (np.nan,)):
            return None
        return json.JSONEncoder.default(self, obj)


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            if obj % 1 > 0:
                return float(obj)
            else:
                return int(obj)
        return super().default(obj)
