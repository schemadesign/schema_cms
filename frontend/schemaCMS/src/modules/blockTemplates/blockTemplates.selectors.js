import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectBlockTemplatesDomain = prop('blockTemplates');

export const selectBlockTemplates = createSelector(
  selectBlockTemplatesDomain,
  prop('blocks')
);
