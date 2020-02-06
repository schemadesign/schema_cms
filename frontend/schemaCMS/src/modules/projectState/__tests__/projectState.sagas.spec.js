import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { ProjectStateRoutines } from '../projectState.redux';
import { watchProjectState } from '../projectState.sagas';
import browserHistory from '../../../shared/utils/history';

describe('ProjectState: sagas', () => {
  const defaultState = Immutable({});

  it('should put fetchList.success action', async () => {
    const response = {
      results: [],
    };
    const payload = {
      projectId: 1,
    };

    mockApi.get(`/projects/${payload.projectId}/states`).reply(OK, response);

    await expectSaga(watchProjectState)
      .withState(defaultState)
      .put(ProjectStateRoutines.fetchList.success(response.results))
      .dispatch(ProjectStateRoutines.fetchList(payload))
      .silentRun();
  });

  it('should put fetchOne.success action', async () => {
    const response = {
      results: {},
    };
    const payload = {
      stateId: 1,
    };

    mockApi.get(`/states/${payload.stateId}`).reply(OK, response);

    await expectSaga(watchProjectState)
      .withState(defaultState)
      .put(ProjectStateRoutines.fetchOne.success(response.results))
      .dispatch(ProjectStateRoutines.fetchOne(payload))
      .silentRun();
  });

  it('should put create.success action', async () => {
    const response = {
      data: 'data',
      id: 1,
    };
    const payload = {
      projectId: 1,
      formData: { data: 'data' },
    };
    jest.spyOn(browserHistory, 'push');

    mockApi.post(`/projects/${payload.projectId}/states`, payload.formData).reply(OK, response);

    await expectSaga(watchProjectState)
      .withState(defaultState)
      .put(ProjectStateRoutines.create.success(response))
      .dispatch(ProjectStateRoutines.create(payload))
      .silentRun();

    expect(browserHistory.push).toBeCalledWith('/state/1/tags');
  });

  it('should put update.success action', async () => {
    const response = {
      data: 'data',
      id: 1,
    };
    const payload = {
      stateId: 1,
      formData: { data: 'data' },
    };
    jest.spyOn(browserHistory, 'push');

    mockApi.patch(`/states/${payload.stateId}`, payload.formData).reply(OK, response);

    await expectSaga(watchProjectState)
      .withState(defaultState)
      .put(ProjectStateRoutines.update.success(response))
      .dispatch(ProjectStateRoutines.update(payload))
      .silentRun();

    expect(browserHistory.push).toBeCalledWith('/state/1/tags');
  });

  it('should put remove.success action', async () => {
    const payload = {
      stateId: 'stateId',
      projectId: 'projectId',
    };
    jest.spyOn(browserHistory, 'push');

    mockApi.delete(`/states/${payload.stateId}`).reply(OK);

    await expectSaga(watchProjectState)
      .withState(defaultState)
      .put(ProjectStateRoutines.remove.success())
      .dispatch(ProjectStateRoutines.remove(payload))
      .silentRun();

    expect(browserHistory.push).toBeCalledWith('/project/projectId/state');
  });
});
