import Immutable from 'seamless-immutable';
import nock from 'nock';
import { OK } from 'http-status-codes';
import { expectSaga } from 'redux-saga-test-plan';

import { watchPageBlock } from '../pageBlock.sagas';
import { PageBlockRoutines } from '../pageBlock.redux';
import mockApi from '../../../shared/utils/mockApi';

describe('PageBlock: sagas', () => {
  const defaultState = Immutable({
    blocks: [],
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
        pageId: 1,
      };

      mockApi.get(`/pages/${payload.pageId}/blocks`).reply(OK, response);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(PageBlockRoutines.fetchList.success(response))
        .dispatch(PageBlockRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('when setBlocks action is called', () => {
    it('should put setBlocks.success action', async () => {
      const response = {
        id: 1,
      };
      const active = ['1'];
      const inactive = ['2'];
      const payload = {
        pageId: 1,
        active,
        inactive,
      };

      mockApi.post(`/pages/${payload.pageId}/set-blocks`, { active, inactive }).reply(OK, response);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(PageBlockRoutines.setBlocks.success(response))
        .dispatch(PageBlockRoutines.setBlocks(payload))
        .silentRun();
    });
  });
});
