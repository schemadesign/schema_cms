import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as tagReducer, ProjectTagRoutines } from '../projectTag.redux';

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

  describe('when TAG/FETCH_LIST action is received', () => {
    it('should set tags', () => {
      const tags = [{ data: 'data' }];

      const resultState = tagReducer(state, ProjectTagRoutines.fetchList.success(tags));
      expect(resultState.tags).to.deep.equal(tags);
    });
  });

  describe('when TAG/SET_TAG action is received', () => {
    it('should set tags', () => {
      const tags = [{ data: 'data' }];

      const resultState = tagReducer(state, ProjectTagRoutines.setTags.success(tags));
      expect(resultState.tags).to.deep.equal(tags);
    });
  });

  describe('when TAG/FETCH_TAG action is received', () => {
    it('should set tags', () => {
      const tag = [{ data: 'data' }];

      const resultState = tagReducer(state, ProjectTagRoutines.fetchTag.success(tag));
      expect(resultState.tag).to.deep.equal(tag);
    });
  });
});
