import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as tagReducer, TagRoutines } from '../tag.redux';

describe('Tag: redux', () => {
  const state = Immutable({
    tags: [],
    tag: {},
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(tagReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(tagReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when FILTERS/FETCH_LIST action is received', () => {
    it('should set tags', () => {
      const tags = [{ data: 'data' }];

      const resultState = tagReducer(state, TagRoutines.fetchList.success(tags));
      expect(resultState.tags).to.deep.equal(tags);
    });
  });

  describe('when FILTERS/SET_FILTERS action is received', () => {
    it('should set tags', () => {
      const tags = [{ data: 'data' }];

      const resultState = tagReducer(state, TagRoutines.setTags.success(tags));
      expect(resultState.tags).to.deep.equal(tags);
    });
  });

  describe('when FILTERS/FETCH_FILTER action is received', () => {
    it('should set tags', () => {
      const tag = [{ data: 'data' }];

      const resultState = tagReducer(state, TagRoutines.fetchTag.success(tag));
      expect(resultState.tag).to.deep.equal(tag);
    });
  });
});
