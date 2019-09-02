import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as dataSourceReducer } from '../dataSource.redux';

describe('DataSource: redux', () => {
  const state = Immutable({
    dataSource: {},
    dataSources: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(dataSourceReducer(undefined, {})).to.deep.equal(state);
    });
  });
});
