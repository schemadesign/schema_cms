from django.core.management import BaseCommand

from schemacms.utils import services


client = services.get_dynamodb_client()

tables = ["projects", "pages", "datasources"]
existing_tables = client.list_tables()["TableNames"]


class Command(BaseCommand):
    help = "Creating DynamoDB tables"

    def handle(self, *args, **options):
        tables_to_create = set(tables) - set(existing_tables)

        for table in tables_to_create:
            try:
                services.dynamo.create_table(
                    TableName=table,
                    KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
                    AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "N"}],
                    ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
                )
                self.stdout.write(self.style.SUCCESS(f"DynamoDB table {table} created!"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Create DynamoDB table {table} failed!"))
                raise Exception(f"Table {table} creation error - {e}")
