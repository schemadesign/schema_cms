import json


def handle(event, context):
    return {"statusCode": 200, "headers": {}, "body": json.dumps({"message": "Public api here. Version 7"})}
