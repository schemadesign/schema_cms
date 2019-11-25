import Immutable from 'seamless-immutable';
import nock from 'nock';
import { OK } from 'http-status-codes';
import { expectSaga } from 'redux-saga-test-plan';

import { watchBlock } from '../block.sagas';
import { BlockRoutines } from '../block.redux';
import mockApi from '../../../shared/utils/mockApi';

describe('Block: sagas', () => {
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

      await expectSaga(watchBlock)
        .withState(defaultState)
        .put(BlockRoutines.fetchList.success(response))
        .dispatch(BlockRoutines.fetchList(payload))
        .silentRun();
    });
  });
});
