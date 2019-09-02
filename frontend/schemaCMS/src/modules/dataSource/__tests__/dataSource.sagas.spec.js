import Immutable from 'seamless-immutable';
import SagaTester from 'redux-saga-tester';
import { expect } from 'chai';

import { watchDataSource } from '../dataSource.sagas';
import { DataSourceRoutines } from '../dataSource.redux';

describe('DataSource: sagas', () => {
  const defaultState = Immutable({});

  const getSagaTester = (initialState = {}) => {
    const sagaTester = new SagaTester({
      initialState: defaultState.merge(initialState, { deep: true }),
    });
    sagaTester.start(watchDataSource);
    return sagaTester;
  };

  it('should dispatch a success action', async () => {
    const sagaTester = getSagaTester();
    const requestData = { ProjectId: 1 };

    sagaTester.dispatch(DataSourceRoutines.create(requestData));

    const expectedAction = await sagaTester.waitFor(DataSourceRoutines.create.SUCCESS);
    expect(expectedAction).to.deep.equal(
      DataSourceRoutines.create.success({
        id: 1,
        status: 'draft',
      })
    );
  });
});
