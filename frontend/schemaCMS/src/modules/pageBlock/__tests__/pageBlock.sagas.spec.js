import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';
import { expectSaga } from 'redux-saga-test-plan';

import { watchPageBlock } from '../pageBlock.sagas';
import { PageBlockRoutines } from '../pageBlock.redux';
import mockApi from '../../../shared/utils/mockApi';
import { CODE_TYPE, IMAGE_TYPE, MARKDOWN_TYPE } from '../pageBlock.constants';
import browserHistory from '../../../shared/utils/history';
import { BLOCK_PATH } from '../../../shared/utils/api.constants';
import { ProjectRoutines } from '../../project';

describe('PageBlock: sagas', () => {
  const defaultState = Immutable({
    blocks: [],
  });

  describe('when fetchList action is called', () => {
    it('should put fetchList.success action', async () => {
      const response = {
        id: 1,
        results: [],
        project: {},
      };
      const payload = {
        pageId: 1,
      };

      mockApi.get(`/pages/${payload.pageId}/blocks`).reply(OK, response);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(PageBlockRoutines.fetchList.success(response.results))
        .dispatch(PageBlockRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('when fetchOne action is called', () => {
    it('should put fetchOne.success action', async () => {
      const response = {
        id: 1,
        project: {},
      };
      const payload = {
        blockId: 1,
      };

      mockApi.get(`/blocks/${payload.blockId}`).reply(OK, response);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
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
      const blocks = [{ id: '1' }];
      const payload = {
        pageId: 1,
        blocks,
      };

      mockApi.post(`/pages/${payload.pageId}/set-blocks`, blocks).reply(OK, response);

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
        type: MARKDOWN_TYPE,
        images: null,
        [`${MARKDOWN_TYPE}-content`]: 'content markdown type',
      };

      mockApi
        .post(`/pages/${payload.pageId}/blocks`, /form-data; name="content"[^]*content markdown type/m)
        .reply(OK, response);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(PageBlockRoutines.create.success(response))
        .dispatch(PageBlockRoutines.create(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/page/${payload.pageId}`, { fromBlock: true });
    });

    it('should put create.success action for image type', async () => {
      const response = {
        id: 1,
      };

      const payload = {
        pageId: 1,
        name: 'Title',
        images: [{ file: 'file' }],
        type: IMAGE_TYPE,
        imageNames: [{ id: 1 }, { id: 'image0' }],
        deleteImages: [],
      };

      const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      mockApi
        .post(
          `/pages/${payload.pageId}/blocks`,
          /form-data; name="images_order"[^]*{"1":0,"image0":1}[^]*"image0"[^]*file/m,
          options
        )
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
        type: CODE_TYPE,
        [`${CODE_TYPE}-content`]: 'content code type',
      };

      const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      mockApi
        .patch(`/blocks/${payload.blockId}`, /form-data; name="content"[^]*content code type/m, options)
        .reply(OK, response);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(PageBlockRoutines.update.success(response))
        .dispatch(PageBlockRoutines.update(payload))
        .silentRun();
      expect(browserHistory.push).toBeCalledWith(`/page/${payload.pageId}`, { fromBlock: true });
    });
  });

  describe('removeOne', () => {
    it('should dispatch a success action', async () => {
      jest.spyOn(browserHistory, 'push');
      const payload = { blockId: '1', pageId: '1' };

      mockApi.delete(`${BLOCK_PATH}/${payload.blockId}`).reply(OK);

      await expectSaga(watchPageBlock)
        .withState(defaultState)
        .put(PageBlockRoutines.removeOne.success({ blockId: payload.blockId }))
        .dispatch(PageBlockRoutines.removeOne(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/page/${payload.pageId}/`, { fromBlock: true });
    });
  });
});
