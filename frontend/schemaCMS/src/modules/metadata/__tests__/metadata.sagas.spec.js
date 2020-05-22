import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { watchMetadata } from '../metadata.sagas';
import { MetadataRoutines } from '../metadata.redux';
import mockApi from '../../../shared/utils/mockApi';
import { METADATA_PATH, DATA_SOURCES_PATH } from '../../../shared/utils/api.constants';

describe('Metadata: sagas', () => {
  const defaultState = Immutable({});

  describe('fetchMetadata', () => {
    it('should dispatch a success action', async () => {
      const payload = { dataSourceId: '1' };
      const responseData = {
        project: {},
        results: {},
      };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}${METADATA_PATH}`).reply(OK, responseData);

      await expectSaga(watchMetadata)
        .withState(defaultState)
        .put(MetadataRoutines.fetchMetadata.success(responseData.results))
        .dispatch(MetadataRoutines.fetchMetadata(payload))
        .silentRun();
    });
  });

  describe('updateMetadata', () => {
    it('should dispatch a success action', async () => {
      const formData = { data: 'data' };
      const payload = { dataSourceId: '1', formData };
      const responseData = {
        project: {},
        results: {},
      };

      mockApi.patch(`${DATA_SOURCES_PATH}/${payload.dataSourceId}${METADATA_PATH}`, formData).reply(OK, responseData);

      await expectSaga(watchMetadata)
        .withState(defaultState)
        .put(MetadataRoutines.updateMetadata.success(responseData.results))
        .dispatch(MetadataRoutines.updateMetadata(payload))
        .silentRun();
    });
  });
});
