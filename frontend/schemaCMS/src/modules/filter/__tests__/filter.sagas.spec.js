import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';
import nock from 'nock';

import { watchFilter } from '../filter.sagas';
import { FilterRoutines } from '../filter.redux';
import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCES_PATH, FILTERS_PATH } from '../../../shared/utils/api.constants';
import browserHistory from '../../../shared/utils/history';

describe('Filter: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('when fetchList action is called', () => {
    it('should put fetchList.success action', async () => {
      const response = {
        id: 1,
        results: [],
      };
      const payload = {
        dataSourceId: 1,
      };

      mockApi.get(`/datasources/${payload.dataSourceId}/filters`).reply(OK, response);

      await expectSaga(watchFilter)
        .withState(defaultState)
        .put(FilterRoutines.fetchList.success(response.results))
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

      mockApi
        .post(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/set-filters`, { active, inactive })
        .reply(OK, response);

      await expectSaga(watchFilter)
        .withState(defaultState)
        .put(FilterRoutines.setFilters.success(response))
        .dispatch(FilterRoutines.setFilters(payload))
        .silentRun();
    });
  });

  describe('when createFilter action is called', () => {
    it('should put createFilter.success action', async () => {
      const response = {
        id: 1,
      };
      const formData = { data: 'data' };
      const dataSourceId = 1;
      const payload = { formData, dataSourceId };
      jest.spyOn(browserHistory, 'push');

      mockApi
        // eslint-disable-next-line camelcase
        .post(`${DATA_SOURCES_PATH}/${dataSourceId}/filters`, { ...formData, is_active: true })
        .reply(OK, response);

      await expectSaga(watchFilter)
        .withState(defaultState)
        .put(FilterRoutines.createFilter.success(response))
        .dispatch(FilterRoutines.createFilter(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/datasource/1/filters');
    });
  });

  describe('when fetchFilter action is called', () => {
    it('should put fetchFilter.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        filterId: 1,
      };

      mockApi.get(`${FILTERS_PATH}/${payload.filterId}`).reply(OK, response);

      await expectSaga(watchFilter)
        .withState(defaultState)
        .put(FilterRoutines.fetchFilter.success(response))
        .dispatch(FilterRoutines.fetchFilter(payload))
        .silentRun();
    });
  });

  describe('when updateFilter action is called', () => {
    it('should put updateFilter.success action', async () => {
      const response = {
        id: 1,
      };
      const formData = { data: 'data' };
      const dataSourceId = 1;
      const filterId = 1;
      const payload = { formData, dataSourceId, filterId };
      jest.spyOn(browserHistory, 'push');

      mockApi.put(`${FILTERS_PATH}/${filterId}`, formData).reply(OK, response);

      await expectSaga(watchFilter)
        .withState(defaultState)
        .put(FilterRoutines.updateFilter.success(response))
        .dispatch(FilterRoutines.updateFilter(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/datasource/1/filters');
    });
  });

  describe('when removeFilter action is called', () => {
    it('should put removeFilter.success action', async () => {
      const response = {
        id: 1,
      };
      const dataSourceId = 1;
      const filterId = 1;
      const payload = { dataSourceId, filterId };
      jest.spyOn(browserHistory, 'push');

      mockApi.delete(`${FILTERS_PATH}/${filterId}`).reply(OK, response);

      await expectSaga(watchFilter)
        .withState(defaultState)
        .put(FilterRoutines.removeFilter.success(response))
        .dispatch(FilterRoutines.removeFilter(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/datasource/1/filters');
    });
  });
});
