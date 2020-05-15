import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as dataSourceTagsReducer } from '../dataSourceTags.redux';

describe('DataSourceTags: redux', () => {
  const state = Immutable({});

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(dataSourceTagsReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(dataSourceTagsReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });
});
