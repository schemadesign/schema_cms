import json

from peewee import *

from . import settings, services

db = Proxy()


class BaseModel(Model):
    class Meta:
        database = db


class User(BaseModel):
    first_name = CharField()
    last_name = CharField()

    class Meta:
        table_name = "users_user"


class Project(BaseModel):
    title = CharField()
    owner = ForeignKeyField(User, backref="projects")
    description = TextField()
    modified = DateTimeField()
    created = DateTimeField()

    class Meta:
        table_name = "projects_project"

    def as_dict(self):
        return {
            "meta": {
                "id": self.id,
                "title": self.title,
                "description": self.description,
                "owner": f"{self.owner.first_name} {self.owner.last_name}",
                "created": self.created.strftime("%Y-%m-%d"),
                "updated": self.modified.strftime("%Y-%m-%d"),
            },
            "data_sources": self.get_data_sources(),
            "content": {"sections": self.get_sections()},
        }

    def get_data_sources(self):
        return [
            {"id": ds.id, "type": ds.type, "name": ds.name}
            for ds in self.data_sources.select()
        ]

    def get_sections(self):
        return [
            section.as_dict()
            for section in self.sections.select().where(Section.is_public == True)
        ]


class ActiveJob(BaseModel):
    result = CharField()
    error = TextField()
    job_state = CharField()

    class Meta:
        table_name = "datasources_datasourcejob"


class ActiveJobMetaData(BaseModel):
    job = ForeignKeyField(ActiveJob, backref="meta_data")
    items = IntegerField()
    fields = IntegerField()
    preview = CharField()

    class Meta:
        table_name = "datasources_datasourcejobmetadata"

    @property
    def shape(self):
        return [self.items, self.fields]


class DataSource(BaseModel):
    project = ForeignKeyField(Project, backref="data_sources")
    created_by = ForeignKeyField(User, backref="data_sources")
    modified = DateTimeField()
    created = DateTimeField()
    name = CharField()
    type = CharField()
    file = CharField()
    active_job = ForeignKeyField(ActiveJob)

    class Meta:
        table_name = "datasources_datasource"

    @property
    def result_parquet(self):
        return self.active_job.result.replace(".csv", ".parquet")

    @property
    def result_shape(self):
        return self.active_job.meta_data.get().shape

    def as_dict(self):
        return {
            "meta": {
                "id": self.name,
                "name": self.name,
                "created_by": f"{self.created_by.first_name} {self.created_by.last_name}",
                "updated": self.modified.strftime("%Y-%m-%d"),
                "created": self.created.strftime("%Y-%m-%d"),
            },
            "shape": self.result_shape,
            "filters": [],
        }

    def get_filters(self):
        return [
            filter.as_dict()
            for filter in self.filters.select().where(Filter.is_active == True)
        ]

    def get_fields(self):
        preview = services.get_s3_object(self.active_job.meta_data.get().preview)[
            "Body"
        ]

        fields = json.loads(preview.read())["fields"]
        data = {
            str(num): {"name": key, "type": value["dtype"]}
            for num, (key, value) in enumerate(fields.items())
        }

        return data


class Filter(BaseModel):
    datasource = ForeignKeyField(DataSource, backref="filters")
    name = CharField()
    filter_type = CharField()
    field = TextField()
    field_type = CharField()
    unique_items = IntegerField()
    is_active = BooleanField()

    class Meta:
        table_name = "datasources_filter"

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.filter_type,
            "field": self.field,
        }


class Section(BaseModel):
    name = CharField()
    project = ForeignKeyField(Project, backref="sections")
    is_public = BooleanField()

    class Meta:
        table_name = "pages_section"

    def as_dict(self):
        pages = [
            page.as_dict()
            for page in self.pages.select().where(
                Page.is_public == True, Page.is_template == False
            )
        ]
        return {"id": self.id, "name": self.name, "pages": pages}


class Page(BaseModel):
    section = ForeignKeyField(Section, backref="pages")
    name = CharField()
    description = TextField()
    keywords = TextField()
    created_by = ForeignKeyField(User, backref="pages")
    is_public = BooleanField()
    is_template = BooleanField()

    class Meta:
        table_name = "pages_page"

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "keywords": self.keywords,
            "created_by": f"{self.created_by.first_name} {self.created_by.last_name}",
        }

    def as_dict_detail(self):
        data = self.as_dict()
        data["blocks"] = self.get_blocks()
        return data

    def get_blocks(self):
        return [block.as_dict() for block in self.blocks.select()]


class Block(BaseModel):
    page = ForeignKeyField(Page, backref="blocks")
    name = CharField()
    order = SmallIntegerField()

    class Meta:
        table_name = "pages_pageblock"

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "order": self.order,
            "elements": self.get_elements(),
        }

    def get_elements(self):
        return [element.as_dict() for element in self.elements.select()]


class Element(BaseModel):
    block = ForeignKeyField(Block, backref="elements")
    name = CharField()
    type = CharField()
    rich_text = TextField()
    connection = CharField()
    plain_text = TextField()
    code = TextField()
    image = CharField()
    order = SmallIntegerField()

    class Meta:
        table_name = "pages_pageblockelement"

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "order": self.order,
            "value": self.get_element_value(),
        }

    def get_element_value(self):
        value = getattr(self, self.type)
        if self.type == "image":
            value = {"file_name": self.get_image_data(self.value)}

        return value

    @staticmethod
    def get_image_data(image):
        name = image.split("/")[-1]
        return name


def get_db_settings():
    db_conn = json.loads(settings.DB_CONNECTION)

    return dict(
        database=db_conn["dbname"],
        user=db_conn["username"],
        password=db_conn["password"],
        host=db_conn["host"],
        port=db_conn["port"],
        connect_timeout=db_conn.get("connect_timeout", 5),
    )


def initialize():
    runtime_db = PostgresqlDatabase(**get_db_settings())
    db.initialize(runtime_db)
