import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { watchProject } from '../project.sagas';
import { ProjectActions } from '../project.redux';

describe('Project: sagas', () => {
  const defaultState = Immutable({});

  let item;

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

    mockApi.get(PROJECTS_PATH).reply(OK, {
      results: [item],
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
});
