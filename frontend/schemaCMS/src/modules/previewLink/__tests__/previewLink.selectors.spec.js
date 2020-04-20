import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectPreviewLinkDomain, selectMetaTags } from '../previewLink.selectors';

describe('PreviewLink: selectors', () => {
  const state = Immutable({
    previewLink: {
      metaTags: null,
    },
  });

  describe('selectPreviewLinkDomain', () => {
    it('should select a domain', () => {
      expect(selectPreviewLinkDomain(state)).to.equal(state.previewLink);
    });

    it('should select metaTagas', () => {
      expect(selectMetaTags(state)).to.equal(state.previewLink.metaTags);
    });
  });
});
