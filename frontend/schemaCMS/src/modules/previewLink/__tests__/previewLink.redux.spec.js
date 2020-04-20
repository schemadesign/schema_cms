import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as previewLinkReducer, PreviewLinkRoutines } from '../previewLink.redux';

describe('PreviewLink: redux', () => {
  const state = Immutable({
    metaTags: null,
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(previewLinkReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(previewLinkReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when PREVIEW_LINK/FETCH_LINK_SUCCESS action is received', () => {
    it('should set page templates', () => {
      const metaTags = { title: 'a title' };
      const resultState = previewLinkReducer(state, PreviewLinkRoutines.fetchLink.success(metaTags));

      expect(resultState.metaTags).to.deep.equal(metaTags);
    });
  });
});
