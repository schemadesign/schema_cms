import json
import logging
import boto3


logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = boto3.client("ssm")


with open("ssm_parameters.json") as config_file:
    parameters = json.load(config_file)


for param in parameters:
    kwargs = dict(
        Name=param.get("key"),
        Value=param.get("value"),
        Type=param.get("type"),
        Overwrite=True,
        Tier="Standard",
        DataType="text",
    )

    if param.get("type") == "SecureString":
        kwargs["KeyId"] = "alias/schema-cms"

    try:
        client.put_parameter(**kwargs)
        logger.info(f"Parameter {param.get('value')} created")
    except Exception as e:
        logger.critical(f"Parameter {param.get('value')} creation fail - {e}")
        raise
