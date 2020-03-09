import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { watchPageTemplates } from '../pageTemplates.sagas';
import { PageTemplatesRoutines } from '../pageTemplates.redux';
import mockApi from '../../../shared/utils/mockApi';
import { PAGE_TEMPLATES_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { ProjectRoutines } from '../../project';

describe('PageTemplates: sagas', () => {
  const defaultState = Immutable({});

  describe('when /FETCH_PAGE_TEMPLATES action is fired', () => {
    it('should put fetchPageTemplates action', async () => {
      const projectId = 'projectId';
      const response = {
        id: 1,
        results: [],
        project: {},
      };

      mockApi.get(`${PROJECTS_PATH}/${projectId}${PAGE_TEMPLATES_PATH}`).reply(OK, response);

      await expectSaga(watchPageTemplates)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(PageTemplatesRoutines.fetchPageTemplates.success(response.results))
        .dispatch(PageTemplatesRoutines.fetchPageTemplates({ projectId }))
        .silentRun();
    });
  });
});
