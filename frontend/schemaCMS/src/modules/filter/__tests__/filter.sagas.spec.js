import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';
import nock from 'nock';

import { watchFilter } from '../filter.sagas';
import { FilterRoutines } from '../filter.redux';
import mockApi from '../../../shared/utils/mockApi';

describe('Filter: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('when fetchList action is called', () => {
    it('should put fetchList.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        dataSourceId: 1,
      };

      mockApi.get(`/datasources/${payload.dataSourceId}/filters`).reply(OK, response);

      await expectSaga(watchFilter)
        .withState(defaultState)
        .put(FilterRoutines.fetchList.success(response))
        .dispatch(FilterRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('when setFilters action is called', () => {
    it('should put setFilters.success action', async () => {
      const response = {
        id: 1,
      };
      const active = [1];
      const inactive = [2, 3, 4];
      const payload = {
        dataSourceId: 1,
        active,
        inactive,
      };

      mockApi.post(`/datasources/${payload.dataSourceId}/set-filters`, { active, inactive }).reply(OK, response);

      await expectSaga(watchFilter)
        .withState(defaultState)
        .put(FilterRoutines.setFilters.success(response))
        .dispatch(FilterRoutines.setFilters(payload))
        .silentRun();
    });
  });
});
