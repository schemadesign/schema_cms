import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { watchProject } from '../project.sagas';
import { ProjectActions } from '../project.redux';

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

    mockApi.get(PROJECTS_PATH).reply(OK, {
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
        .put(ProjectActions.fetchListSuccess([item]))
        .dispatch(ProjectActions.fetchList())
        .run();
    });
  });

  describe('when /PROJECTS/1 action is fired', () => {
    it('should put fetchProjectSuccess action', async () => {
      await expectSaga(watchProject)
        .withState(defaultState)
        .put(
          ProjectActions.fetchProjectSuccess({
            ...item,
            ...extenedProjectData,
          })
        )
        .dispatch(ProjectActions.fetchProject('1'))
        .run();
    });
  });
});
