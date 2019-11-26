import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import nock from 'nock';
import { OK } from 'http-status-codes';

import { watchPage } from '../page.sagas';
import { PageRoutines } from '../page.redux';
import mockApi from '../../../shared/utils/mockApi';
import browserHistory from '../../../shared/utils/history';

describe('Page: sagas', () => {
  const defaultState = Immutable({
    pages: [],
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('when fetchList action is called', () => {
    it('should put fetchList.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        directoryId: 1,
      };

      mockApi.get(`/directories/${payload.directoryId}/pages`).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.fetchList.success(response))
        .dispatch(PageRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('when fetchOne action is called', () => {
    it('should put fetchOne.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        pageId: 1,
      };

      mockApi.get(`/pages/${payload.pageId}`).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.fetchOne.success(response))
        .dispatch(PageRoutines.fetchOne(payload))
        .silentRun();
    });
  });

  describe('when create action is called', () => {
    it('should put create.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        directoryId: 1,
        title: 'a title',
      };

      mockApi.post(`/directories/${payload.directoryId}/pages`, { title: payload.title }).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.create.success(response))
        .dispatch(PageRoutines.create(payload))
        .silentRun();
    });
  });

  describe('when update action is called', () => {
    it('should put update.success action', async () => {
      jest.spyOn(browserHistory, 'push');
      const response = {
        id: 1,
      };
      const payload = {
        directoryId: 1,
        pageId: 2,
        title: 'a title',
      };

      mockApi.patch(`/pages/${payload.pageId}`, { title: payload.title }).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.update.success(response))
        .dispatch(PageRoutines.update(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/directory/${payload.directoryId}`);
    });
  });
});
