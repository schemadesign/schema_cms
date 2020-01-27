import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';
import nock from 'nock';

import { watchDataSourceTag } from '../dataSourceTag.sagas';
import { DataSourceTagRoutines } from '../dataSourceTag.redux';
import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCES_PATH, TAGS_PATH } from '../../../shared/utils/api.constants';
import browserHistory from '../../../shared/utils/history';

describe('Tag: sagas', () => {
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

      mockApi.get(`/datasources/${payload.dataSourceId}/tags`).reply(OK, response);

      await expectSaga(watchDataSourceTag)
        .withState(defaultState)
        .put(DataSourceTagRoutines.fetchList.success(response.results))
        .dispatch(DataSourceTagRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('when setTags action is called', () => {
    it('should put setTags.success action', async () => {
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

      mockApi.post(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/set-tags`, { active, inactive }).reply(OK, response);

      await expectSaga(watchDataSourceTag)
        .withState(defaultState)
        .put(DataSourceTagRoutines.setTags.success(response))
        .dispatch(DataSourceTagRoutines.setTags(payload))
        .silentRun();
    });
  });

  describe('when createTag action is called', () => {
    it('should put createTag.success action', async () => {
      const response = {
        id: 1,
      };
      const formData = { data: 'data' };
      const dataSourceId = 1;
      const payload = { formData, dataSourceId };
      jest.spyOn(browserHistory, 'push');

      mockApi
        // eslint-disable-next-line camelcase
        .post(`${DATA_SOURCES_PATH}/${dataSourceId}/tags`, { ...formData, is_active: true })
        .reply(OK, response);

      await expectSaga(watchDataSourceTag)
        .withState(defaultState)
        .put(DataSourceTagRoutines.createTag.success(response))
        .dispatch(DataSourceTagRoutines.createTag(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/datasource/1/tag');
    });
  });

  describe('when fetchTag action is called', () => {
    it('should put fetchTag.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        tagId: 1,
      };

      mockApi.get(`${TAGS_PATH}/${payload.tagId}`).reply(OK, response);

      await expectSaga(watchDataSourceTag)
        .withState(defaultState)
        .put(DataSourceTagRoutines.fetchTag.success(response))
        .dispatch(DataSourceTagRoutines.fetchTag(payload))
        .silentRun();
    });
  });

  describe('when updateTag action is called', () => {
    it('should put updateTag.success action', async () => {
      const response = {
        id: 1,
      };
      const formData = { data: 'data' };
      const dataSourceId = 1;
      const tagId = 1;
      const payload = { formData, dataSourceId, tagId };
      jest.spyOn(browserHistory, 'push');

      mockApi.put(`${TAGS_PATH}/${tagId}`, formData).reply(OK, response);

      await expectSaga(watchDataSourceTag)
        .withState(defaultState)
        .put(DataSourceTagRoutines.updateTag.success(response))
        .dispatch(DataSourceTagRoutines.updateTag(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/datasource/1/tag');
    });
  });

  describe('when removeTag action is called', () => {
    it('should put removeTag.success action', async () => {
      const response = {
        id: 1,
      };
      const dataSourceId = 1;
      const tagId = 1;
      const payload = { dataSourceId, tagId };
      jest.spyOn(browserHistory, 'push');

      mockApi.delete(`${TAGS_PATH}/${tagId}`).reply(OK, response);

      await expectSaga(watchDataSourceTag)
        .withState(defaultState)
        .put(DataSourceTagRoutines.removeTag.success(response))
        .dispatch(DataSourceTagRoutines.removeTag(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/datasource/1/tag');
    });
  });
});
