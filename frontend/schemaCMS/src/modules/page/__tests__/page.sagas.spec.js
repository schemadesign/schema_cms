import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import nock from 'nock';
import { OK } from 'http-status-codes';

import { watchPage } from '../page.sagas';
import { PageRoutines } from '../page.redux';
import mockApi from '../../../shared/utils/mockApi';

describe('Directory: sagas', () => {
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
});
