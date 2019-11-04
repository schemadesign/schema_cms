import { expectSaga } from 'redux-saga-test-plan';
import * as sagaTester from 'redux-saga-tester';
import Immutable from 'seamless-immutable';

import { watchFilter } from '../filter.sagas';
import { FilterRoutines } from '../filter.redux';

describe('Filter: sagas', () => {
  const defaultState = Immutable({});

  it('should implement a test', async () => {
    await expectSaga(watchFilter)
      .withState(defaultState)
      .put(FilterRoutines.noop())
      .dispatch(FilterRoutines.fetchList())
      .silentRun();

    expect(sagaTester.getCalledActions()).to.deep.equal([FilterRoutines.noop()]);
  });
});
