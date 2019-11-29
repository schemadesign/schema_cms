import Immutable from 'seamless-immutable';
import nock from 'nock';
import { OK } from 'http-status-codes';
import { expectSaga } from 'redux-saga-test-plan';

import { watchPageBlock } from '../pageBlock.sagas';
import { PageBlockRoutines } from '../pageBlock.redux';
import mockApi from '../../../shared/utils/mockApi';
import { IMAGE_TYPE, MARKDOWN_TYPE } from '../pageBlock.constants';
import browserHistory from '../../../shared/utils/history';
import { BLOCK_PATH } from '../../../shared/utils/api.constants';

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

  describe('when fetchOne action is called', () => {
    it('should put fetchOne.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        blockId: 1,
      };

      mockApi.get(`/blocks/${payload.blockId}`).reply(OK, response);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(PageBlockRoutines.fetchOne.success(response))
        .dispatch(PageBlockRoutines.fetchOne(payload))
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

  describe('when create action is called', () => {
    it('should put create.success action', async () => {
      jest.spyOn(browserHistory, 'push');
      const response = {
        id: 1,
      };

      const payload = {
        pageId: 1,
        name: 'Title',
        type: [MARKDOWN_TYPE],
      };

      mockApi
        .post(`/pages/${payload.pageId}/blocks`, /form-data; name="name"[^]*name/m, {
          name: 'Title',
          type: [MARKDOWN_TYPE],
        })
        .reply(OK, response);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(PageBlockRoutines.create.success(response))
        .dispatch(PageBlockRoutines.create(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/page/${payload.pageId}`);
    });

    it('should put create.success action for image type', async () => {
      const response = {
        id: 1,
      };

      const payload = {
        pageId: 1,
        name: 'Title',
        image: 'file',
        type: [IMAGE_TYPE],
      };

      const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      mockApi
        .post(`/pages/${payload.pageId}/blocks`, /form-data; name="name"[^]*name/m, options, {
          name: 'Title',
          type: [MARKDOWN_TYPE],
        })
        .reply(OK, response);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(PageBlockRoutines.create.success(response))
        .dispatch(PageBlockRoutines.create(payload))
        .silentRun();
    });
  });

  describe('when update action is called', () => {
    it('should put update.success action for image type', async () => {
      jest.spyOn(browserHistory, 'push');
      const response = {
        id: 1,
      };

      const payload = {
        pageId: 1,
        blockId: 2,
        name: 'Title',
        image: 'file',
        type: [IMAGE_TYPE],
      };

      const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      mockApi
        .patch(`/blocks/${payload.blockId}`, /form-data; name="name"[^]*name/m, options, {
          name: 'Title',
          type: [MARKDOWN_TYPE],
        })
        .reply(OK, response);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(PageBlockRoutines.update.success(response))
        .dispatch(PageBlockRoutines.update(payload))
        .silentRun();
      expect(browserHistory.push).toBeCalledWith(`/page/${payload.pageId}`);
    });
  });

  describe('removeOne', () => {
    it('should dispatch a success action', async () => {
      jest.spyOn(browserHistory, 'push');
      const payload = { blockId: '1', pageId: '1' };

      mockApi.delete(`${BLOCK_PATH}/${payload.blockId}`).reply(OK);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(PageBlockRoutines.removeOne.success())
        .dispatch(PageBlockRoutines.removeOne(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/page/${payload.pageId}/`);
    });
  });
});
