import logging

from django.db import transaction
from rest_framework import decorators, mixins, permissions, response, status, viewsets, generics, parsers

from schemacms.users import permissions as user_permissions
from schemacms.utils import serializers as utils_serializers
from . import constants, models, serializers, services


class ProjectViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, user_permissions.IsAdminOrReadOnly)
    queryset = models.Project.objects.none()
    serializer_class_mapping = {
        "datasources": serializers.DataSourceSerializer,
    }

    def get_queryset(self):
        return (
            models.Project.get_projects_for_user(self.request.user)
            .annotate_data_source_count()
            .select_related("owner")
            .prefetch_related("editors")
            .order_by("-created")
        )

    @decorators.action(detail=True, methods=["get"])
    def datasources(self, request, **kwargs):
        project = self.get_object()
        queryset = project.data_sources.all(
        ).prefetch_related("jobs").available_for_user(user=self.request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)

    @decorators.action(detail=True, url_path="remove-editor", methods=["post"])
    def remove_editor(self, request, pk=None, **kwargs):
        project = self.get_object()
        editor_to_remove = request.data.get("id", None)

        if editor_to_remove:
            project.editors.remove(editor_to_remove)

            return response.Response(
                f"Editor {editor_to_remove} has been removed from project {project.id}",
                status=status.HTTP_200_OK
            )
        else:
            return response.Response(
                "Please enter the user 'id' you want to remove from project.",
                status.HTTP_400_BAD_REQUEST
            )

    @decorators.action(detail=True, url_path="add-editor", methods=["post"])
    def add_editor(self, request, pk=None, **kwargs):
        project = self.get_object()
        editor_to_add = request.data.get("id", None)

        if editor_to_add:
            project.editors.add(editor_to_add)

            return response.Response(
                f"Editor {editor_to_add} has been added to project {project.id}",
                status=status.HTTP_200_OK
            )
        else:
            return response.Response(
                "Please enter the user 'id' you want to add.",
                status.HTTP_400_BAD_REQUEST
            )


class DataSourceViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.DataSourceSerializer
    queryset = models.DataSource.objects.order_by("-created")
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class_mapping = {
        "create": serializers.DraftDataSourceSerializer,
        "script": serializers.DataSourceScriptSerializer,
        "script_upload": serializers.WranglingScriptSerializer,
        "job": serializers.DataSourceJobSerializer,
        "jobs_history": serializers.DataSourceJobSerializer,
    }

    def get_queryset(self):
        return super().get_queryset().available_for_user(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @decorators.action(detail=True, methods=["get"])
    def preview(self, request, pk=None, **kwargs):
        data_source = self.get_object()

        if not hasattr(data_source, 'meta_data'):
            return response.Response({}, status=status.HTTP_200_OK)

        data = data_source.meta_data.data
        data["data_source"] = {"name": data_source.name}

        return response.Response(data, status=status.HTTP_200_OK)

    @decorators.action(detail=True, methods=["post"])
    def process(self, request, pk=None, **kwargs):
        obj = self.get_object()
        try:
            obj.ready_for_processing()
            obj.process()
            obj.done()
            obj.save()
            logging.info(f"DataSource {obj.id} processing DONE")
            return response.Response(obj.meta_data.data, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"DataSource {self.get_object().id} processing error - {e}")
            obj.status = constants.DataSourceStatus.ERROR
            obj.save()
            return response.Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    @decorators.action(detail=True)
    def script(self, request, pk=None, **kwargs):
        serializer = self.get_serializer(instance=self.get_object().available_scripts, many=True)
        return response.Response(data=serializer.data)

    @decorators.action(
        detail=True,
        url_path="script-upload",
        parser_classes=(parsers.FormParser, parsers.MultiPartParser),
        methods=["post"]
    )
    def script_upload(self, request, pk=None, **kwargs):
        datasource = self.get_object()
        if not request.data.get("datasource"):
            request.data["datasource"] = datasource
        serializer = self.get_serializer(data=request.data, context=datasource)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, url_path="job", methods=["post"])
    def job(self, request, pk=None, **kwargs):
        datasource = self.get_object()
        if not request.data.get("datasource"):
            request.data["datasource"] = datasource
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            job = serializer.save()
            transaction.on_commit(lambda: services.schedule_worker_with(job))
        return response.Response(status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, url_path="jobs-history", methods=["get"])
    def jobs_history(self, request, pk=None, **kwargs):
        data_source = self.get_object()
        queryset = data_source.jobs.all()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(instance=data_source.jobs_history, many=True)
        return response.Response(data=serializer.data)


class DataSourceJobDetailViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = models.DataSourceJob.objects.none()
    serializer_class = serializers.DataSourceJobSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return (
            models.DataSourceJob.objects.all()
            .select_related("datasource")
            .prefetch_related("steps")
        )

    @decorators.action(detail=True, url_path="result-preview", methods=["get"])
    def result_preview(self, request, pk=None, **kwarg):
        obj = self.get_object()
        if obj.job_state in [constants.DataSourceJobState.PENDING, constants.DataSourceJobState.IN_PROGRESS]:
            return response.Response("Job is still running", status=status.HTTP_200_OK)
        elif obj.job_state == constants.DataSourceJobState.FAILED:
            data = {"error": obj.error}
            return response.Response(data, status=status.HTTP_200_OK)
        else:
            try:
                if not hasattr(obj, 'meta_data') and obj.result:
                    obj.update_meta()
                result = obj.meta_data.data
            except Exception as e:
                logging.error(f"Not able to showJob {obj.id} results - {e}")
                return response.Response(status=status.HTTP_404_NOT_FOUND)

            return response.Response(result, status=status.HTTP_200_OK)


class DataSourceScriptDetailView(generics.RetrieveAPIView):
    queryset = models.WranglingScript.objects.none()
    serializer_class = serializers.WranglingScriptSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return (
            models.WranglingScript.objects.all()
            .select_related("datasource", "created_by")
        )
