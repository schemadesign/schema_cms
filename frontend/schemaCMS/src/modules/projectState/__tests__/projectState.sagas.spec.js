import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { ProjectStateRoutines } from '../projectState.redux';
import { watchProjectState } from '../projectState.sagas';

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
      results: {},
    };
    const payload = {
      stateId: 1,
      formData: { data: 'data' },
    };

    mockApi.post(`/states/${payload.stateId}`, payload.formData).reply(OK, response);

    await expectSaga(watchProjectState)
      .withState(defaultState)
      .put(ProjectStateRoutines.create.success(response.results))
      .dispatch(ProjectStateRoutines.create(payload))
      .silentRun();
  });

  it('should put update.success action', async () => {
    const response = {
      results: {},
    };
    const payload = {
      stateId: 1,
      formData: { data: 'data' },
    };

    mockApi.patch(`/states/${payload.stateId}`, payload.formData).reply(OK, response);

    await expectSaga(watchProjectState)
      .withState(defaultState)
      .put(ProjectStateRoutines.update.success(response.results))
      .dispatch(ProjectStateRoutines.update(payload))
      .silentRun();
  });
});
