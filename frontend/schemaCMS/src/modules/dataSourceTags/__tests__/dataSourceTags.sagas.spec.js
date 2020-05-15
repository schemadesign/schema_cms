import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';

import { watchDataSourceTags } from '../dataSourceTags.sagas';
import { DataSourceTagsRoutines } from '../dataSourceTags.redux';

describe('DataSourceTags: sagas', () => {
  const defaultState = Immutable({});

  it('should implement a test', async () => {
    await expectSaga(watchDataSourceTags)
      .withState(defaultState)
      .put(DataSourceTagsRoutines.noop.success())
      .dispatch(DataSourceTagsRoutines.noop())
      .silentRun();
  });
});
