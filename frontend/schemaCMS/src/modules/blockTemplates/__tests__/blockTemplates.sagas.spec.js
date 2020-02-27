import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { watchBlockTemplates } from '../blockTemplates.sagas';
import { BlockTemplatesRoutines } from '../blockTemplates.redux';
import mockApi from '../../../shared/utils/mockApi';
import { BLOCK_TEMPLATES_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { ProjectRoutines } from '../../project';

describe('BlockTemplates: sagas', () => {
  const defaultState = Immutable({});

  describe('when /PROJECTS_FETCH_BLOCKS action is fired', () => {
    it('should put fetchBlocks action', async () => {
      const projectId = 'projectId';
      const response = {
        id: 1,
        results: [],
        project: {},
      };

      mockApi.get(`${PROJECTS_PATH}/${projectId}${BLOCK_TEMPLATES_PATH}`).reply(OK, response);

      await expectSaga(watchBlockTemplates)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(BlockTemplatesRoutines.fetchBlocks.success(response.results))
        .dispatch(BlockTemplatesRoutines.fetchBlocks({ projectId }))
        .silentRun();
    });
  });
});
