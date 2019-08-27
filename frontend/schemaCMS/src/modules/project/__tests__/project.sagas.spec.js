import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';

import { watchProject } from '../project.sagas';
import { ProjectActions } from '../project.redux';

describe('Project: sagas', () => {
  const defaultState = Immutable({});

  // it('should implement a test', async () => {
  //   await expectSaga(watchProject)
  //     .withState(defaultState)
  //     .put(ProjectActions.fetchListSuccess())
  //     .dispatch(ProjectActions.fetchList({data: {results: []}}))
  //     .run();

  //   expect(sagaTester.getCalledActions()).to.deep.equal([ProjectActions.noop()]);
  // });
});
