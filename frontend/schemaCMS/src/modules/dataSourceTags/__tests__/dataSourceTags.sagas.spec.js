import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { watchDataSourceTags } from '../dataSourceTags.sagas';
import { DataSourceTagsRoutines } from '../dataSourceTags.redux';
import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCES_PATH, TAGS_PATH } from '../../../shared/utils/api.constants';

describe('DataSourceTags: sagas', () => {
  const defaultState = Immutable({});

  describe('fetchDataSourceTags', () => {
    it('should dispatch a success action', async () => {
      const payload = { dataSourceId: '1' };
      const responseData = {
        project: {},
        results: {},
      };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}${TAGS_PATH}`).reply(OK, responseData);

      await expectSaga(watchDataSourceTags)
        .withState(defaultState)
        .put(DataSourceTagsRoutines.fetchDataSourceTags.success(responseData.results))
        .dispatch(DataSourceTagsRoutines.fetchDataSourceTags(payload))
        .silentRun();
    });
  });

  describe('updateDataSourceTags', () => {
    it('should dispatch a success action', async () => {
      const formData = { data: 'data' };
      const payload = { dataSourceId: '1', formData };
      const responseData = {
        project: {},
        results: {},
      };

      mockApi.patch(`${DATA_SOURCES_PATH}/${payload.dataSourceId}${TAGS_PATH}`, formData).reply(OK, responseData);

      await expectSaga(watchDataSourceTags)
        .withState(defaultState)
        .put(DataSourceTagsRoutines.updateDataSourceTags.success(responseData.results))
        .dispatch(DataSourceTagsRoutines.updateDataSourceTags(payload))
        .silentRun();
    });
  });
});
