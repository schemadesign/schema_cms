from django.core.management import BaseCommand

from schemacms.projects import models, services


dynamodb = services.get_dynamodb()

tables = ["projects", "pages", "views", "datasources"]


class Command(BaseCommand):
    help = 'Creating and updating wrangling scripts in database'

    def handle(self, *args, **options):
        for table in tables:
            dynamodb.create_table(
                TableName=table,
                KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
                AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'N'},],
                ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5},
            )
