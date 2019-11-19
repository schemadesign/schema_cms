import { expectSaga } from 'redux-saga-test-plan';
import { select } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import { BAD_REQUEST, OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { watchProject } from '../project.sagas';
import { ProjectRoutines } from '../project.redux';
import { PROJECT_DESCRIPTION, PROJECT_OWNER, PROJECT_TITLE } from '../project.constants';
import { selectUserData } from '../../userProfile';
import browserHistory from '../../../shared/utils/history';

describe('Project: sagas', () => {
  const defaultState = Immutable({
    projects: [],
    project: {},
  });

  let item;
  let extenedProjectData;

  beforeEach(() => {
    item = {
      title: 'Project Name',
      description: 'Description',
      slug: 'schemacms/api/project_title',
      created: '2019-08-26T11:05:12+0000',
      status: 'Status',
      owner: {
        id: '1',
        firstName: 'Firstname',
        lastName: 'Lastname',
      },
    };

    extenedProjectData = {
      editors: ['3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e', '44da51ad7-a8b4-4355-b5d6-b51f01f1cb2e'],
      modified: '2019-08-21T10:12:52.030069Z',
    };

    mockApi.get(`${PROJECTS_PATH}?page_size=1000`).reply(OK, {
      results: [item],
    });

    mockApi.get(`${PROJECTS_PATH}/1`).reply(OK, {
      ...item,
      ...extenedProjectData,
    });
  });

  describe('when /PROJECTS action is fired', () => {
    it('should put fetchListSuccess action', async () => {
      await expectSaga(watchProject)
        .withState(defaultState)
        .put(ProjectRoutines.fetchList.success([item]))
        .dispatch(ProjectRoutines.fetchList())
        .silentRun();
    });
  });

  describe('when /PROJECTS/:id action is fired', () => {
    it('should put fetchOneSuccess action', async () => {
      await expectSaga(watchProject)
        .withState(defaultState)
        .put(
          ProjectRoutines.fetchOne.success({
            ...item,
            ...extenedProjectData,
          })
        )
        .dispatch(ProjectRoutines.fetchOne({ projectId: '1' }))
        .silentRun();
    });
  });

  describe('when ProjectRoutines.createProject.TRIGGER is fired', () => {
    it('should put createProjectSuccess action', async () => {
      const currentUser = {
        id: 1,
        firstName: 'Joe',
        lastName: 'Doe',
      };

      const payload = {
        [PROJECT_TITLE]: 'Project Title',
        [PROJECT_DESCRIPTION]: 'A Project Description',
        [PROJECT_OWNER]: 'Joe Doe',
      };

      mockApi.post(PROJECTS_PATH).reply(OK, item);

      await expectSaga(watchProject)
        .withState(defaultState)
        .provide([[select(selectUserData), currentUser]])
        .put(ProjectRoutines.createProject.success(item))
        .dispatch(ProjectRoutines.createProject({ payload }))
        .silentRun();
    });

    it('should redirect the user to project list', async () => {
      jest.spyOn(browserHistory, 'push');

      const currentUser = {
        id: 1,
        firstName: 'Joe',
        lastName: 'Doe',
      };

      const payload = {
        [PROJECT_TITLE]: 'Project Title',
        [PROJECT_DESCRIPTION]: 'A Project Description',
        [PROJECT_OWNER]: 'Joe Doe',
      };

      mockApi.post(PROJECTS_PATH).reply(OK, item);

      await expectSaga(watchProject)
        .withState(defaultState)
        .provide([[select(selectUserData), currentUser]])
        .put(ProjectRoutines.createProject.success(item))
        .dispatch(ProjectRoutines.createProject({ payload }))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/project/');
    });

    it('should put ProjectRoutines.createProject.failure action', async () => {
      const currentUser = {
        id: 1,
        firstName: 'Joe',
        lastName: 'Doe',
      };

      const payload = {
        [PROJECT_TITLE]: 'Project Title',
        [PROJECT_DESCRIPTION]: 'A Project Description',
        [PROJECT_OWNER]: 'Joe Doe',
      };

      const errorResponseData = { name: [{ code: 'code', message: 'message' }] };
      const errorResult = [{ code: 'code', name: 'name' }];

      mockApi.post(PROJECTS_PATH).reply(BAD_REQUEST, errorResponseData);

      await expectSaga(watchProject)
        .withState(defaultState)
        .provide([[select(selectUserData), currentUser]])
        .put(ProjectRoutines.createProject.failure(errorResult))
        .dispatch(ProjectRoutines.createProject({ payload }))
        .silentRun();
    });

    it('should put ProjectRoutines.removeEditor.success action and fetch project', async () => {
      const payload = {
        projectId: '1',
        userId: '1',
      };
      const response = [{ id: '1' }];

      mockApi.post(`${PROJECTS_PATH}/${payload.projectId}/remove-editor`, { id: payload.userId }).reply(OK, response);

      await expectSaga(watchProject)
        .withState(defaultState)
        .put(ProjectRoutines.removeEditor.success())
        .put(ProjectRoutines.fetchOne.request())
        .dispatch(ProjectRoutines.removeEditor(payload))
        .silentRun();
    });

    it('should put ProjectRoutines.removeEditor.success action and redirect to users list', async () => {
      jest.spyOn(browserHistory, 'push');
      const payload = {
        projectId: '1',
        userId: '1',
        isDetails: true,
      };
      const response = [{ id: '1' }];

      mockApi.post(`${PROJECTS_PATH}/${payload.projectId}/remove-editor`, { id: payload.userId }).reply(OK, response);

      await expectSaga(watchProject)
        .withState(defaultState)
        .put(ProjectRoutines.removeEditor.success())
        .dispatch(ProjectRoutines.removeEditor(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/project/${payload.projectId}/user`);
    });
  });
});
