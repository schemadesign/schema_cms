import json

from peewee import *
import markdown2

from . import settings, services

db = Proxy()


class ElementType:
    CODE = "code"
    MARKDOWN = "markdown"
    PLAIN_TEXT = "plain_text"
    CONNECTION = "connection"
    INTERNAL_CONNECTION = "internal_connection"
    IMAGE = "image"
    CUSTOM_ELEMENT = "custom_element"
    OBSERVABLE_HQ = "observable_hq"


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
    deleted_at = DateTimeField()

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
            for ds in self.data_sources.select().where(
                DataSource.deleted_at == None, DataSource.active_job != None
            )
        ]

    def get_sections(self):
        return [
            section.as_dict()
            for section in self.sections.select().where(
                Section.is_public == True, Section.deleted_at == None
            )
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
    deleted_at = DateTimeField()

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
            "fields": self.get_fields(),
            "filters": [],
        }

    def as_dict_list(self):
        return {
            "id": self.name,
            "name": self.name,
            "created_by": f"{self.created_by.first_name} {self.created_by.last_name}",
            "updated": self.modified.strftime("%Y-%m-%d"),
            "created": self.created.strftime("%Y-%m-%d"),
        }

    def get_filters(self):
        return [
            filter.as_dict()
            for filter in self.filters.select().where(
                Filter.is_active == True, Filter.deleted_at == None
            )
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
    deleted_at = DateTimeField()

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
    slug = CharField()
    project = ForeignKeyField(Project, backref="sections")
    is_public = BooleanField()
    deleted_at = DateTimeField()

    class Meta:
        table_name = "pages_section"

    def as_dict(self):
        pages = [
            page.as_dict()
            for page in self.pages.select().where(
                Page.is_public == True,
                Page.is_template == False,
                Page.deleted_at == None,
            )
        ]
        return {"id": self.id, "name": self.name, "slug": self.slug, "pages": pages}


class PageTemplate(BaseModel):
    name = CharField()

    class Meta:
        table_name = "pages_page"


class Page(BaseModel):
    section = ForeignKeyField(Section, backref="pages")
    project = ForeignKeyField(Project, backref="pages")
    template = ForeignKeyField(PageTemplate, backref="pages")
    name = CharField()
    slug = CharField()
    description = TextField()
    keywords = TextField()
    created_by = ForeignKeyField(User, backref="pages")
    is_public = BooleanField()
    is_template = BooleanField()
    deleted_at = DateTimeField()
    modified = DateTimeField()

    class Meta:
        table_name = "pages_page"

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "template": self.template.name,
            "slug": self.slug,
            "description": self.description,
            "keywords": self.keywords,
            "created_by": f"{self.created_by.first_name} {self.created_by.last_name}",
            "updated": self.modified.strftime("%Y-%m-%d"),
        }

    def as_dict_detail(self):
        data = self.as_dict()
        data["blocks"] = self.get_blocks()

        return data

    def get_blocks(self):
        return [
            block.as_dict()
            for block in self.blocks.select().where(Block.deleted_at == None)
        ]


class Block(BaseModel):
    page = ForeignKeyField(Page, backref="blocks")
    name = CharField()
    order = SmallIntegerField()
    deleted_at = DateTimeField()

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
        return [
            element.as_dict()
            for element in self.elements.select().where(
                Element.deleted_at == None, Element.custom_element == None
            )
        ]


class ObservableElement(BaseModel):
    observable_user = TextField()
    observable_notebook = TextField()
    observable_cell = TextField()

    class Meta:
        table_name = "pages_pageblockobservableelement"

    def as_dict(self):
        return {
            "observable_user": self.observable_user,
            "observable_notebook": self.observable_notebook,
            "observable_cell": self.observable_cell,
        }


class Element(BaseModel):
    block = ForeignKeyField(Block, backref="elements")
    name = CharField()
    type = CharField()
    markdown = TextField()
    connection = CharField()
    plain_text = TextField()
    internal_connection = TextField()
    custom_element = ForeignKeyField("self", backref="elements")
    observable_hq = ForeignKeyField(ObservableElement, backref="block_element")
    code = TextField()
    image = CharField()
    order = SmallIntegerField()
    deleted_at = DateTimeField()

    class Meta:
        table_name = "pages_pageblockelement"

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "order": self.order,
            "value": self.get_element_value(),
            "html": self.get_value_in_html(),
        }

    def get_element_value(self):
        if self.type == ElementType.IMAGE:
            return {
                "file_name": self.get_image_data(self.image),
                "image": "{}/{}/{}".format(
                    services.s3.meta.endpoint_url,
                    settings.AWS_STORAGE_PAGES_BUCKET_NAME,
                    self.image,
                ),
            }

        if self.type == ElementType.OBSERVABLE_HQ:
            return self.observable_hq.as_dict()

        if self.type == ElementType.CUSTOM_ELEMENT:
            return self.get_custom_element_data(self)

        return getattr(self, self.type)

    @staticmethod
    def get_image_data(image):
        name = image.split("/")[-1]
        return name

    @staticmethod
    def get_custom_element_data(custom_element):
        elements = []

        for element in custom_element.elements:
            data = {
                "elements": {
                    "id": element.id,
                    "name": element.name,
                    "type": element.type,
                    "value": getattr(element, element.type),
                }
            }
            elements.append(data)

        return elements

    def get_value_in_html(self):
        if self.type == ElementType.CONNECTION:
            html_value = (
                f"<div id='{self.id}' class='element connection'>"
                f"<a href='{self.connection}' target='_blank'>{self.connection}</a>"
                f"</div>"
            )

            return html_value

        if self.type == ElementType.INTERNAL_CONNECTION:
            html_value = (
                f"<div id='{self.id}' class='element internal-connection'>"
                f"<a href='{self.connection}' target='_self'>{self.connection}</a>"
                f"</div>"
            )

            return html_value

        if self.type == ElementType.OBSERVABLE_HQ:
            html_value = (
                f"<div id='{self.id}' class='element observable'>"
                f"<p>Observable</p>"
                f"</div>"
            )

            return html_value

        if self.type == ElementType.CUSTOM_ELEMENT:
            html_value = (
                f"<div id='{self.id}' class='element custom-element'>"
                f"<p>Custom Element</p>"
                f"</div>"
            )

            return html_value

        if self.type == ElementType.IMAGE:
            value = self.get_element_value()
            html_value = (
                f"<div id='{self.id}' class='element image'>"
                f"<figure>"
                f"<img src='{value['image']}' alt='{value['file_name']}'>"
                f"</figure>"
                f"</div>"
            )

            return html_value

        if self.type == ElementType.PLAIN_TEXT:
            html_value = f"<div id='{self.id}' class='element text'><p>{self.plain_text}</p></div>"

            return html_value

        if self.type == ElementType.MARKDOWN:
            html_value = f"<div id='{self.id}' class='element markdown'>{markdown2.markdown(self.markdown)}</div>"

            return html_value

        if self.type == ElementType.CODE:
            html_value = f"<div id='{self.id}' class='element code'>{self.code}</div>"

            return html_value


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
