import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { DataSourceStateRoutines } from '../dataSourceState.redux';
import { watchDataSourceState } from '../dataSourceState.sagas';
import browserHistory from '../../../shared/utils/history';
import { ProjectRoutines } from '../../project';

describe('DataSourceState: sagas', () => {
  const defaultState = Immutable({});

  it('should put fetchList.success action', async () => {
    const response = {
      results: [],
    };
    const payload = {
      dataSourceId: 1,
    };

    mockApi.get(`/datasources/${payload.dataSourceId}/states`).reply(OK, response);

    await expectSaga(watchDataSourceState)
      .withState(defaultState)
      .put(DataSourceStateRoutines.fetchList.success(response.results))
      .dispatch(DataSourceStateRoutines.fetchList(payload))
      .silentRun();
  });

  it('should put fetchOne.success action', async () => {
    const response = {
      results: {},
      project: {},
    };
    const payload = {
      stateId: 1,
    };

    mockApi.get(`/states/${payload.stateId}`).reply(OK, response);

    await expectSaga(watchDataSourceState)
      .withState(defaultState)
      .put(ProjectRoutines.setProject.trigger(response.project))
      .put(DataSourceStateRoutines.fetchOne.success(response.results))
      .dispatch(DataSourceStateRoutines.fetchOne(payload))
      .silentRun();
  });

  it('should put create.success action', async () => {
    const response = {
      data: 'data',
      id: 1,
    };
    const payload = {
      dataSourceId: 1,
      formData: { data: 'data' },
    };
    jest.spyOn(browserHistory, 'push');

    mockApi.post(`/datasources/${payload.dataSourceId}/states`, payload.formData).reply(OK, response);

    await expectSaga(watchDataSourceState)
      .withState(defaultState)
      .put(DataSourceStateRoutines.create.success(response))
      .dispatch(DataSourceStateRoutines.create(payload))
      .silentRun();

    expect(browserHistory.push).toBeCalledWith('/state/1');
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

    await expectSaga(watchDataSourceState)
      .withState(defaultState)
      .put(DataSourceStateRoutines.update.success(response))
      .dispatch(DataSourceStateRoutines.update(payload))
      .silentRun();
  });

  it('should put remove.success action', async () => {
    const payload = {
      stateId: 'stateId',
      dataSourceId: 'dataSourceId',
    };
    jest.spyOn(browserHistory, 'push');

    mockApi.delete(`/states/${payload.stateId}`).reply(OK);

    await expectSaga(watchDataSourceState)
      .withState(defaultState)
      .put(DataSourceStateRoutines.remove.success())
      .dispatch(DataSourceStateRoutines.remove(payload))
      .silentRun();

    expect(browserHistory.push).toBeCalledWith('/datasource/dataSourceId/state');
  });
});
