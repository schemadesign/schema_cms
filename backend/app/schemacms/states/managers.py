from django.db import models


class StateTagManager(models.Manager):
    def get_by_natural_key(self, project_title, datasource_name, state_name, cat_name, value):
        return self.get(
            state__datasource__project__title=project_title,
            state__datasource__name=datasource_name,
            state__name=state_name,
            category__name=cat_name,
            value=value,
        )


class FilterManager(models.Manager):
    def get_by_natural_key(self, project_title, datasource_name, state_name, filter_name):
        return self.get(
            state__datasource__project__title=project_title,
            state__datasource__name=datasource_name,
            state__name=state_name,
            filter__name=filter_name,
        )


class StateManager(models.Manager):
    def get_by_natural_key(self, project_title, datasource_name, name):
        return self.get(
            datasource__project__title=project_title, datasource__name=datasource_name, name=name,
        )
