import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as dataSourceTagsReducer, DataSourceTagsRoutines } from '../dataSourceTags.redux';

describe('DataSourceTags: redux', () => {
  const state = Immutable({
    dataSourceTags: {},
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(dataSourceTagsReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(dataSourceTagsReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });

    describe('when FETCH_DATA_SOURCE_TAGS/SUCCESS action is received', () => {
      it('should set dataSourceTags ', () => {
        const dataSourceTags = [{ id: 1 }];
        const resultState = dataSourceTagsReducer(
          state,
          DataSourceTagsRoutines.fetchDataSourceTags.success(dataSourceTags)
        );

        expect(resultState.dataSourceTags).to.deep.equal(dataSourceTags);
      });
    });

    describe('when UPDATE_DATA_SOURCE_TAGS/SUCCESS action is received', () => {
      it('should set dataSourceTags ', () => {
        const dataSourceTags = [{ id: 1 }];
        const resultState = dataSourceTagsReducer(
          state,
          DataSourceTagsRoutines.updateDataSourceTags.success(dataSourceTags)
        );

        expect(resultState.dataSourceTags).to.deep.equal(dataSourceTags);
      });
    });
  });
});
