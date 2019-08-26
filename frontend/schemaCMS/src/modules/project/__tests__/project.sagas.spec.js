import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';

// import { watchProject } from '../project.sagas';
import { ProjectActions } from '../project.redux';

describe('Project: sagas', () => {
  const defaultState = Immutable({});

  it('should implement a test', async () => {
    await expectSaga(watchStartup)
      .withState(defaultState)
      .put(ProjectActions.noop())
      .dispatch(StartupActions.startup())
      .run();

    expect(sagaTester.getCalledActions()).to.deep.equal([ProjectActions.noop()]);
  });
});
