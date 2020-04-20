import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectPreviewLinkDomain = prop('previewLink');

export const selectMetaTags = createSelector(
  selectPreviewLinkDomain,
  prop('metaTags')
);
