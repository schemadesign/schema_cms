import json
import operator

from django.urls import reverse
from rest_framework import status

import pytest

from schemacms.users import constants as user_constants
from schemacms.projects import (
    constants as projects_constants,
    serializers as projects_serializers,
    models as projects_models,
)
from schemacms.utils import error


pytestmark = [pytest.mark.django_db]


def multisort(xs, specs):
    for key, reverse_ in reversed(specs):
        xs.sort(key=operator.attrgetter(key), reverse=reverse_)
    return xs


class TestListCreateProjectView:
    """
    Tests /api/v1/projects/ create operation
    """

    example_project = {"title": "test-title", "description": "test description", "editors": []}

    def test_list_projects_for_authenticate_users(self, api_client, user):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url())

        queryset = projects_models.Project.objects.all().order_by("-created")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == projects_serializers.ProjectSerializer(queryset, many=True).data

    def test_404_on_list_projects_for_non_authenticate_user(self, api_client):

        response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_editor_can_list_only_assign_projects(self, api_client, user_factory, project_factory):
        user1, user2 = user_factory.create_batch(2, editor=True)
        user1_projects = project_factory.create_batch(2, editors=[user1])

        api_client.force_authenticate(user1)
        user1_response = api_client.get(self.get_url())
        assert user1_response.status_code == status.HTTP_200_OK
        assert user1_response.data["count"] == 2
        assert (
            user1_response.data["results"]
            == projects_serializers.ProjectSerializer(self.__sort_projects(user1_projects), many=True).data
        )

    def test_create_as_admin(self, api_client, user):
        user.role = user_constants.UserRole.ADMIN
        api_client.force_authenticate(user)

        self.example_project["editors"].append(user.id)
        response = api_client.post(self.get_url(), data=self.example_project)
        project_id = response.data["id"]
        project = projects_models.Project.objects.all().get(pk=project_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    @pytest.mark.parametrize("role", [user_constants.UserRole.EDITOR, user_constants.UserRole.UNDEFINED])
    def test_create_as_editor(self, api_client, user_factory, role):
        user = user_factory(role=role)
        api_client.force_authenticate(user)
        response = api_client.post(self.get_url(), data=self.example_project)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_without_editors(self, api_client, user):
        user.role = user_constants.UserRole.ADMIN
        api_client.force_authenticate(user)

        self.example_project.pop("editors")

        response = api_client.post(self.get_url(), data=self.example_project)

        project_id = response.data["id"]
        project = projects_models.Project.objects.all().get(pk=project_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    def test_num_queries(
        self,
        api_client,
        django_assert_num_queries,
        faker,
        admin,
        user_factory,
        project_factory,
        data_source_factory,
    ):
        projects = [
            project_factory(editors=[user_factory(editor=True), user_factory(editor=True)]) for _ in range(3)
        ]
        for project in projects:
            data_source_factory.create_batch(2, project=project)
        api_client.force_authenticate(admin)

        # Number of queries:
        # +1 count query for pagination
        # +1 projects query
        # +1 prefetch editors
        # +1 prefetch directories
        # +1 prefetch states
        with django_assert_num_queries(5):
            response = api_client.get(self.get_url())
        assert response.status_code == status.HTTP_200_OK

    def test_url(self):
        assert "/api/v1/projects" == self.get_url()

    @staticmethod
    def get_url():
        return reverse("projects:project-list")

    @staticmethod
    def __sort_projects(iterable):
        return sorted(iterable, key=operator.attrgetter("created"), reverse=True)


class TestRetrieveUpdateDeleteProjectView:
    """
    Tests /api/v1/projects/<pk> detail operations
    """

    def test_retrieve(self, api_client, user, project):
        api_client.force_authenticate(user)

        response = api_client.get(self.get_url(project.pk))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    def test_meta_data_sources(self, api_client, faker, admin, project, data_source_factory):
        expected = faker.pyint(min_value=0, max_value=3)
        data_source_factory.create_batch(expected, project=project)
        api_client.force_authenticate(admin)

        response = api_client.get(self.get_url(project.pk))

        assert response.status_code == status.HTTP_200_OK
        assert "meta" in response.data
        assert response.data["meta"]["data_sources"] == expected

    def test_update_project_by_owner(self, api_client, user, project):
        api_client.force_authenticate(user)

        new_title = {"title": "new title"}

        response = api_client.patch(self.get_url(pk=project.pk), data=new_title)

        project.refresh_from_db()
        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    def test_update_project_name_already_occupied(self, api_client, user, project_factory):
        project = project_factory()
        other_project = project_factory()
        api_client.force_authenticate(user)

        new_title = {"title": other_project.title}

        response = api_client.patch(self.get_url(pk=project.pk), data=new_title)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {
            "title": [error.Error(message="This field must be unique.", code="projectTitleUnique").data]
        }

    def test_update_project_by_not_projects_editor(self, api_client, user_factory, project):
        editor1, editor2 = user_factory.create_batch(2, editor=True)
        project.editors.add(editor2)
        payload = {"title": "new title"}

        api_client.force_authenticate(editor1)
        response = api_client.patch(self.get_url(pk=project.pk), data=payload)

        project.refresh_from_db()
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_project_by_owner(self, api_client, user, project):
        api_client.force_authenticate(user)

        response = api_client.delete(self.get_url(pk=project.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not projects_models.Project.objects.all().filter(pk=project.pk).exists()
        assert projects_models.Project.objects.all_with_deleted().filter(pk=project.pk).exists()

    def test_url(self, project):
        assert f"/api/v1/projects/{project.pk}" == self.get_url(pk=project.pk)

    @staticmethod
    def get_url(pk):
        return reverse("projects:project-detail", kwargs=dict(pk=pk))


class TestDirectoryListView:
    def test_response(self, api_client, admin, project, folder_factory):
        folders = folder_factory.create_batch(2, project=project, created_by=admin)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.data["results"]
            == projects_serializers.FolderSerializer(instance=self.sort_directories(folders), many=True).data
        )

    def test_response_from_projects(self, api_client, admin, project_factory, folder_factory):
        project_1, project_2 = project_factory.create_batch(2, owner=admin)
        folders = folder_factory.create_batch(3, project=project_1, created_by=admin)
        folder_factory.create_batch(2, project=project_2, created_by=admin)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_project_url(project_1.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3
        assert (
            response.data["results"]
            == projects_serializers.FolderSerializer(instance=self.sort_directories(folders), many=True).data
        )

    @staticmethod
    def get_url():
        return reverse("projects:folder-list")

    @staticmethod
    def get_project_url(pk):
        return reverse("projects:project-folders", kwargs=dict(pk=pk))

    @staticmethod
    def sort_directories(iterable):
        return sorted(iterable, key=operator.attrgetter("name"))


class TestFolderCreateView:
    def test_response(self, api_client, admin, project, faker):
        payload = dict(name=faker.word(), project=project.id)

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(), data=payload)
        folder = projects_models.Folder.objects.get(pk=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert projects_models.Folder.objects.filter(pk=response.data["id"]).exists()
        assert response.data == projects_serializers.FolderSerializer(folder).data

    def test_add_folder_to_project(self, api_client, admin, project, faker):
        payload = {"name": "About"}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_project_url(project.id), data=payload, format="json")
        project_folders = project.folders.all()

        assert response.status_code == status.HTTP_201_CREATED
        assert project_folders.count() == 1
        assert response.data == projects_serializers.FolderSerializer(project_folders[0]).data

    @staticmethod
    def get_url():
        return reverse("projects:folder-list")

    @staticmethod
    def get_project_url(pk):
        return reverse("projects:project-folders", kwargs=dict(pk=pk))


class TestFolderDetailView:
    def test_response(self, api_client, admin, folder):

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(folder.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.FolderDetailSerializer(folder).data

    def test_edit_name(self, api_client, admin, folder, faker):
        new_name = faker.word()
        payload = {"name": new_name}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(folder.id), data=payload)
        folder.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert folder.name == new_name

    def test_update_folder(self, api_client, admin, project, project_factory, folder, faker):
        new_project = project_factory(owner=admin)
        new_name = faker.word()
        payload = dict(name=new_name, project=new_project.id)

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(folder.id), data=payload, format="json")
        folder.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == new_name
        assert folder.project_id == project.id

    def test_delete_folder(self, api_client, user, folder):
        api_client.force_authenticate(user)

        response = api_client.delete(self.get_url(pk=folder.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not projects_models.Folder.objects.all().filter(pk=folder.pk).exists()
        assert projects_models.Folder.objects.all_with_deleted().filter(pk=folder.pk).exists()

    @staticmethod
    def get_url(pk):
        return reverse("projects:folder-detail", kwargs=dict(pk=pk))


class TestPageListCreateView:
    def test_response(self, api_client, admin, folder, page_factory):
        pages = page_factory.create_batch(2, folder=folder, created_by=admin)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(folder.id))

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.data["results"]
            == projects_serializers.PageSerializer(instance=self.sort_directories(pages), many=True).data
        )
        assert response.data["project"] == folder.project_info

    def test_create(self, api_client, admin, folder, faker):
        payload = dict(title=faker.word())

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(folder.id), data=payload, format="json")
        folder_pages = folder.pages.all()

        assert response.status_code == status.HTTP_201_CREATED
        assert folder_pages.count() == 1
        assert response.data == projects_serializers.PageSerializer(folder_pages[0]).data

    @staticmethod
    def get_url(pk):
        return reverse("projects:folder-pages", kwargs=dict(pk=pk))

    @staticmethod
    def sort_directories(iterable):
        return sorted(iterable, key=operator.attrgetter("created"))


class TestPageDetailView:
    def test_response(self, api_client, admin, page):

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(page.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.PageDetailSerializer(page).data

    def test_update_page(self, api_client, admin, folder, folder_factory, page, faker):
        new_folder = folder_factory()
        new_title = faker.word()
        payload = dict(title=new_title, folder=new_folder.id)

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(page.id), data=payload, format="json")
        page.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == new_title
        assert page.folder_id == folder.id

    def test_delete_page(self, api_client, user, page):
        api_client.force_authenticate(user)

        response = api_client.delete(self.get_url(pk=page.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not projects_models.Page.objects.all().filter(pk=page.pk).exists()
        assert projects_models.Page.objects.all_with_deleted().filter(pk=page.pk).exists()

    @staticmethod
    def get_url(pk):
        return reverse("projects:page-detail", kwargs=dict(pk=pk))


class TestBlockListCreateView:
    def test_response(self, api_client, admin, page, block_factory):
        test_block_1 = block_factory(page=page, exec_order=0)
        test_block_2 = block_factory(page=page, exec_order=1)

        blocks = [test_block_1, test_block_2]

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(page.id))

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.data["results"]
            == projects_serializers.BlockSerializer(instance=self.sort_blocks(blocks), many=True).data
        )
        assert response.data["project"] == page.project_info

    def test_create(self, api_client, admin, page, faker):
        payload = dict(name=faker.word(), type=projects_constants.BlockTypes.CODE, content="<p>test</p>")

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(page.id), data=payload, format="multipart")
        page_blocks = page.blocks.all()

        assert response.status_code == status.HTTP_201_CREATED
        assert page_blocks.count() == 1
        assert response.data == projects_serializers.BlockSerializer(page_blocks[0]).data

    def test_image_upload(self, api_client, admin, page, faker):
        payload = dict(
            name=faker.word(),
            type=projects_constants.BlockTypes.IMAGE,
            image_0=faker.image_upload_file(filename="image_0.png"),
            image_1=faker.image_upload_file(filename="image_1.png"),
            images_order=json.dumps({"image_0": 1, "image_1": 2}),
        )

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(page.id), data=payload, format="multipart")
        block = page.blocks.get(pk=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert block.images.filter(image_name="image_0.png").exists()
        assert block.images.get(image_name="image_1.png").exec_order == 2

    def test_400_on_image_upload_with_wrong_type(self, api_client, admin, page, faker):
        payload = dict(
            name=faker.word(), type=projects_constants.BlockTypes.TEXT, image=faker.image_upload_file()
        )

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(page.id), data=payload, format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_400_on_sending_type_image_without_file(self, api_client, admin, page, faker):
        payload = dict(name=faker.word(), type=projects_constants.BlockTypes.IMAGE)

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(page.id), data=payload, format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @staticmethod
    def get_url(pk):
        return reverse("projects:page-blocks", kwargs=dict(pk=pk))

    @staticmethod
    def sort_directories(iterable):
        return sorted(iterable, key=operator.attrgetter("created"))

    @staticmethod
    def sort_blocks(blocks):
        return sorted(blocks, key=operator.attrgetter("exec_order"))


class TestBlockDetailView:
    def test_response(self, api_client, admin, block):

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(block.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.BlockDetailSerializer(block).data

    def test_update_block(self, api_client, admin, page, page_factory, block, faker):
        new_page = page_factory()
        new_name = faker.word()
        payload = dict(name=new_name, page=new_page.id)

        api_client.force_authenticate(admin)

        response = api_client.patch(self.get_url(block.id), data=payload, format="multipart")
        block.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == new_name
        assert block.page_id == page.id

    def test_update_name_for_image_block(self, api_client, admin, block_factory, faker):
        """Test if its possible to change block name without uploading image again"""
        block = block_factory(type=projects_constants.BlockTypes.IMAGE)
        new_name = faker.word()
        payload = dict(name=new_name)

        api_client.force_authenticate(admin)

        response = api_client.patch(self.get_url(block.id), data=payload, format="multipart")
        block.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == new_name

    def test_update_block_images_order(self, api_client, admin, block_factory, block_image_factory, faker):
        block = block_factory(type=projects_constants.BlockTypes.IMAGE)
        block_image_factory.create_batch(3, block=block)
        block_images = block.images.all().values_list("id", flat=True)
        new_order = {str(id_): 3 for id_ in block_images}
        new_name = faker.word()
        payload = dict(
            name=new_name,
            image_0=faker.image_upload_file(filename="new_pic.png"),
            images_order=json.dumps({"image_0": 6, **new_order}),
        )

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(block.id), data=payload, format="multipart")
        block.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert block.images.filter(image_name="new_pic.png").exists()
        assert block.images.get(image_name="new_pic.png").exec_order == 6

    def test_delete_block(self, api_client, user, block):
        api_client.force_authenticate(user)

        response = api_client.delete(self.get_url(pk=block.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not projects_models.Block.objects.all().filter(pk=block.pk).exists()
        assert projects_models.Block.objects.all_with_deleted().filter(pk=block.pk).exists()

    @staticmethod
    def get_url(pk):
        return reverse("projects:block-detail", kwargs=dict(pk=pk))


class TestSetBlocksView:
    def test_response(self, api_client, admin, folder, page_factory, block_factory):
        page = page_factory(folder=folder)
        block1 = block_factory(page=page, is_active=False)
        block2 = block_factory(page=page, is_active=True)
        block1_old_status = block1.is_active
        block2_old_status = block2.is_active
        payload = [
            {"id": block1.id, "is_active": True, "exec_order": 0},
            {"id": block2.id, "is_active": False, "exec_order": 1},
        ]

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(page.id), data=payload, format="json")
        block1.refresh_from_db()
        block2.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert block1_old_status != block1.is_active
        assert block1.exec_order == 0
        assert block2.exec_order == 1
        assert block2_old_status != block2.is_active

    @staticmethod
    def get_url(pk):
        return reverse("projects:page-set-blocks", kwargs=dict(pk=pk))
